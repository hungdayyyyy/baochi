import { unstable_cache } from "next/cache";
import connectDB from "./db/mongodb";
import Article from "./db/models/Article";
import Category from "./db/models/Category";
import Layout from "./db/models/Layout";
import { PopulatedArticle } from "@/types";

export const ARTICLE_LIST_PROJECTION = {
  title: 1,
  slug: 1,
  excerpt: 1,
  coverImage: 1,
  categoryId: 1,
  authorId: 1,
  tagIds: 1,
  status: 1,
  publishedAt: 1,
  isFeatured: 1,
  viewCount: 1,
  createdAt: 1,
};

let bundledFallback: any = null;
try {
  bundledFallback = require("@/data/fallback_articles.json");
} catch {
  bundledFallback = null;
}

export function getFallbackData() {
  if (process.env.FORCE_DB === "true") {
    return null;
  }
  return bundledFallback;
}

// Fetch Category by Slug (fallback JSON first, then MongoDB)
export const getCategoryBySlug = unstable_cache(
  async (slug: string) => {
    const fallback = getFallbackData();
    if (fallback && fallback.categories) {
      const clean = slug.replace(/^\/+|\/+$/g, "");
      const found = fallback.categories.find(
        (c: any) => c.slug === clean || c.slug.endsWith("/" + clean)
      );
      if (found) {
        const children = fallback.categories.filter(
          (c: any) => c.parentId === found._id || c.parentId === found.slug
        );
        return {
          _id: found._id,
          name: found.name,
          slug: found.slug,
          children: children.map((c: any) => ({
            _id: c._id,
            name: c.name,
            slug: c.slug,
          })),
        };
      }
    }

    try {
      await connectDB();
      const clean = slug.replace(/^\/+|\/+$/g, "");
      const category: any =
        (await Category.findOne({ slug: clean }).lean()) ||
        (await Category.findOne({ slug: { $regex: new RegExp(`/${clean}$`) } }).lean());

      if (!category) return null;

      const children = await Category.find({ parentId: category._id })
        .sort({ position: 1 })
        .lean();

      return JSON.parse(
        JSON.stringify({
          _id: category._id.toString(),
          name: category.name,
          slug: category.slug,
          children: children.map((c: any) => ({
            _id: c._id.toString(),
            name: c.name,
            slug: c.slug,
          })),
        })
      );
    } catch (e) {
      console.warn(`Database query failed for category [${slug}]:`, e);
      return null;
    }
  },
  ["category-by-slug"],
  { revalidate: 300, tags: ["categories"] }
);

// Fetch Layout & Articles for a Section
export const getLayoutArticles = unstable_cache(
  async (page: "home" | "category", section: string, categoryId?: string): Promise<PopulatedArticle[]> => {
    const fallback = getFallbackData();
    if (fallback && fallback.layouts && fallback.articles) {
      const layoutSlot = fallback.layouts.find((l: any) => l.page === page && l.section === section);
      if (layoutSlot && layoutSlot.articleIds) {
        const artMap = new Map<string, any>(fallback.articles.map((a: any) => [a._id, a]));
        const results: PopulatedArticle[] = [];
        for (const id of layoutSlot.articleIds) {
          const art = artMap.get(id);
          if (art) results.push(art);
        }
        if (results.length > 0) return JSON.parse(JSON.stringify(results));
      }

      if (fallback.subcategoryArticleMap && fallback.subcategoryArticleMap[section]) {
        const ids = fallback.subcategoryArticleMap[section];
        const artMap = new Map<string, any>(fallback.articles.map((a: any) => [a._id, a]));
        const results = ids.map((id: string) => artMap.get(id)).filter(Boolean);
        if (results.length > 0) return JSON.parse(JSON.stringify(results));
      }
    }

    try {
      await connectDB();
      const query: any = { page, section };
      if (categoryId) query.categoryId = categoryId;

      const layout = await Layout.findOne(query).lean();
      if (!layout || !layout.articleIds || layout.articleIds.length === 0) {
        return [];
      }

      const articles = await Article.find({
        _id: { $in: layout.articleIds },
        status: "published",
        deletedAt: null,
      })
        .select(ARTICLE_LIST_PROJECTION)
        .populate("categoryId", "name slug")
        .populate("authorId", "name slug avatarUrl role")
        .populate("tagIds", "name slug")
        .lean();

      const articleMap = new Map(articles.map((a: any) => [a._id.toString(), a]));
      const ordered: PopulatedArticle[] = [];

      for (const id of layout.articleIds) {
        const art = articleMap.get(id.toString());
        if (art) {
          ordered.push({
            ...art,
            _id: art._id.toString(),
            category: art.categoryId
              ? {
                  _id: (art.categoryId as any)._id.toString(),
                  name: (art.categoryId as any).name,
                  slug: (art.categoryId as any).slug,
                }
              : null,
            author: art.authorId
              ? {
                  _id: (art.authorId as any)._id.toString(),
                  name: (art.authorId as any).name,
                  slug: (art.authorId as any).slug,
                  avatarUrl: (art.authorId as any).avatarUrl,
                  role: (art.authorId as any).role,
                }
              : null,
            tags: (art.tagIds || []).map((t: any) => ({
              _id: t._id.toString(),
              name: t.name,
              slug: t.slug,
            })),
          });
        }
      }

      return JSON.parse(JSON.stringify(ordered));
    } catch (e) {
      console.warn(`Database query failed for layout [${section}]:`, e);
      return [];
    }
  },
  ["layout-articles"],
  { revalidate: 300, tags: ["layouts", "articles"] }
);

// Fetch all categories for navigation
export const getNavCategories = unstable_cache(
  async () => {
    const fallback = getFallbackData();
    if (fallback && fallback.categories) {
      const allCategories = fallback.categories;
      const parentMap = new Map<string, any>();
      const parents: any[] = [];
      const childrenList: any[] = [];

      for (const c of allCategories) {
        const item = {
          _id: c._id,
          name: c.name,
          slug: c.slug,
          parentId: c.parentId || null,
          position: c.position || 0,
          showInMenu: c.showInMenu !== false,
          children: [] as any[],
        };
        parentMap.set(item._id, item);

        if (!c.parentId) {
          if (c.showInMenu) parents.push(item);
        } else {
          childrenList.push(item);
        }
      }

      for (const child of childrenList) {
        const parent = parentMap.get(child.parentId);
        if (parent) parent.children.push(child);
      }

      parents.sort((a, b) => a.position - b.position);
      for (const p of parents) {
        p.children.sort((a: any, b: any) => a.position - b.position);
      }

      return JSON.parse(JSON.stringify(parents));
    }

    try {
      await connectDB();
      const allCategories = await Category.find({})
        .sort({ position: 1, name: 1 })
        .lean();

      const parentMap = new Map<string, any>();
      const parents: any[] = [];
      const childrenList: any[] = [];

      for (const c of allCategories) {
        const item = {
          _id: c._id.toString(),
          name: c.name,
          slug: c.slug,
          parentId: c.parentId ? c.parentId.toString() : null,
          position: c.position,
          showInMenu: c.showInMenu,
          children: [] as any[],
        };
        parentMap.set(item._id, item);

        if (!c.parentId) {
          if (c.showInMenu) {
            parents.push(item);
          }
        } else {
          childrenList.push(item);
        }
      }

      for (const child of childrenList) {
        const parent = parentMap.get(child.parentId);
        if (parent) {
          parent.children.push(child);
        }
      }

      parents.sort((a, b) => a.position - b.position);
      for (const p of parents) {
        p.children.sort((a: any, b: any) => a.position - b.position);
      }

      return JSON.parse(JSON.stringify(parents));
    } catch (e) {
      console.warn("Could not query categories from MongoDB:", e);
      return [];
    }
  },
  ["nav-categories-tree"],
  { revalidate: 300, tags: ["categories"] }
);

// Fetch single article by slug
export const getArticleBySlug = unstable_cache(
  async (slug: string) => {
    const fallback = getFallbackData();
    if (fallback && fallback.articles) {
      const art = fallback.articles.find((a: any) => a.slug === slug);
      if (art) return JSON.parse(JSON.stringify(art));
    }

    try {
      await connectDB();
      const article: any = await Article.findOne({ slug, status: "published", deletedAt: null })
        .populate("categoryId", "name slug")
        .populate("authorId", "name slug bio avatarUrl role")
        .populate("tagIds", "name slug")
        .lean();

      if (!article) return null;

      return JSON.parse(
        JSON.stringify({
          ...article,
          _id: article._id.toString(),
          category: article.categoryId
            ? {
                _id: (article.categoryId as any)._id.toString(),
                name: (article.categoryId as any).name,
                slug: (article.categoryId as any).slug,
              }
            : null,
          author: article.authorId
            ? {
                _id: (article.authorId as any)._id.toString(),
                name: (article.authorId as any).name,
                slug: (article.authorId as any).slug,
                bio: (article.authorId as any).bio,
                avatarUrl: (article.authorId as any).avatarUrl,
                role: (article.authorId as any).role,
              }
            : null,
          tags: (article.tagIds || []).map((t: any) => ({
            _id: t._id.toString(),
            name: t.name,
            slug: t.slug,
          })),
        })
      );
    } catch (e) {
      console.warn("Could not query article from MongoDB:", e);
      return null;
    }
  },
  ["article-detail"],
  { revalidate: 300, tags: ["articles"] }
);

// Cursor-based pagination for category article list
export async function getCategoryArticlesCursor({
  categorySlug,
  cursorDate,
  cursorId,
  limit = 15,
}: {
  categorySlug: string;
  cursorDate?: string;
  cursorId?: string;
  limit?: number;
}) {
  const fallback = getFallbackData();
  if (fallback && fallback.articles) {
    const clean = categorySlug.replace(/^\/+|\/+$/g, "");
    const catArticles = fallback.articles.filter((a: any) => {
      const cSlug = (a.category?.slug || "").replace(/^\/+|\/+$/g, "");
      if (clean === "tieu-diem" || clean === "goc-nhin") {
        return (
          cSlug === "tieu-diem" ||
          cSlug.includes("goc-nhin") ||
          cSlug.includes("su-kien") ||
          cSlug.includes("y-tuong") ||
          cSlug.includes("infographic")
        );
      }
      if (clean.includes("infographic")) {
        return cSlug.includes("infographic") || a.title?.toLowerCase().includes("infographic") || a.slug?.includes("infographic");
      }
      return cSlug === clean || cSlug.startsWith(clean + "/") || cSlug.includes(clean);
    });

    const displayList = catArticles.length > 0 ? catArticles.slice() : fallback.articles.slice();
    // Pad to at least 12 articles if pool is smaller
    if (displayList.length < 12 && fallback.articles.length > 0) {
      const existingIds = new Set(displayList.map((a: any) => a._id));
      for (const a of fallback.articles) {
        if (!existingIds.has(a._id)) {
          displayList.push(a);
          if (displayList.length >= 15) break;
        }
      }
    }

    const categoryItem = fallback.categories?.find((c: any) => c.slug === clean) || {
      _id: `cat_${clean.replace(/\//g, "_")}`,
      name: clean.includes("infographic") ? "Infographic" : clean.charAt(0).toUpperCase() + clean.slice(1).replace(/-/g, " "),
      slug: clean,
    };

    return {
      category: categoryItem,
      articles: displayList.slice(0, limit),
      nextCursor: null,
    };
  }

  try {
    await connectDB();
    const clean = categorySlug.replace(/^\/+|\/+$/g, "");
    const category =
      (await Category.findOne({ slug: clean }).lean()) ||
      (await Category.findOne({ slug: { $regex: new RegExp(`/${clean}$`) } }).lean());

    if (!category) {
      return {
        category: {
          _id: "fallback",
          name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, " "),
          slug: categorySlug,
        },
        articles: [],
        nextCursor: null,
      };
    }

    const childCats = await Category.find({ parentId: category._id }).select("_id").lean();
    const categoryIds = [category._id, ...childCats.map((c: any) => c._id)];

    const query: any = {
      categoryId: { $in: categoryIds },
      status: "published",
      deletedAt: null,
    };

    if (cursorDate && cursorId) {
      query.$or = [
        { publishedAt: { $lt: new Date(cursorDate) } },
        { publishedAt: new Date(cursorDate), _id: { $lt: cursorId } },
      ];
    }

    const articles: any[] = await Article.find(query)
      .sort({ publishedAt: -1, _id: -1 })
      .limit(limit + 1)
      .select(ARTICLE_LIST_PROJECTION)
      .populate("categoryId", "name slug")
      .populate("authorId", "name slug avatarUrl role")
      .populate("tagIds", "name slug")
      .lean();

    const hasMore = articles.length > limit;
    const items = hasMore ? articles.slice(0, limit) : articles;

    const lastItem = items[items.length - 1];
    const nextCursor =
      hasMore && lastItem
        ? {
            cursorDate: lastItem.publishedAt.toISOString(),
            cursorId: lastItem._id.toString(),
          }
        : null;

    return JSON.parse(
      JSON.stringify({
        category: { _id: category._id.toString(), name: category.name, slug: category.slug },
        articles: items.map((art) => ({
          ...art,
          _id: art._id.toString(),
          category: art.categoryId
            ? {
                _id: (art.categoryId as any)._id.toString(),
                name: (art.categoryId as any).name,
                slug: (art.categoryId as any).slug,
              }
            : null,
          author: art.authorId
            ? {
                _id: (art.authorId as any)._id.toString(),
                name: (art.authorId as any).name,
                slug: (art.authorId as any).slug,
                avatarUrl: (art.authorId as any).avatarUrl,
                role: (art.authorId as any).role,
              }
            : null,
          tags: (art.tagIds || []).map((t: any) => ({
            _id: t._id.toString(),
            name: t.name,
            slug: t.slug,
          })),
        })),
        nextCursor,
      })
    );
  } catch (e) {
    console.warn("Could not query category articles from MongoDB:", e);
    return {
      category: {
        _id: "fallback",
        name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, " "),
        slug: categorySlug,
      },
      articles: [],
      nextCursor: null,
    };
  }
}

// Fetch all subcategory tab layout articles
export const getSubcategoryMap = unstable_cache(
  async (): Promise<Record<string, PopulatedArticle[]>> => {
    const fallback = getFallbackData();
    if (fallback && fallback.subcategoryArticleMap && fallback.articles) {
      const artMap = new Map<string, any>(fallback.articles.map((a: any) => [a._id, a]));
      const result: Record<string, PopulatedArticle[]> = {};
      for (const [subSlug, ids] of Object.entries(fallback.subcategoryArticleMap as Record<string, string[]>)) {
        result[subSlug] = (ids as string[]).map((id) => artMap.get(id)).filter(Boolean);
      }
      return JSON.parse(JSON.stringify(result));
    }

    try {
      await connectDB();
      const layouts = await Layout.find({ page: "home", section: { $regex: "/" } }).lean();
      if (!layouts || layouts.length === 0) return {};

      const allIds = layouts.flatMap((l) => l.articleIds || []);
      const articles = await Article.find({ _id: { $in: allIds }, status: "published" })
        .select(ARTICLE_LIST_PROJECTION)
        .populate("categoryId", "name slug")
        .populate("authorId", "name slug avatarUrl role")
        .lean();

      const artMap = new Map(articles.map((a: any) => [a._id.toString(), a]));
      const result: Record<string, PopulatedArticle[]> = {};

      for (const l of layouts) {
        result[l.section] = (l.articleIds || [])
          .map((id: any) => artMap.get(id.toString()))
          .filter(Boolean)
          .map((art: any) => ({
            ...art,
            _id: art._id.toString(),
            category: art.categoryId
              ? {
                  _id: (art.categoryId as any)._id.toString(),
                  name: (art.categoryId as any).name,
                  slug: (art.categoryId as any).slug,
                }
              : null,
            author: art.authorId
              ? {
                  _id: (art.authorId as any)._id.toString(),
                  name: (art.authorId as any).name,
                  slug: (art.authorId as any).slug,
                  avatarUrl: (art.authorId as any).avatarUrl,
                  role: (art.authorId as any).role,
                }
              : null,
          }));
      }

      return JSON.parse(JSON.stringify(result));
    } catch (e) {
      console.warn("Could not load subcategory map from DB:", e);
      return {};
    }
  },
  ["subcategory-layouts-map"],
  { revalidate: 300, tags: ["layouts"] }
);
