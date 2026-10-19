import Link from "next/link";
import connectDB from "@/lib/db/mongodb";
import Article from "@/lib/db/models/Article";
import { normalizeSearchText } from "@/lib/vietnamese";
import ArticleCard from "@/components/public/ArticleCard";
import { PopulatedArticle } from "@/types";

interface SearchPageProps {
  searchParams: { q?: string };
}

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q ? searchParams.q.trim() : "";
  let articles: PopulatedArticle[] = [];

  if (query) {
    try {
      await connectDB();
      const normalizedQuery = normalizeSearchText(query);

      // Search via regex on normalized searchText field + title
      const results: any[] = await Article.find({
        status: "published",
        deletedAt: null,
        $or: [
          { searchText: { $regex: normalizedQuery, $options: "i" } },
          { title: { $regex: query, $options: "i" } },
          { excerpt: { $regex: query, $options: "i" } },
        ],
      })
        .sort({ publishedAt: -1 })
        .limit(30)
        .populate("categoryId", "name slug")
        .populate("authorId", "name slug avatarUrl role")
        .populate("tagIds", "name slug")
        .lean();

      articles = results.map((art) => ({
        ...art,
        _id: art._id.toString(),
        category: art.categoryId ? { _id: (art.categoryId as any)._id.toString(), name: (art.categoryId as any).name, slug: (art.categoryId as any).slug } : null,
        author: art.authorId ? { _id: (art.authorId as any)._id.toString(), name: (art.authorId as any).name, slug: (art.authorId as any).slug, avatarUrl: (art.authorId as any).avatarUrl, role: (art.authorId as any).role } : null,
        tags: (art.tagIds || []).map((t: any) => ({ _id: t._id.toString(), name: t.name, slug: t.slug })),
      }));
    } catch (e) {
      console.warn("Search query could not connect to MongoDB:", e);
      articles = [];
    }
  }

  return (
    <div className="w-full py-10 bg-[#fafbfc] min-h-screen">
      <div className="forbes-container">
        {/* Header */}
        <div className="border-b-2 border-[#111111] pb-4 mb-8">
          <h1 className="font-serif text-3xl font-extrabold text-[#111111] mb-2">
            Kết quả tìm kiếm
          </h1>
          <p className="text-sm text-gray-600 font-sans">
            {query ? (
              <>
                Tìm thấy <span className="font-bold text-[#d8361e]">{articles.length}</span> kết quả cho từ khoá:{" "}
                <span className="font-bold text-[#111111]">"{query}"</span>
              </>
            ) : (
              "Vui lòng nhập từ khoá tìm kiếm."
            )}
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="max-w-2xl mb-10">
          <form method="GET" action="/search" className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Nhập từ khoá tìm kiếm..."
              className="flex-1 bg-white border border-gray-300 px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#d8361e]"
            />
            <button
              type="submit"
              className="bg-[#111111] hover:bg-[#d8361e] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded transition-colors"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Results Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <div key={art._id} className="bg-white p-4 rounded border border-gray-100 hover:shadow-md transition-shadow">
                <ArticleCard article={art} variant="vertical" />
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="bg-white p-12 text-center rounded border border-gray-200">
            <p className="text-gray-500 text-sm">
              Không tìm thấy bài viết nào phù hợp với từ khoá. Hãy thử tìm kiếm bằng từ khoá không dấu hoặc từ đồng nghĩa.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
