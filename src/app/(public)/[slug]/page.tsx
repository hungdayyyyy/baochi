import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { Calendar, User, Eye, Share2, Facebook, Twitter, Linkedin, Bookmark } from "lucide-react";
import connectDB from "@/lib/db/mongodb";
import Category from "@/lib/db/models/Category";
import { getArticleBySlug, getLayoutArticles, getCategoryArticlesCursor, getCategoryBySlug } from "@/lib/cache";
import ViewCountTracker from "@/components/public/ViewCountTracker";
import CategoryPageTemplate from "@/components/public/CategoryPageTemplate";

export const revalidate = 300;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (category) {
    return {
      title: `${category.name} - Forbes Việt Nam`,
      description: `Tin tức và bài viết chuyên sâu về ${category.name} trên Forbes Việt Nam`,
    };
  }

  const article = await getArticleBySlug(params.slug);
  if (article) {
    return {
      title: `${article.title} - Forbes Việt Nam`,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        images: [{ url: article.coverImage?.url || "", width: 1200, height: 675, alt: article.title }],
        type: "article",
        publishedTime: new Date(article.publishedAt).toISOString(),
      },
    };
  }

  return { title: "Nội dung | Forbes Việt Nam" };
}

export default async function DynamicSlugPage({ params }: PageProps) {
  // 1. Check if slug is a Category
  const category = await getCategoryBySlug(params.slug);
  if (category) {
    return <CategoryPageTemplate category={category} />;
  }

  // 2. Otherwise check if slug is an Article
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  let trendingArticles: any[] = [];
  let relatedArticles: any[] = [];
  try {
    const [trending, relatedRes] = await Promise.all([
      getLayoutArticles("home", "trending-sidebar"),
      getCategoryArticlesCursor({
        categorySlug: article.category?.slug || "kinh-doanh",
        limit: 8,
      }),
    ]);
    trendingArticles = trending;
    relatedArticles = (relatedRes.articles || []).filter((a: any) => a._id !== article._id);
  } catch (e) {
    console.warn("Could not load sidebar/related articles:", e);
  }

  // Fallback trending if empty
  if (trendingArticles.length === 0 && relatedArticles.length > 0) {
    trendingArticles = relatedArticles.slice(0, 5);
  }

  const publishedDate = new Date(article.publishedAt).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const sanitizedHtml = DOMPurify.sanitize(article.content?.html || "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    image: [article.coverImage?.url || ""],
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.updatedAt || article.publishedAt).toISOString(),
    author: [
      {
        "@type": "Person",
        name: article.author?.name || "Forbes Việt Nam",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Forbes Việt Nam",
      logo: {
        "@type": "ImageObject",
        url: "http://localhost:3000/assets/images/vietnam-forbes-digital-white.png",
      },
    },
    description: article.excerpt,
  };

  return (
    <article className="w-full bg-white font-sans min-h-screen text-[#1a1a1a]">
      {/* Schema.org NewsArticle JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Async View Count Incrementer */}
      <ViewCountTracker slug={article.slug} />

      {/* TOP ARTICLE HEADER BLOCK (Matching Image 1: Clean White Editorial Header) */}
      <div className="w-full bg-white border-b border-gray-100 pt-8 pb-6">
        <div className="max-w-[1240px] mx-auto px-4">
          {/* Category Pill with Red Dot */}
          {article.category && (
            <div className="flex items-center space-x-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#f4121e]" />
              <Link
                href={`/${article.category.slug}`}
                className="text-[12px] font-bold uppercase tracking-widest text-[#f4121e] hover:underline"
              >
                {article.category.name}
              </Link>
            </div>
          )}

          {/* Article Headline in Merriweather Serif */}
          <h1 className="font-serif text-[28px] sm:text-[36px] md:text-[42px] lg:text-[46px] font-bold leading-[1.2] text-[#111111] mb-5 max-w-[1000px]">
            {article.title}
          </h1>

          {/* Meta Bar: Author, Date, Reading time, Social Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-t border-b border-gray-100 text-xs text-gray-500">
            <div className="flex flex-wrap items-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Tác giả:</span>
                <strong className="text-[#111111] font-semibold">
                  {article.author?.name || "Forbes Việt Nam"}
                </strong>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{publishedDate}</span>
              </div>
              <span>•</span>
              <span>5 phút đọc</span>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center space-x-3 text-gray-500">
              <span className="text-[11px] uppercase font-bold tracking-wider hidden sm:inline text-gray-400">
                Chia sẻ:
              </span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://forbes.vn/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#1877f2] transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=https://forbes.vn/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#0a66c2] transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=https://forbes.vn/${article.slug}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN BODY (Matching Image 1) */}
      <div className="w-full bg-white py-8 lg:py-10">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-col lg:flex-row gap-10 xl:gap-14">
          {/* LEFT COLUMN: Lead paragraph, Hero Image, Rich HTML Content */}
          <div className="flex-1 min-w-0 max-w-[820px]">
            {/* Lead Sapo Paragraph */}
            {article.excerpt && (
              <p className="font-serif text-[18px] sm:text-[20px] font-bold text-[#1a1a1a] leading-[1.6] mb-8">
                {article.excerpt}
              </p>
            )}

            {/* Featured Hero Cover Image */}
            {article.coverImage?.url && (
              <figure className="mb-8">
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-gray-100 rounded-sm shadow-sm">
                  <Image
                    src={article.coverImage.url}
                    alt={article.coverImage.alt || article.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 820px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="text-xs text-gray-500 italic mt-2.5 text-center font-sans">
                  {article.coverImage.caption || `Ảnh: Forbes Việt Nam / Tư liệu`}
                </figcaption>
              </figure>
            )}

            {/* Rich Editorial HTML Body with Merriweather font */}
            <div
              className="article-content-body font-serif text-[18px] leading-[1.85] text-[#242424]
                [&>p]:mb-6 [&>p]:leading-[1.85]
                [&>h2]:font-sans [&>h2]:text-[24px] [&>h2]:sm:text-[28px] [&>h2]:font-bold [&>h2]:text-[#111111] [&>h2]:mt-10 [&>h2]:mb-4
                [&>h3]:font-sans [&>h3]:text-[20px] [&>h3]:sm:text-[22px] [&>h3]:font-bold [&>h3]:text-[#111111] [&>h3]:mt-8 [&>h3]:mb-3
                [&>blockquote]:border-l-4 [&>blockquote]:border-[#f4121e] [&>blockquote]:bg-[#fafafa] [&>blockquote]:p-5 [&>blockquote]:italic [&>blockquote]:my-8 [&>blockquote]:text-[19px] [&>blockquote]:text-[#222222]
                [&>figure]:my-8 [&>figure]:w-full
                [&>figure>img]:w-full [&>figure>img]:h-auto [&>figure>img]:rounded-sm
                [&>figure>figcaption]:text-xs [&>figure>figcaption]:text-gray-500 [&>figure>figcaption]:italic [&>figure>figcaption]:mt-2 [&>figure>figcaption]:text-center
                [&_img]:w-full [&_img]:h-auto [&_img]:rounded-sm [&_img]:my-6
                [&_a]:text-[#f4121e] [&_a]:underline hover:[&_a]:text-[#d8101a]"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />

            {/* Author Bio Box */}
            <div className="mt-12 p-6 bg-[#fcfcfc] border border-gray-200 rounded-sm flex items-start space-x-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 shrink-0 relative">
                <Image
                  src={article.author?.avatarUrl || article.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                  alt={article.author?.name || "Tác giả"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Về tác giả
                </span>
                <h4 className="font-sans font-bold text-base text-[#111111]">
                  {article.author?.name || "Forbes Việt Nam"}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {article.author?.bio || "Biên tập viên & Phóng viên chuyên trách ban toà soạn Forbes Việt Nam."}
                </p>
              </div>
            </div>

            {/* Tags Strip */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 font-sans">
                  Từ khoá
                </h4>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: any) => (
                    <span
                      key={tag._id || tag.name}
                      className="bg-gray-50 border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-[#f4121e] hover:text-[#f4121e] transition-colors"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: "ĐỌC NHIỀU NHẤT" & "ẤN PHẨM FORBES" */}
          <aside className="w-full lg:w-[340px] shrink-0 space-y-8">
            {/* 1. ĐỌC NHIỀU NHẤT WIDGET (Matching Image 1) */}
            <div className="bg-white border-t-2 border-[#f4121e] pt-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-5">
                <span className="w-2 h-2 rounded-full bg-[#f4121e]" />
                <h3 className="font-sans text-[15px] font-bold uppercase tracking-wider text-[#111111]">
                  ĐỌC NHIỀU NHẤT
                </h3>
              </div>

              <div className="divide-y divide-gray-100">
                {trendingArticles.slice(0, 5).map((trend, idx) => (
                  <article key={trend._id} className="py-3.5 first:pt-0 group flex items-start space-x-3">
                    <span className="font-serif text-[22px] font-bold text-[#d0d0d0] group-hover:text-[#f4121e] leading-none shrink-0 w-6 pt-0.5">
                      {idx + 1}
                    </span>
                    <Link
                      href={`/${trend.slug}`}
                      className="relative w-[76px] h-[52px] shrink-0 overflow-hidden bg-gray-100 rounded-none block"
                    >
                      <Image
                        src={trend.coverImage?.url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300"}
                        alt={trend.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-[13.5px] font-bold text-[#111111] group-hover:text-[#f4121e] line-clamp-2 leading-snug transition-colors">
                        <Link href={`/${trend.slug}`}>{trend.title}</Link>
                      </h4>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* 2. ẤN PHẨM FORBES SUBSCRIPTION WIDGET */}
            <div className="bg-[#181716] text-white p-6 rounded-sm shadow-md">
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#f4121e]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#f4121e]">
                  ẤN PHẨM FORBES
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-white mb-2 leading-snug">
                Ấn phẩm số 155/156: 50 Thương hiệu Dẫn đầu
              </h4>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Đăng ký gói dài hạn nhận ngay trọn bộ ấn phẩm in & đặc quyền đọc kỹ thuật số.
              </p>
              <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden rounded">
                <Image
                  src="/assets/images/155_Banner.png"
                  alt="Ấn phẩm Forbes số 155"
                  fill
                  className="object-contain"
                />
              </div>
              <Link
                href="/dat-bao"
                className="w-full bg-[#f4121e] hover:bg-[#d8101a] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded block text-center transition-colors shadow-lg"
              >
                ĐẶT BÁO NGAY →
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* BOTTOM SECTION: BÀI VIẾT LIÊN QUAN / CÙNG CHUYÊN MỤC (Matching Image 1) */}
      {relatedArticles.length > 0 && (
        <section className="w-full bg-[#f9fafb] py-12 border-t border-gray-200">
          <div className="max-w-[1240px] mx-auto px-4">
            <div className="flex items-center space-x-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f4121e]" />
              <h3 className="font-sans text-[15px] font-bold uppercase tracking-wider text-[#111111]">
                BÀI VIẾT LIÊN QUAN
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
              {relatedArticles.slice(0, 5).map((rel) => (
                <article key={rel._id} className="group">
                  <Link href={`/${rel.slug}`} className="block relative aspect-[16/10] overflow-hidden mb-2.5 bg-gray-200 rounded-sm">
                    <Image
                      src={rel.coverImage?.url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400"}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </Link>
                  <h4 className="font-serif text-[13.5px] font-bold text-[#111111] group-hover:text-[#f4121e] line-clamp-2 leading-snug">
                    <Link href={`/${rel.slug}`}>{rel.title}</Link>
                  </h4>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
