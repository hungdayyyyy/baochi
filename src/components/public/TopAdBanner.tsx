"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export default function TopAdBanner() {
  return (
    <div className="w-full bg-[#121212] border-b border-[#262626] relative overflow-hidden select-none">
      {/* Decorative background radial glow and subtle concentric rings matching Image 2 */}
      <div className="absolute right-0 top-0 bottom-0 w-[550px] pointer-events-none opacity-20">
        <svg viewBox="0 0 500 250" className="w-full h-full" fill="none">
          <circle cx="380" cy="125" r="70" stroke="#f4121e" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="380" cy="125" r="120" stroke="#e6a15c" strokeWidth="1" />
          <circle cx="380" cy="125" r="170" stroke="#e6a15c" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="380" cy="125" r="220" stroke="#e6a15c" strokeWidth="0.75" />
          <circle cx="380" cy="125" r="270" stroke="#e6a15c" strokeWidth="0.5" strokeDasharray="3 3" />
        </svg>
      </div>

      <div className="max-w-[1220px] mx-auto px-4 h-[210px] md:h-[230px] flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-8 md:space-x-12 w-full justify-between">
          {/* LEFT: 3D Magazine & Tablet Mockup */}
          {/* LEFT: Real Magazine & Tablet Artwork Matching Image 2 */}
          <Link
            href="/dat-bao"
            className="group relative flex items-center shrink-0 hover:scale-105 transition-transform duration-300 py-1"
            aria-label="Đặt báo Forbes số 155/156"
          >
            <div className="relative w-[135px] sm:w-[155px] md:w-[175px] h-[165px] sm:h-[185px] md:h-[200px] flex items-center justify-center">
              <img
                src="/assets/images/155_Banner.png"
                alt="Ấn phẩm Forbes Việt Nam số 155/156"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_14px_30px_rgba(244,18,30,0.3)] transition-all duration-300"
              />
            </div>
          </Link>

          {/* CENTER & RIGHT: Editorial Content matching Image 2 */}
          <div className="flex-1 max-w-[850px] pl-2 sm:pl-4">
            {/* Tagline: Red dot + text */}
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f4121e] inline-block animate-pulse" />
              <span className="text-[11px] sm:text-[12px] font-bold tracking-widest uppercase text-[#f4121e] font-sans">
                ẤN PHẨM FORBES VIỆT NAM
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="font-serif text-[20px] sm:text-[25px] md:text-[28px] font-bold text-white leading-tight tracking-tight mb-2">
              <Link href="/dat-bao" className="hover:text-gray-200 transition-colors">
                Ấn phẩm số 155/156: 50 Thương hiệu Dẫn đầu
              </Link>
            </h2>

            {/* Subtitle */}
            <p className="text-gray-300 text-xs sm:text-[13.5px] leading-relaxed mb-3 hidden sm:block">
              Đăng ký gói dài hạn nhận ngay trọn bộ ấn phẩm in & đặc quyền đọc kỹ thuật số
            </p>

            {/* 3 Perks with checkmarks */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[11.5px] sm:text-[12.5px] text-gray-300 font-sans mb-4">
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                <span>Giao báo tận nơi hàng tháng</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                <span>Miễn phí vận chuyển toàn quốc</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                <span>Ưu đãi sự kiện Forbes</span>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href="/dat-bao"
                className="inline-flex items-center space-x-2 bg-[#f4121e] hover:bg-[#d8101a] text-white font-bold text-xs sm:text-[13px] uppercase tracking-wider px-5 py-2.5 rounded-sm transition-all hover:shadow-[0_4px_16px_rgba(244,18,30,0.4)]"
              >
                <span>ĐẶT BÁO NGAY</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
