import Link from "next/link";
import Image from "next/image";
import { BookOpen, Check, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Ấn phẩm Tạp chí | Forbes Việt Nam",
  description: "Kho lưu trữ các số tạp chí in Forbes Việt Nam cùng các chuyên đề kinh doanh đặc biệt.",
};

const PAST_ISSUES = [
  {
    issue: "Số 155",
    theme: "50 Thương Hiệu Dẫn Đầu 2026",
    month: "Tháng 10/2026",
    imageUrl: "/assets/images/155_Banner.png",
  },
  {
    issue: "Số 154",
    theme: "Chuyển Đổi Xanh: Cuộc Đua Sống Còn Của Doanh Nghiệp",
    month: "Tháng 09/2026",
    imageUrl: "/assets/images/22-e1699350587340.jpg",
  },
  {
    issue: "Số 153",
    theme: "Trí Tuệ Nhân Tạo & Bản Lĩnh Công Nghệ Việt",
    month: "Tháng 08/2026",
    imageUrl: "/assets/images/61-FA0923-scaled.jpg",
  },
  {
    issue: "Số 152",
    theme: "Danh Sách Tỷ Phú Thế Giới & Cơ Hội Cho Việt Nam",
    month: "Tháng 07/2026",
    imageUrl: "/assets/images/8693930324_249a87ab62_o-scaled.jpg",
  },
];

export default function MagazinePage() {
  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen">
      {/* Header */}
      <div className="w-full bg-[#181716] text-white py-14 border-b border-[#2d2c2a]">
        <div className="max-w-[1220px] mx-auto px-4">
          <span className="text-[12px] font-bold uppercase tracking-widest text-[#f4121e] block mb-2">
            TẠP CHÍ IN
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Ấn Phẩm Forbes Việt Nam
          </h1>
          <p className="text-gray-300 max-w-2xl text-base leading-relaxed">
            Mỗi ấn phẩm là một công trình nghiên cứu sâu rộng, mang đến thông tin kinh tế chuẩn mực và giá trị lưu trữ dài hạn cho giới tinh hoa kinh doanh.
          </p>
        </div>
      </div>

      <div className="max-w-[1220px] mx-auto px-4 py-12">
        {/* Latest Issue Spotlight */}
        <div className="mb-14 bg-white border border-gray-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="md:col-span-5 p-8 flex justify-center bg-[#181716]">
              <div className="relative w-[280px] h-[370px] shadow-2xl overflow-hidden border border-gray-700">
                <Image
                  src="/assets/images/155_Banner.png"
                  alt="Tạp chí Forbes số mới nhất"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-7 p-8 lg:p-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#f4121e] block mb-2">
                ẤN BẢN MỚI NHẤT — THÁNG 10/2026
              </span>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[#111111] mb-4 leading-tight">
                Forbes Việt Nam Số 155: Danh Sách 50 Thương Hiệu Dẫn Đầu
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Ấn phẩm đặc biệt công bố bảng xếp hạng giá trị thương hiệu thường niên, phác hoạ chiến lược giữ vững niềm tin người tiêu dùng trong kỷ nguyên đa kênh và bức tranh cạnh tranh khốc liệt của các tập đoàn nội địa.
              </p>

              <div className="space-y-2 mb-8 text-xs text-gray-700">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#f4121e]" />
                  <span>Chuyên đề: 50 Thương hiệu giá trị nhất Việt Nam</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#f4121e]" />
                  <span>Phỏng vấn độc quyền các CEO dẫn đầu ngành tiêu dùng & ngân hàng</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#f4121e]" />
                  <span>Phân tích chiến lược đầu tư công nghệ số cho chuỗi bán lẻ</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/dat-bao"
                  className="bg-[#f4121e] hover:bg-[#d8101a] text-white font-bold text-xs uppercase px-8 py-3.5 tracking-wider transition-colors inline-flex items-center"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Đặt mua ấn bản này
                </Link>
                <Link
                  href="/dat-bao"
                  className="border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] font-bold text-xs uppercase px-6 py-3.5 tracking-wider transition-colors"
                >
                  Đặt báo dài hạn (Tiết kiệm 25%)
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Past Issues Archive */}
        <div>
          <div className="flex items-center space-x-2 mb-8 pb-3 border-b-2 border-[#111111]">
            <span className="w-2.5 h-2.5 bg-[#f4121e] inline-block" />
            <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-[#111111]">
              CÁC SỐ ĐÃ PHÁT HÀNH
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PAST_ISSUES.map((issue, idx) => (
              <div key={idx} className="bg-white border border-gray-200 overflow-hidden shadow-sm group">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <Image
                    src={issue.imageUrl}
                    alt={issue.theme}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-[#181716] text-white text-[10px] font-bold uppercase px-2 py-0.5">
                    {issue.issue}
                  </div>
                </div>

                <div className="p-4">
                  <span className="text-[11px] text-gray-400 block mb-1">{issue.month}</span>
                  <h4 className="font-serif text-sm font-bold text-[#111111] line-clamp-2 leading-snug mb-3">
                    {issue.theme}
                  </h4>
                  <Link
                    href="/dat-bao"
                    className="text-xs font-bold uppercase text-[#f4121e] hover:underline inline-flex items-center"
                  >
                    <span>Đặt số báo cũ</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
