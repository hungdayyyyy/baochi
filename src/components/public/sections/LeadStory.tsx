import Link from "next/link";
import Image from "next/image";
import { PopulatedArticle } from "@/types";
import { getProxiedImageUrl } from "@/lib/image-helper";

interface LeadStoryProps {
  article: PopulatedArticle;
  aspectRatio?: string;
  className?: string;
}

export default function LeadStory({
  article,
  aspectRatio = "aspect-[16/10]",
  className = "",
}: LeadStoryProps) {
  if (!article) return null;

  return (
    <article className={`group flex flex-col ${className}`}>
      {/* Top Image */}
      <Link
        href={`/${article.slug}`}
        className={`relative w-full ${aspectRatio} overflow-hidden bg-neutral-100 rounded-none block mb-3.5`}
      >
        <Image
          src={getProxiedImageUrl(article.coverImage?.url)}
          alt={article.title}
          fill
          unoptimized={true}
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 1024px) 100vw, 650px"
        />
      </Link>

      {/* Title */}
      <h3
        className="font-serif text-[19px] sm:text-[21px] md:text-[22px] font-bold leading-[1.3] text-[#111111] group-hover:text-[#f4121e] transition-colors mb-2"
        style={{ fontFamily: "var(--font-merriweather)" }}
      >
        <Link href={`/${article.slug}`}>{article.title}</Link>
      </h3>

      {/* Excerpt if available */}
      {article.excerpt && (
        <p className="font-sans text-[13.5px] text-[#555555] leading-relaxed line-clamp-2 mb-2">
          {article.excerpt}
        </p>
      )}

      {/* Author / Time */}
      <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#8c8c8c]">
        {article.author?.name ? `TÁC GIẢ ${article.author.name}` : "FORBES VIỆT NAM"}
      </div>
    </article>
  );
}
