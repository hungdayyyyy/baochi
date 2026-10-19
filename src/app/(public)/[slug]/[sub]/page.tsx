import { notFound } from "next/navigation";
import connectDB from "@/lib/db/mongodb";
import Category from "@/lib/db/models/Category";
import { getFallbackData } from "@/lib/cache";
import SubcategoryPageTemplate from "@/components/public/SubcategoryPageTemplate";

export const revalidate = 300;

interface SubcategoryPageProps {
  params: { slug: string; sub: string };
}

export async function generateMetadata({ params }: SubcategoryPageProps) {
  const fullSlug = `${params.slug}/${params.sub}`;

  const fallback = getFallbackData();
  if (fallback?.categories) {
    const sub = fallback.categories.find(
      (c: any) =>
        c.slug === fullSlug ||
        c.slug === params.sub ||
        c.slug.endsWith("/" + params.sub) ||
        (c.slug.startsWith(params.slug + "/") && c.slug.includes(params.sub)) ||
        c.slug.includes(params.sub)
    );
    if (sub) {
      return {
        title: `${sub.name} - Forbes Việt Nam`,
        description: `Tin tức và phân tích chuyên sâu về ${sub.name} trên Forbes Việt Nam`,
      };
    }
  }

  try {
    await connectDB();
    const subCategory: any =
      (await Category.findOne({ slug: fullSlug }).lean()) ||
      (await Category.findOne({ slug: params.sub }).lean()) ||
      (await Category.findOne({ slug: { $regex: new RegExp(`/${params.sub}$`) } }).lean());

    if (subCategory) {
      return {
        title: `${subCategory.name} - Forbes Việt Nam`,
        description: `Tin tức và phân tích chuyên sâu về ${subCategory.name} trên Forbes Việt Nam`,
      };
    }
  } catch (e) {
    console.warn("DB error in subcategory metadata:", e);
  }

  const subName = params.sub
    .split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { title: `${subName} - Forbes Việt Nam` };
}

export default async function SubcategoryDynamicPage({ params }: SubcategoryPageProps) {
  const fullSlug = `${params.slug}/${params.sub}`;

  let subCategory: any = null;
  let parentCategory: any = null;
  let siblings: any[] = [];

  const fallback = getFallbackData();
  if (fallback?.categories) {
    subCategory = fallback.categories.find(
      (c: any) =>
        c.slug === fullSlug ||
        c.slug === params.sub ||
        c.slug.endsWith("/" + params.sub) ||
        (c.slug.startsWith(params.slug + "/") && c.slug.includes(params.sub)) ||
        c.slug.includes(params.sub)
    );
    if (subCategory) {
      parentCategory = fallback.categories.find(
        (c: any) => c._id === subCategory.parentId || c.slug === params.slug
      );
      if (parentCategory) {
        siblings = fallback.categories.filter(
          (c: any) => c.parentId === parentCategory._id || c.parentId === parentCategory.slug
        );
      }
    }
  }

  if (!subCategory) {
    try {
      await connectDB();
      subCategory =
        (await Category.findOne({ slug: fullSlug }).lean()) ||
        (await Category.findOne({ slug: params.sub }).lean()) ||
        (await Category.findOne({ slug: { $regex: new RegExp(`/${params.sub}$`) } }).lean());

      if (subCategory) {
        if (subCategory.parentId) {
          parentCategory = await Category.findById(subCategory.parentId).lean();
        }
        if (!parentCategory) {
          parentCategory = await Category.findOne({ slug: params.slug }).lean();
        }

        if (parentCategory) {
          siblings = await Category.find({ parentId: parentCategory._id })
            .sort({ position: 1 })
            .lean();
        }
      }
    } catch (e) {
      console.warn("DB error in subcategory page:", e);
    }
  }

  // Fallback for special slugs like Tiêu điểm & Góc nhìn
  if (!subCategory && (params.slug === "goc-nhin" || params.slug === "tieu-diem")) {
    if (params.sub.includes("y-tuong")) {
      subCategory = { name: "Ý tưởng", slug: "goc-nhin/y-tuong" };
    } else {
      subCategory = { name: "Sự kiện và Bình luận", slug: "goc-nhin/su-kien-va-binh-luan" };
    }
    parentCategory = { name: "Tiêu điểm", slug: "tieu-diem" };
    siblings = [
      { name: "Sự kiện và Bình luận", slug: "goc-nhin/su-kien-va-binh-luan" },
      { name: "Ý tưởng", slug: "goc-nhin/y-tuong" },
    ];
  }

  // Clean resilient fallback if not found anywhere so user never gets 404
  if (!subCategory) {
    const subName = params.sub
      .split("-")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const parentName = params.slug
      .split("-")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    subCategory = {
      _id: `cat_${params.slug}_${params.sub}`,
      name: subName,
      slug: fullSlug,
    };
    parentCategory = {
      _id: `cat_${params.slug}`,
      name: parentName,
      slug: params.slug,
    };
  }

  const formattedSub = {
    _id: subCategory._id?.toString() || subCategory.slug,
    name: subCategory.name,
    slug: subCategory.slug,
  };

  const formattedParent = parentCategory
    ? {
        _id: parentCategory._id?.toString() || parentCategory.slug,
        name: parentCategory.name,
        slug: parentCategory.slug === "goc-nhin" ? "tieu-diem" : parentCategory.slug,
        siblings: siblings.map((s: any) => ({
          _id: s._id?.toString() || s.slug,
          name: s.name,
          slug: s.slug,
        })),
      }
    : null;

  return (
    <SubcategoryPageTemplate
      category={formattedSub}
      parentCategory={formattedParent}
    />
  );
}
