import Link from "next/link";
import Image from "next/image";
import { PlayCircle, BarChart3, BookOpen, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Multimedia | Forbes Việt Nam",
  description: "Không gian đa phương tiện: Phim tài liệu kinh doanh, Megastories và Infographics trực quan từ Forbes Việt Nam.",
};

export default function MultimediaHubPage() {
  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen">
      {/* Header */}
      <div className="w-full bg-[#181716] text-white py-12 border-b border-[#2d2c2a]">
        <div className="max-w-[1220px] mx-auto px-4">
          <span className="text-[12px] font-bold uppercase tracking-widest text-[#f4121e] block mb-2">
            ĐA PHƯƠNG TIỆN
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Forbes Multimedia
          </h1>
          <p className="text-gray-300 max-w-2xl text-base leading-relaxed">
            Trải nghiệm các nội dung báo chí số thế hệ mới: Video phóng sự độc quyền, Megastories tương tác và Infographics dữ liệu.
          </p>
        </div>
      </div>

      <div className="max-w-[1220px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Section 1: Infographics */}
          <Link
            href="/multimedia/infographics"
            className="group bg-white border border-gray-200 overflow-hidden shadow-sm hover:border-[#f4121e] transition-all"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
                alt="Infographics"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#f4121e] block mb-2">
                DỮ LIỆU SỐ
              </span>
              <h3 className="font-serif text-xl font-bold text-[#111111] mb-2 group-hover:text-[#f4121e] transition-colors">
                Infographic
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Phân tích đồ hoạ trực quan về dòng vốn, thị trường và chân dung doanh nghiệp.
              </p>
              <div className="flex items-center text-xs font-bold uppercase text-[#111111] group-hover:text-[#f4121e]">
                <span>Xem tất cả đồ hoạ</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Section 2: Megastory */}
          <div className="group bg-white border border-gray-200 overflow-hidden shadow-sm">
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
              <Image
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800"
                alt="Megastory"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#f4121e] block mb-2">
                BÁO CHÍ ĐA TRẢI NGHIỆM
              </span>
              <h3 className="font-serif text-xl font-bold text-[#111111] mb-2">
                Megastory
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Những bài viết chuyên sâu dạng tương tác (Longform interactive) dẫn dắt câu chuyện thị trường đỉnh cao.
              </p>
              <span className="text-xs font-bold uppercase text-gray-400">
                Cập nhật định kỳ
              </span>
            </div>
          </div>

          {/* Section 3: Video */}
          <div className="group bg-white border border-gray-200 overflow-hidden shadow-sm">
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
              <Image
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800"
                alt="Videos"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#f4121e] block mb-2">
                PHÓNG SỰ VIDEO
              </span>
              <h3 className="font-serif text-xl font-bold text-[#111111] mb-2">
                Forbes Video Series
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Phỏng vấn độc quyền các CEO, phóng sự hiện trường nhà máy thông minh và đổi mới sáng tạo.
              </p>
              <a
                href="https://www.youtube.com/channel/UCZFad_sGwAdtjyNW1MMDH3A"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-bold uppercase text-[#111111] hover:text-[#f4121e]"
              >
                <span>Xem trên YouTube</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
