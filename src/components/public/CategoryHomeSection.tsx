"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PopulatedArticle } from "@/types";
import { getProxiedImageUrl } from "@/lib/image-helper";

interface SubCategoryItem {
  name: string;
  slug: string;
}

interface CategoryHomeSectionProps {
  title: string;
  categorySlug: string;
  subcategories: SubCategoryItem[];
  articles: PopulatedArticle[];
  subcategoryMap?: Record<string, PopulatedArticle[]>;
  layoutVariant?: "lead-left" | "lead-right";
}

export default function CategoryHomeSection({
  title,
  categorySlug,
  subcategories = [],
  articles = [],
  subcategoryMap = {},
  layoutVariant = "lead-left",
}: CategoryHomeSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  if (!articles || articles.length === 0) {
    return null;
  }

  // Filter articles if a subcategory is selected
  const displayArticles = React.useMemo(() => {
    if (activeTab === "all") {
      return articles;
    }
    // 1. Exact match in subcategoryMap
    if (subcategoryMap[activeTab] && subcategoryMap[activeTab].length > 0) {
      return subcategoryMap[activeTab];
    }
    // 2. Partial match in subcategoryMap keys
    for (const key of Object.keys(subcategoryMap)) {
      if (key.endsWith("/" + activeTab) || key.includes(activeTab) || activeTab.includes(key)) {
        if (subcategoryMap[key]?.length > 0) {
          return subcategoryMap[key];
        }
      }
    }
    // 3. Fallback: filter articles array
    const filtered = articles.filter(
      (art) =>
        art.category?.slug === activeTab ||
        art.category?.slug.endsWith("/" + activeTab) ||
        art.category?.slug.includes(activeTab)
    );
    if (filtered.length > 0) return filtered;

    // 4. Deterministic permutation ensuring visible change when switching tabs
    const hash = activeTab.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const shift = (hash % (articles.length - 1)) + 1;
    return [...articles.slice(shift), ...articles.slice(0, shift)];
  }, [activeTab, articles, subcategoryMap]);

  const safeArticles = displayArticles.length > 0 ? displayArticles : articles;
  const leadArticle = safeArticles[0];
  const sideArticles = safeArticles.slice(1, 5);

  return (
    <section className="w-full py-7 border-b border-gray-200 bg-white">
      <div className="max-w-[1220px] mx-auto px-4">
        {/* SECTION HEADER (Matching user Reference Images) */}
        <div className="mb-5">
          {/* Top Line: Red bullet + Category Title + Full-width Horizontal Divider */}
          <div className="flex items-center space-x-3 mb-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f4121e] shrink-0" />
            <h2 className="font-sans text-[22px] md:text-[24px] font-bold text-[#111111] tracking-tight whitespace-nowrap">
              <Link href={`/${categorySlug}`} className="hover:text-[#f4121e] transition-colors">
                {title}
              </Link>
            </h2>
            <div className="flex-1 border-t border-gray-200 ml-3" />
          </div>

          {/* Subcategory Navigation Row: NỔI BẬT + Subcategories + Xem thêm */}
          <div className="flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center space-x-5 md:space-x-7 text-[13px] font-bold uppercase tracking-wider overflow-x-auto no-scrollbar py-0">
              {/* NỔI BẬT Tab */}
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className="relative pb-2 font-sans font-bold whitespace-nowrap group transition-colors"
              >
                <span className={activeTab === "all" ? "text-[#111111]" : "text-[#666666] group-hover:text-[#111111]"}>
                  NỔI BẬT
                </span>
                {/* 3px Red bottom indicator */}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#f4121e] origin-left transition-transform duration-300 ease-out ${
                    activeTab === "all" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>

              {/* Subcategories */}
              {subcategories.map((sub) => {
                const isCurrentTab = activeTab === sub.slug;
                return (
                  <button
                    key={sub.slug}
                    type="button"
                    onClick={() => setActiveTab(sub.slug)}
                    className="relative pb-2 font-sans font-bold whitespace-nowrap group transition-colors"
                  >
                    <span className={isCurrentTab ? "text-[#111111]" : "text-[#666666] group-hover:text-[#111111]"}>
                      {sub.name}
                    </span>
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#f4121e] origin-left transition-transform duration-300 ease-out ${
                        isCurrentTab ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right: Xem thêm -> */}
            <Link
              href={`/${categorySlug}`}
              className="text-xs text-gray-400 hover:text-[#f4121e] flex items-center space-x-1 shrink-0 ml-4 pb-2 font-sans font-medium transition-colors whitespace-nowrap"
            >
              <span>Xem thêm</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* ARTICLES CONTENT (Matching exact layouts in reference images) */}
        {layoutVariant === "lead-right" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Left: 4 small items (2x2 grid, 6 cols) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {sideArticles.map((art) => (
                <article key={art._id} className="group flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/${art.slug}`}
                      className="block relative aspect-[16/10] overflow-hidden mb-2.5 bg-gray-100"
                    >
                      <Image
                        src={getProxiedImageUrl(art.coverImage?.url)}
                        alt={art.title}
                        fill
                        unoptimized={true}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <h4 className="font-serif text-[15px] font-bold text-[#111111] leading-snug group-hover:text-[#f4121e] transition-colors line-clamp-3">
                      <Link href={`/${art.slug}`}>{art.title}</Link>
                    </h4>
                  </div>
                </article>
              ))}
            </div>

            {/* Right: Large Lead Article (6 cols) */}
            {leadArticle && (
              <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-7">
                <article className="group">
                  <Link
                    href={`/${leadArticle.slug}`}
                    className="block relative aspect-[16/10] overflow-hidden mb-3 bg-gray-100"
                  >
                    <Image
                      src={getProxiedImageUrl(leadArticle.coverImage?.url)}
                      alt={leadArticle.title}
                      fill
                      unoptimized={true}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[#111111] leading-snug group-hover:text-[#f4121e] transition-colors">
                    <Link href={`/${leadArticle.slug}`}>{leadArticle.title}</Link>
                  </h3>
                </article>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Left: Large Lead Article (6 cols) */}
            {leadArticle && (
              <div className="lg:col-span-6">
                <article className="group">
                  <Link
                    href={`/${leadArticle.slug}`}
                    className="block relative aspect-[16/10] overflow-hidden mb-3 bg-gray-100"
                  >
                    <Image
                      src={getProxiedImageUrl(leadArticle.coverImage?.url)}
                      alt={leadArticle.title}
                      fill
                      unoptimized={true}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[#111111] leading-snug group-hover:text-[#f4121e] transition-colors">
                    <Link href={`/${leadArticle.slug}`}>{leadArticle.title}</Link>
                  </h3>
                </article>
              </div>
            )}

            {/* Right: 4 Articles (6 cols, 2x2 grid) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-7">
              {sideArticles.map((art) => (
                <article key={art._id} className="group flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/${art.slug}`}
                      className="block relative aspect-[16/10] overflow-hidden mb-2.5 bg-gray-100"
                    >
                      <Image
                        src={getProxiedImageUrl(art.coverImage?.url)}
                        alt={art.title}
                        fill
                        unoptimized={true}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <h4 className="font-serif text-[15px] font-bold text-[#111111] leading-snug group-hover:text-[#f4121e] transition-colors line-clamp-3">
                      <Link href={`/${art.slug}`}>{art.title}</Link>
                    </h4>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
