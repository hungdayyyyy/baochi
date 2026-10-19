import Link from "next/link";
import Image from "next/image";
import { PopulatedArticle } from "@/types";
import { getProxiedImageUrl } from "@/lib/image-helper";

interface FeatureGridProps {
  articles: PopulatedArticle[];
  columns?: 2 | 3;
  className?: string;
}

export default function FeatureGrid({
  articles,
  columns = 2,
  className = "",
}: FeatureGridProps) {
  if (!articles || articles.length === 0) return null;

  const gridColsClass = columns === 3 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-2";

  return (
    <div className={`grid ${gridColsClass} gap-4 sm:gap-5 ${className}`}>
      {articles.map((article) => (
        <article key={article._id} className="group flex flex-col">
          <Link
            href={`/${article.slug}`}
            className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100 rounded-none block mb-2.5"
          >
            <Image
              src={getProxiedImageUrl(article.coverImage?.url)}
              alt={article.title}
              fill
              unoptimized={true}
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </Link>

          <h4
            className="font-serif text-[14.5px] sm:text-[15px] font-bold leading-snug text-[#111111] group-hover:text-[#f4121e] transition-colors line-clamp-2 mb-1.5"
            style={{ fontFamily: "var(--font-merriweather)" }}
          >
            <Link href={`/${article.slug}`}>{article.title}</Link>
          </h4>

          {article.author?.name && (
            <div className="text-[10.5px] font-sans font-semibold uppercase tracking-wider text-[#8c8c8c]">
              TÁC GIẢ {article.author.name}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
