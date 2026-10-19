"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { PopulatedArticle } from "@/types";
import { getProxiedImageUrl } from "@/lib/image-helper";

interface StartupStripSectionProps {
  articles: PopulatedArticle[];
}

export default function StartupStripSection({ articles }: StartupStripSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!articles || articles.length === 0) return null;

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full py-8 border-b border-gray-200 bg-white">
      <div className="max-w-[1220px] mx-auto px-4">
        {/* Header: Red dot + Start-up + line */}
        <div className="flex items-center space-x-3 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f4121e] shrink-0" />
          <h2 className="font-sans text-[22px] md:text-[24px] font-bold text-[#111111] tracking-tight whitespace-nowrap">
            <Link href="/start-up" className="hover:text-[#f4121e] transition-colors">
              Start-up
            </Link>
          </h2>
          <div className="flex-1 border-t border-gray-200 ml-3" />
        </div>

        {/* 5 items horizontal strip with right arrow button */}
        <div className="relative group">
          <div
            ref={scrollContainerRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {articles.slice(0, 5).map((art) => (
              <article key={art._id} className="group/item flex flex-col justify-between">
                <div>
                  <Link
                    href={`/${art.slug}`}
                    className="block relative aspect-[16/10] overflow-hidden mb-3 bg-gray-100"
                  >
                    <Image
                      src={getProxiedImageUrl(art.coverImage?.url)}
                      alt={art.title}
                      fill
                      unoptimized={true}
                      className="object-cover group-hover/item:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <h4 className="font-serif text-[14px] md:text-[15px] font-bold text-[#111111] leading-snug group-hover/item:text-[#f4121e] transition-colors line-clamp-3">
                    <Link href={`/${art.slug}`}>{art.title}</Link>
                  </h4>
                </div>
              </article>
            ))}
          </div>

          {/* Right Arrow Button matching screenshot */}
          <button
            type="button"
            onClick={handleScrollRight}
            aria-label="Xem tiếp Start-up"
            className="absolute -right-3 top-1/3 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-black hover:scale-105 transition-all z-10 hidden lg:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
