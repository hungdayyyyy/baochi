"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PopulatedArticle } from "@/types";

import { getProxiedImageUrl } from "@/lib/image-helper";

interface StreamProps {
  initialArticles: PopulatedArticle[];
  initialCursor: { cursorDate: string; cursorId: string } | null;
  categorySlug: string;
}

export default function CategoryArticleStream({
  initialArticles,
  initialCursor,
  categorySlug,
}: StreamProps) {
  const [articles, setArticles] = useState<PopulatedArticle[]>(initialArticles);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (!cursor || loading) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/articles?category=${categorySlug}&cursorDate=${encodeURIComponent(
          cursor.cursorDate
        )}&cursorId=${cursor.cursorId}`
      );
      const data = await res.json();

      if (data.articles && data.articles.length > 0) {
        setArticles((prev) => [...prev, ...data.articles]);
        setCursor(data.nextCursor);
      } else {
        setCursor(null);
      }
    } catch (e) {
      console.error("Error loading more articles:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="divide-y divide-gray-200">
        {articles.map((art) => (
          <article
            key={art._id}
            className="group flex flex-col sm:flex-row items-start gap-5 sm:gap-6 py-6 first:pt-0 last:pb-0"
          >
            {/* Image Thumbnail (Matching reference image) */}
            <Link
              href={`/${art.slug}`}
              className="w-full sm:w-[220px] md:w-[250px] aspect-[16/10] shrink-0 relative overflow-hidden bg-gray-100 block"
            >
              <Image
                src={getProxiedImageUrl(art.coverImage?.url)}
                alt={art.title}
                fill
                sizes="(max-width: 640px) 100vw, 250px"
                priority={true}
                unoptimized={true}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Article Content: Title, Excerpt, Author */}
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-[18px] md:text-[20px] font-bold leading-snug text-[#111111] group-hover:text-[#f4121e] transition-colors mb-2">
                <Link href={`/${art.slug}`}>{art.title}</Link>
              </h3>

              <p className="text-[#555555] text-[13.5px] leading-relaxed line-clamp-3 mb-2.5 font-sans">
                {art.excerpt}
              </p>

              <div className="text-[12px] text-[#888888] font-sans">
                <span>Tác giả </span>
                <span className="text-[#888888]">
                  {art.author?.name || "Forbes Việt Nam"}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {cursor && (
        <div className="text-center mt-12 mb-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-[#181716] hover:bg-[#f4121e] text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 transition-colors disabled:opacity-50"
          >
            {loading ? "Đang tải dữ liệu..." : "Tải thêm bài viết"}
          </button>
        </div>
      )}
    </div>
  );
}
