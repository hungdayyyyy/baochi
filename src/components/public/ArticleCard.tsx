import Link from "next/link";
import Image from "next/image";
import { PopulatedArticle } from "@/types";

interface ArticleCardProps {
  article: PopulatedArticle;
  variant?: "horizontal" | "vertical" | "lead" | "compact";
  showCategory?: boolean;
}

export default function ArticleCard({
  article,
  variant = "vertical",
  showCategory = true,
}: ArticleCardProps) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (variant === "lead") {
    return (
      <article className="group flex flex-col">
        <Link href={`/${article.slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.alt || article.title}
            fill
            sizes="(max-width: 768px) 100vw, 65vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </Link>
        <div className="pt-4">
          {showCategory && article.category && (
            <Link
              href={`/category/${article.category.slug}`}
              className="inline-block text-[11px] font-sans font-bold uppercase tracking-widest text-[#d8361e] hover:underline mb-1.5"
            >
              {article.category.name}
            </Link>
          )}
          <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-[#111111] group-hover:text-[#d8361e] transition-colors mb-3">
            <Link href={`/${article.slug}`}>{article.title}</Link>
          </h2>
          <p className="text-sm font-sans text-gray-600 line-clamp-3 leading-relaxed mb-3">
            {article.excerpt}
          </p>
          <div className="flex items-center text-xs text-gray-500 font-sans space-x-2">
            {article.author && <span className="font-semibold text-gray-800">{article.author.name}</span>}
            {article.author && <span>•</span>}
            <span>{publishedDate}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="group flex gap-4 items-start py-3.5 border-b border-gray-100 last:border-b-0">
        <Link href={`/${article.slug}`} className="relative w-28 sm:w-36 aspect-[16/10] flex-shrink-0 overflow-hidden bg-gray-100">
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.alt || article.title}
            fill
            sizes="150px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="flex-1 min-w-0">
          {showCategory && article.category && (
            <Link
              href={`/category/${article.category.slug}`}
              className="inline-block text-[10px] font-sans font-bold uppercase tracking-wider text-[#d8361e] hover:underline mb-1"
            >
              {article.category.name}
            </Link>
          )}
          <h3 className="font-serif text-sm sm:text-base font-bold leading-snug text-[#111111] group-hover:text-[#d8361e] transition-colors line-clamp-2">
            <Link href={`/${article.slug}`}>{article.title}</Link>
          </h3>
          <span className="text-[11px] text-gray-400 mt-1.5 block">
            {publishedDate}
          </span>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group py-3 border-b border-gray-100 last:border-b-0">
        {showCategory && article.category && (
          <Link
            href={`/category/${article.category.slug}`}
            className="inline-block text-[10px] font-sans font-bold uppercase tracking-wider text-[#d8361e] hover:underline mb-1"
          >
            {article.category.name}
          </Link>
        )}
        <h4 className="font-serif text-sm font-bold leading-snug text-[#111111] group-hover:text-[#d8361e] transition-colors line-clamp-2">
          <Link href={`/${article.slug}`}>{article.title}</Link>
        </h4>
        <span className="text-[11px] text-gray-400 mt-1 block">
          {publishedDate}
        </span>
      </article>
    );
  }

  // Default Vertical Card
  return (
    <article className="group flex flex-col h-full">
      <Link href={`/${article.slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3">
        <Image
          src={article.coverImage.url}
          alt={article.coverImage.alt || article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {showCategory && article.category && (
            <Link
              href={`/category/${article.category.slug}`}
              className="inline-block text-[10px] font-sans font-bold uppercase tracking-wider text-[#d8361e] hover:underline mb-1.5"
            >
              {article.category.name}
            </Link>
          )}
          <h3 className="font-serif text-base sm:text-lg font-bold leading-snug text-[#111111] group-hover:text-[#d8361e] transition-colors line-clamp-2 mb-2">
            <Link href={`/${article.slug}`}>{article.title}</Link>
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
            {article.excerpt}
          </p>
        </div>
        <div className="text-[11px] text-gray-400 flex items-center space-x-1.5 pt-2 border-t border-gray-100">
          {article.author && <span className="font-semibold text-gray-700">{article.author.name}</span>}
          {article.author && <span>•</span>}
          <span>{publishedDate}</span>
        </div>
      </div>
    </article>
  );
}
