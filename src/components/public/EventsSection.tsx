"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

export default function EventsSection() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const events = [
    {
      id: 1,
      title: "Hội nghị Thương hiệu 2026: Định vị Bản sắc trong Kỷ nguyên Số",
      date: "Tháng 11, 2026",
      location: "Gem Center, TP. Hồ Chí Minh",
      description: "Sự kiện lớn nhất trong năm về tiếp thị và thương hiệu, nơi các chuyên gia hàng đầu thảo luận về chiến lược định vị và trải nghiệm khách hàng đa kênh.",
      imageUrl: "/assets/images/keynote-Xu-2-1536x1024.jpg",
      cta: "Đăng ký tham dự",
    },
    {
      id: 2,
      title: "Hội nghị Phát triển Bền vững 2026: Lộ trình Net-Zero cho Doanh nghiệp",
      date: "Tháng 12, 2026",
      location: "JW Marriott Hotel, Hà Nội",
      description: "Quy tụ hơn 400 lãnh đạo doanh nghiệp nhằm tìm kiếm giải pháp chuyển dịch năng lượng xanh và đáp ứng các tiêu chuẩn ESG toàn cầu.",
      imageUrl: "/assets/images/FO121223_076-1536x1024.jpg",
      cta: "Xem chương trình",
    },
  ];

  const nextEvent = () => {
    setCurrentEventIndex((prev) => (prev + 1) % events.length);
  };

  const prevEvent = () => {
    setCurrentEventIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const current = events[currentEventIndex];

  return (
    <section className="w-full py-14 bg-white text-[#111111] border-b border-gray-200">
      <div className="forbes-container">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 bg-[#f4121e] inline-block" />
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#111111]">
              Sự kiện & Hội nghị Forbes
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={prevEvent}
              aria-label="Previous event"
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:text-black hover:border-black transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextEvent}
              aria-label="Next event"
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:text-black hover:border-black transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Event Feature Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#f8f9fa] rounded-none overflow-hidden border border-gray-200">
          <div className="lg:col-span-7 relative aspect-[16/10] w-full">
            <Image
              src={current.imageUrl}
              alt={current.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
            <span className="bg-[#f4121e] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-none inline-block">
              Sắp diễn ra
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-[#111111]">
              {current.title}
            </h3>

            <p className="text-sm text-[#555555] leading-relaxed">
              {current.description}
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#777777]">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#f4121e]" />
                <span>{current.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#f4121e]" />
                <span>{current.location}</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/category/su-kien"
                className="inline-block bg-[#f4121e] hover:bg-[#d8101a] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-none transition-colors"
              >
                {current.cta} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
