import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Ticket, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Sự kiện & Hội nghị | Forbes Việt Nam",
  description: "Các hội nghị thượng đỉnh kinh doanh, diễn đàn lãnh đạo và sự kiện thường niên của Forbes Việt Nam.",
};

const UPCOMING_EVENTS = [
  {
    id: "brand-conference-2026",
    title: "Forbes Brand Conference 2026: Bản Sắc Hay Quy Mô (More or Core)",
    date: "12 Tháng 11, 2026",
    location: "GEM Center, Quận 1, TP. Hồ Chí Minh",
    badge: "Hội nghị thường niên",
    description: "Quy tụ hơn 500 nhà lãnh đạo doanh nghiệp, giám đốc chiến lược và chuyên gia thương hiệu hàng đầu cùng giải mã bài toán định vị bền vững trong kỷ nguyên số.",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
    attendees: "500+ Doanh nhân & CMO",
  },
  {
    id: "business-forum-2026",
    title: "Forbes Business Forum: Đón Sóng Chuyển Dịch & Tái Định Hình Tương Lai",
    date: "18 Tháng 12, 2026",
    location: "Khách sạn JW Marriott, Hà Nội",
    badge: "Diễn đàn Kinh tế",
    description: "Phân tích xu hướng kinh tế vĩ mô, chuỗi cung ứng toàn cầu và chiến lược đầu tư của các tập đoàn đa quốc gia tại Việt Nam.",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200",
    attendees: "400+ CEO & Nhà đầu tư",
  },
  {
    id: "women-summit-2026",
    title: "Forbes Women Summit: Năng Lượng Chuyển Hoá Của Lãnh Đạo Nữ",
    date: "08 Tháng 03, 2027",
    location: "White Palace, TP. Hồ Chí Minh",
    badge: "Hội nghị Phụ nữ",
    description: "Không gian kết nối và vinh danh những người tiên phong kiến tạo chuẩn mực mới trong quản trị, đổi mới sáng tạo và trách nhiệm xã hội.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200",
    attendees: "350+ Nữ lãnh đạo",
  },
];

export default function EventsPage() {
  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen">
      {/* Hero Header */}
      <div className="w-full bg-[#181716] text-white py-14 border-b border-[#2d2c2a]">
        <div className="max-w-[1220px] mx-auto px-4">
          <span className="text-[12px] font-bold uppercase tracking-widest text-[#f4121e] block mb-2">
            HỘI NGHỊ THƯỢNG ĐỈNH
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Sự Kiện Forbes Việt Nam
          </h1>
          <p className="text-gray-300 max-w-3xl text-base md:text-lg leading-relaxed">
            Nơi hội tụ tri thức chuyên gia, góc nhìn chiến lược và cơ hội kết nối mạng lưới doanh nhân tinh hoa hàng đầu Việt Nam và khu vực.
          </p>
        </div>
      </div>

      <div className="max-w-[1220px] mx-auto px-4 py-12">
        {/* Featured Conference Spotlight */}
        <div className="mb-14 bg-white border border-gray-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden">
              <Image
                src={UPCOMING_EVENTS[0].imageUrl}
                alt={UPCOMING_EVENTS[0].title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#f4121e] text-white text-xs font-bold uppercase px-3 py-1">
                TIÊU ĐIỂM SẮP DIỄN RA
              </div>
            </div>

            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#f4121e] block mb-2">
                  {UPCOMING_EVENTS[0].badge}
                </span>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[#111111] mb-4 leading-tight">
                  {UPCOMING_EVENTS[0].title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {UPCOMING_EVENTS[0].description}
                </p>

                <div className="space-y-3 border-y border-gray-100 py-4 mb-6 text-sm text-gray-700">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-[#f4121e]" />
                    <span className="font-semibold">{UPCOMING_EVENTS[0].date}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-[#f4121e]" />
                    <span>{UPCOMING_EVENTS[0].location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-[#f4121e]" />
                    <span>{UPCOMING_EVENTS[0].attendees}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/partnership-inquiries"
                  className="bg-[#f4121e] hover:bg-[#d8101a] text-white font-bold text-xs uppercase px-6 py-3 tracking-wider transition-colors inline-flex items-center"
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  Đăng ký tham dự
                </Link>
                <Link
                  href="/partnership-inquiries"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase px-5 py-3 tracking-wider transition-colors"
                >
                  Tài trợ sự kiện
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Other Upcoming Events */}
        <div>
          <div className="flex items-center space-x-2 mb-8 pb-3 border-b-2 border-[#111111]">
            <span className="w-2.5 h-2.5 bg-[#f4121e] inline-block" />
            <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-[#111111]">
              LỊCH SỰ KIỆN NĂM 2026 - 2027
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {UPCOMING_EVENTS.slice(1).map((ev) => (
              <div key={ev.id} className="bg-white border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={ev.imageUrl}
                      alt={ev.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#181716] text-white text-[11px] font-bold uppercase px-2.5 py-1">
                      {ev.badge}
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-serif text-xl font-bold text-[#111111] mb-3 leading-snug">
                      {ev.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {ev.description}
                    </p>

                    <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-[#f4121e]" />
                        <span>{ev.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-[#f4121e]" />
                        <span>{ev.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href="/partnership-inquiries"
                    className="w-full text-center block bg-[#181716] hover:bg-[#f4121e] text-white font-bold text-xs uppercase py-2.5 tracking-wider transition-colors"
                  >
                    Thông tin chi tiết & Đăng ký
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
