"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PopulatedArticle } from "@/types";
import { getProxiedImageUrl } from "@/lib/image-helper";

interface MasterHeadProps {
  spotlight?: PopulatedArticle | null;
  topStories?: PopulatedArticle[];
  carouselArticles?: PopulatedArticle[];
  trendingArticles?: PopulatedArticle[];
}

export default function MasterHeadSection({
  spotlight,
  topStories = [],
  carouselArticles = [],
  trendingArticles = [],
}: MasterHeadProps) {
  // Use spotlight article or fallback to first top story
  const lead = spotlight || topStories[0];
  const sideArticles = trendingArticles.slice(0, 4);
  const tickerStories = (topStories.length > 0 ? topStories : carouselArticles).slice(0, 5);

  return (
    <section className="relative w-full overflow-hidden text-white min-h-[580px] lg:h-[820px] xl:h-[850px] flex flex-col justify-between select-none">
      {/* 1. Full-bleed background photo spanning edge-to-edge full width */}
      {lead && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={getProxiedImageUrl(lead.coverImage?.url)}
            alt={lead.title}
            fill
            priority
            unoptimized={true}
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Dark overlay: rgba(24, 23, 22, 0.6) + smooth directional gradient for text readability */}
          <div className="absolute inset-0 bg-[#181716]/65 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/75 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/40 z-10" />
        </div>
      )}

      {/* 2. Main Content Grid layered over the full-bleed photo */}
      <div className="max-w-[1220px] mx-auto px-4 w-full relative z-20 flex-1 flex flex-col justify-center pt-8 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Lead Story Headline & Excerpt (8 cols) */}
          <div className="lg:col-span-8 max-w-[680px]">
            {lead ? (
              <div>
                {/* Category Pill with Red Dot */}
                <div className="flex items-center space-x-2.5 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f4121e] inline-block" />
                  <Link
                    href={lead.category?.slug ? `/${lead.category.slug}` : "/kinh-doanh"}
                    className="text-[12px] font-sans font-bold uppercase tracking-widest text-white hover:text-[#f4121e] transition-colors"
                  >
                    {lead.category?.name || "GIẢI TRÍ"}
                  </Link>
                </div>

                {/* Headline in authentic Merriweather Bold 700 */}
                <h1
                  className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold leading-[1.22] text-white mb-4 hover:text-gray-100 transition-colors"
                  style={{ fontFamily: "var(--font-merriweather)" }}
                >
                  <Link href={`/${lead.slug}`} className="hover:underline decoration-[#f4121e] underline-offset-4">
                    {lead.title}
                  </Link>
                </h1>

                {/* Excerpt clamped to 3 lines */}
                {lead.excerpt && (
                  <p className="text-[#d8d8d8] text-xs sm:text-sm md:text-[15px] leading-relaxed line-clamp-3 font-sans mb-3.5 max-w-xl">
                    {lead.excerpt}
                  </p>
                )}

                {/* Meta time / author */}
                <p className="text-xs text-[#a0a0a0] font-sans">
                  {lead.author?.name ? `Tác giả ${lead.author.name}` : "vài ngày trước"}
                </p>
              </div>
            ) : (
              <div className="min-h-[200px] animate-pulse bg-white/5 rounded-none" />
            )}
          </div>

          {/* Right: XEM NHIỀU NHẤT (4 cols) directly layered over background */}
          <div className="lg:col-span-4 bg-black/40 lg:bg-black/35 backdrop-blur-md p-6 lg:p-6 rounded-none border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="font-sans text-[13px] font-bold uppercase tracking-wider text-white mb-3.5 pb-2.5 border-b border-white/20">
                XEM NHIỀU NHẤT
              </h3>

              <div className="space-y-4">
                {sideArticles.map((article) => (
                  <article
                    key={article._id}
                    className="group flex items-center space-x-3.5 pb-3.5 border-b border-white/10 last:border-b-0 last:pb-0"
                  >
                    {/* Small thumbnail on left */}
                    <Link
                      href={`/${article.slug}`}
                      className="relative w-[76px] h-[54px] shrink-0 overflow-hidden bg-neutral-900 rounded-none block"
                    >
                      <Image
                        src={getProxiedImageUrl(article.coverImage?.url)}
                        alt={article.title}
                        fill
                        unoptimized={true}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </Link>

                    {/* Title in Merriweather Bold 700 */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-serif text-[13.5px] font-bold leading-snug text-white group-hover:text-[#f4121e] transition-colors line-clamp-2"
                        style={{ fontFamily: "var(--font-merriweather)" }}
                      >
                        <Link href={`/${article.slug}`}>{article.title}</Link>
                      </h4>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Bottom Right Arrow Link */}
            <div className="mt-4 flex justify-end">
              <Link
                href="/tieu-diem"
                className="text-gray-300 hover:text-[#f4121e] transition-colors"
                aria-label="Xem thêm xem nhiều nhất"
              >
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Headline Ticker Strip across the site container */}
      {tickerStories.length > 0 && (
        <div className="relative z-20 w-full border-t border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="max-w-[1220px] mx-auto px-4 py-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center space-x-6 min-w-max text-[12px] font-medium text-gray-200">
              {tickerStories.map((item, idx) => (
                <div key={item._id || idx} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f4121e] shrink-0" />
                  <Link
                    href={`/${item.slug}`}
                    className="hover:text-white hover:underline transition-colors whitespace-nowrap max-w-[220px] truncate"
                    title={item.title}
                  >
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
