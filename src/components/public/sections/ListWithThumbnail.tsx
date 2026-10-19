import Link from "next/link";
import Image from "next/image";
import { PopulatedArticle } from "@/types";
import { getProxiedImageUrl } from "@/lib/image-helper";

interface ListWithThumbnailProps {
  articles: PopulatedArticle[];
  className?: string;
}

export default function ListWithThumbnail({
  articles,
  className = "",
}: ListWithThumbnailProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className={`divide-y divide-gray-200 ${className}`}>
      {articles.map((article) => (
        <article
          key={article._id}
          className="group flex items-start space-x-4 py-3.5 first:pt-0 last:pb-0"
        >
          {/* Small Thumbnail on Left */}
          <Link
            href={`/${article.slug}`}
            className="relative w-[85px] sm:w-[95px] h-[65px] sm:h-[72px] shrink-0 overflow-hidden bg-neutral-100 rounded-none block"
          >
            <Image
              src={getProxiedImageUrl(article.coverImage?.url)}
              alt={article.title}
              fill
              unoptimized={true}
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              sizes="100px"
              loading="lazy"
            />
          </Link>

          {/* Title and Author on Right */}
          <div className="flex-1 min-w-0">
            <h4
              className="font-serif text-[14px] sm:text-[14.5px] font-bold leading-snug text-[#111111] group-hover:text-[#f4121e] transition-colors line-clamp-2 mb-1.5"
              style={{ fontFamily: "var(--font-merriweather)" }}
            >
              <Link href={`/${article.slug}`}>{article.title}</Link>
            </h4>

            <div className="text-[10.5px] font-sans font-semibold uppercase tracking-wider text-[#8c8c8c]">
              {article.author?.name ? `TÁC GIẢ ${article.author.name}` : "TÁC GIẢ FORBES VIỆT NAM"}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
