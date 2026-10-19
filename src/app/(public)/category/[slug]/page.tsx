import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryArticlesCursor } from "@/lib/cache";
import CategoryArticleStream from "@/components/public/CategoryArticleStream";
import ArticleCard from "@/components/public/ArticleCard";

export const revalidate = 300;

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await getCategoryArticlesCursor({ categorySlug: params.slug, limit: 1 });
  if (!category) return { title: "Chuyên mục | Forbes Việt Nam" };

  return {
    title: `${category.name} - Forbes Việt Nam`,
    description: `Tin tức, phân tích chuyên sâu về ${category.name} trên Forbes Việt Nam.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const data = await getCategoryArticlesCursor({ categorySlug: params.slug, limit: 10 });
  if (!data.category) {
    notFound();
  }

  const { category, articles, nextCursor } = data;
  const lead = articles[0];
  const streamArticles = articles.slice(1);

  return (
    <div className="w-full py-8 bg-[#fafbfc] min-h-screen">
      <div className="forbes-container">
        {/* Category Header Title & Breadcrumb */}
        <div className="mb-8 border-b-2 border-[#111111] pb-4">
          <div className="text-xs text-gray-500 font-sans mb-2 flex items-center space-x-2">
            <Link href="/" className="hover:text-black">Trang chủ</Link>
            <span>/</span>
            <span className="text-[#d8361e] font-semibold">{category.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold uppercase text-[#111111]">
              {category.name}
            </h1>
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-2 sm:mt-0">
              Forbes Việt Nam Intelligence
            </span>
          </div>
        </div>

        {/* Lead Spotlight Story of Category */}
        {lead && (
          <div className="mb-12 bg-white p-6 rounded border border-gray-200 shadow-sm">
            <ArticleCard article={lead} variant="lead" showCategory={false} />
          </div>
        )}

        {/* Article Stream with cursor-based pagination */}
        <CategoryArticleStream
          categorySlug={category.slug}
          initialArticles={streamArticles}
          initialCursor={nextCursor}
        />
      </div>
    </div>
  );
}
