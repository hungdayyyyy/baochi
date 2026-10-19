"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Calendar,
  Bell,
  Users,
  Check,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  Smartphone,
  X,
} from "lucide-react";

export default function DatBaoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
    setFormData({ name: "", phone: "", email: "", address: "", note: "" });
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen font-sans">
      {/* 1. HERO SECTION (Matching Image 5) */}
      <section className="w-full bg-[#181716] text-white py-14 lg:py-20 relative overflow-hidden border-b border-[#2d2c2a]">
        {/* Subtle magazine covers ghost pattern background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-[1220px] mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Featured Magazine Cover */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-[280px] sm:w-[320px] aspect-[3/4] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-neutral-700 rounded-sm overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80"
                  alt="Ấn phẩm số 155/156: 50 Thương hiệu Dẫn đầu năm 2026"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Magazine Spine Overlay */}
                <div className="absolute top-0 left-0 bottom-0 w-3 bg-gradient-to-r from-black/40 to-transparent" />
                {/* Issue badge */}
                <div className="absolute top-4 left-4 bg-[#f4121e] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                  Số 155/156
                </div>
              </div>
            </div>

            {/* Right: Issue Headline, Description & CTA */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f4121e]" />
                <span className="text-[12px] font-bold uppercase tracking-widest text-[#f4121e]">
                  ĐẶT BÁO
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold leading-tight text-white">
                Ấn phẩm số 155/156: 50 Thương hiệu Dẫn đầu năm 2026
              </h1>

              <div className="text-[13px] text-gray-400 font-medium">
                Phát hành: Tháng 10.2026
              </div>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Mùa thứ 11 Forbes Việt Nam thực hiện Danh sách 50 Thương hiệu dẫn đầu năm 2026.
                Tổng giá trị USD đã đạt một mốc mới cho thấy các doanh nghiệp đang biến vị thế thị trường
                thành sức mạnh kinh tế.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center space-x-2 bg-[#f4121e] hover:bg-[#d8101a] text-white font-bold text-sm uppercase tracking-wider px-8 py-3.5 shadow-lg transition-colors"
                >
                  <span>Đặt ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION SECTION (Matching Image 5) */}
      <section className="w-full py-16 bg-white border-b border-gray-200">
        <div className="max-w-[1220px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: 3 Fanned-out Magazine Mockups */}
            <div className="lg:col-span-6 flex justify-center py-6">
              <div className="relative w-[340px] sm:w-[420px] h-[320px]">
                {/* Back Issue 1 */}
                <div className="absolute top-2 left-0 w-[190px] sm:w-[220px] aspect-[3/4] shadow-xl border border-gray-200 -rotate-12 transform origin-bottom-left overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
                    alt="Forbes Issue 1"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Back Issue 2 */}
                <div className="absolute top-0 left-16 w-[190px] sm:w-[220px] aspect-[3/4] shadow-xl border border-gray-200 -rotate-6 transform origin-bottom-left overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"
                    alt="Forbes Issue 2"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Front Main Issue: 10 SỰ KIỆN KINH DOANH NỔI BẬT */}
                <div className="absolute top-4 left-32 w-[200px] sm:w-[240px] aspect-[3/4] shadow-2xl border border-neutral-800 rotate-6 transform origin-bottom-left overflow-hidden bg-[#181716] p-4 text-white flex flex-col justify-between">
                  <div className="text-center">
                    <span className="font-serif text-xl font-bold tracking-wider block">Forbes</span>
                    <span className="text-[7px] text-gray-400 uppercase tracking-widest">VIỆT NAM</span>
                  </div>
                  <div className="border border-[#d4af37]/40 p-4 text-center bg-[#1f1e1c]">
                    <span className="font-serif text-3xl font-bold text-[#d4af37] block">10</span>
                    <span className="text-[11px] font-bold text-white tracking-widest uppercase block mt-1">
                      SỰ KIỆN
                    </span>
                    <span className="text-[11px] font-bold text-[#d4af37] tracking-widest uppercase block">
                      KINH DOANH
                    </span>
                    <span className="text-[9px] font-bold text-gray-300 tracking-widest uppercase block">
                      NỔI BẬT
                    </span>
                  </div>
                  <div className="text-[8px] text-center text-gray-400">ẤN BẢN ĐẶC BIỆT</div>
                </div>
              </div>
            </div>

            {/* Right: Description & Editorial Philosophy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f4121e]" />
                <span className="text-[12px] font-bold uppercase tracking-widest text-[#f4121e]">
                  GIỚI THIỆU
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] leading-tight">
                Ấn phẩm Forbes Việt Nam
              </h2>

              {/* Badges */}
              <div className="space-y-2">
                <div className="inline-block bg-[#111111] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 mr-2">
                  Ấn phẩm tiêu biểu của tạp chí doanh nhân
                </div>
                <div className="inline-block bg-[#111111] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5">
                  Đã có mặt trên hơn 40 quốc gia
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed font-sans">
                <p>
                  Forbes Việt Nam mang đến nguồn thông tin và góc nhìn sâu sắc về doanh nghiệp và kinh
                  doanh dành cho các nhà lãnh đạo và cộng đồng khởi nghiệp. Với các chuyên đề độc quyền,
                  phỏng vấn chuyên sâu cùng các danh sách xếp hạng uy tín nhất thị trường.
                </p>
                <p>
                  Mỗi ấn phẩm là một bức tranh toàn cảnh, giúp quý độc giả đón đầu các xu hướng kinh tế mới,
                  tìm kiếm cơ hội đầu tư chiến lược và kết nối với các nhân vật tiên phong trong khu vực.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4 FEATURE BENEFIT CARDS (Matching Image 5) */}
      <section className="w-full py-16 bg-[#f8f9fa] border-b border-gray-200">
        <div className="max-w-[1220px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Vận chuyển tận nơi */}
            <div className="bg-white p-7 border border-gray-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#f4121e] mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-sans text-[15px] font-bold text-[#111111] uppercase tracking-wide mb-2.5">
                Vận chuyển tận nơi
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Cung cấp mạng lưới giao nhận chuyên nghiệp, đảm bảo tạp chí luôn đến tay bạn đúng ngày phát hành.
              </p>
            </div>

            {/* Card 2: Ưu đãi tham gia sự kiện */}
            <div className="bg-white p-7 border border-gray-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#f4121e] mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-sans text-[15px] font-bold text-[#111111] uppercase tracking-wide mb-2.5">
                Ưu đãi tham gia sự kiện
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Được ưu tiên đăng ký và hưởng mức giá đặc quyền khi tham gia các hội nghị thượng đỉnh thường niên.
              </p>
            </div>

            {/* Card 3: Cập nhật tin tức */}
            <div className="bg-white p-7 border border-gray-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#f4121e] mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="font-sans text-[15px] font-bold text-[#111111] uppercase tracking-wide mb-2.5">
                Cập nhật tin tức
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Tiếp cận các báo cáo nghiên cứu và phân tích chuyên sâu độc quyền trước khi phát hành đại chúng.
              </p>
            </div>

            {/* Card 4: Kết nối cộng đồng lãnh đạo */}
            <div className="bg-white p-7 border border-gray-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#f4121e] mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-sans text-[15px] font-bold text-[#111111] uppercase tracking-wide mb-2.5">
                Kết nối cộng đồng
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Gia nhập mạng lưới các nhà sáng lập, CEO và các nhà đầu tư có tầm ảnh hưởng lớn nhất Việt Nam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SUBSCRIPTION PACKAGE SECTION (Matching Image 5) */}
      <section className="w-full py-16 bg-white border-b border-gray-200">
        <div className="max-w-[1220px] mx-auto px-4">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="font-serif text-3xl font-bold text-[#111111] mb-4">
              Lựa chọn gói đặt ấn phẩm
            </h2>
            <div className="space-y-2 text-sm text-gray-600 max-w-2xl font-sans">
              <p className="font-medium text-[#111111]">
                Trở thành độc giả thân thiết của Forbes Việt Nam để nhận các quyền lợi:
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-gray-500">
                <li>Ấn phẩm in phát hành định kỳ hàng tháng (12 kỳ/năm)</li>
                <li>Tặng kèm quyền truy cập trọn vẹn toàn bộ các ấn bản số trên ứng dụng di động</li>
                <li>Miễn phí vận chuyển tận nơi trên toàn quốc</li>
              </ul>
            </div>
          </div>

          {/* Package Card */}
          <div className="max-w-md bg-[#fafafa] border border-gray-200 p-8 shadow-sm relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  GÓI ĐẶT ẤN PHẨM
                </span>
                <h3 className="font-serif text-4xl font-black text-[#111111]">
                  01 năm
                </h3>
              </div>
              <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="text-2xl font-bold text-[#f4121e] mb-6">
              990.000 <span className="text-xs font-normal text-gray-500">VNĐ / năm</span>
            </div>

            <div className="space-y-2.5 text-xs text-gray-600 mb-8 font-sans">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#f4121e] shrink-0" />
                <span>Giao định kỳ hàng tháng</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#f4121e] shrink-0" />
                <span>Miễn phí vận chuyển toàn quốc</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-[#181716] hover:bg-[#f4121e] text-white font-bold text-xs uppercase tracking-wider py-3.5 transition-colors"
            >
              Đặt ngay
            </button>
          </div>
        </div>
      </section>

      {/* 5. CONTACT & APP DOWNLOAD SECTION (Matching Image 5) */}
      <section className="w-full py-16 bg-[#f8f9fa]">
        <div className="max-w-[1220px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left: Contact */}
            <div className="space-y-5">
              <h3 className="font-serif text-2xl font-bold text-[#111111]">
                Liên hệ
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                Liên hệ với chúng tôi để biết thêm thông tin về các giải pháp truyền thông và ưu đãi độc quyền dành cho doanh nghiệp.
              </p>

              <div className="space-y-3 text-xs text-gray-700">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-[#f4121e]" />
                  <span>Email: <strong className="text-black">phathanh@forbes.vn</strong></span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-[#f4121e]" />
                  <span>Hotline: <strong className="text-black">(028) 3936 9898</strong></span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="border border-gray-400 hover:border-black text-[#111111] font-bold text-xs uppercase tracking-wider px-6 py-2.5 transition-colors"
                >
                  Liên hệ
                </button>
              </div>
            </div>

            {/* Right: App Download */}
            <div className="space-y-5">
              <h3 className="font-serif text-2xl font-bold text-[#111111]">
                Tải ứng dụng
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Quét mã tải app hoặc tải từ kho ứng dụng để đọc tạp chí kỹ thuật số mọi lúc mọi nơi.
              </p>

              <div className="flex items-center space-x-4 pt-2">
                {/* Magzter Logo simulation */}
                <div className="border border-gray-300 bg-white px-4 py-2 font-bold text-lg tracking-wider text-gray-800">
                  MAGZTER
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Google Play Button */}
                <div className="bg-black text-white px-4 py-2 rounded flex items-center space-x-2 text-xs cursor-pointer hover:bg-neutral-800 transition-colors">
                  <Smartphone className="w-4 h-4 text-white" />
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-gray-400">GET IT ON</div>
                    <div className="font-bold">Google Play</div>
                  </div>
                </div>

                {/* App Store Button */}
                <div className="bg-black text-white px-4 py-2 rounded flex items-center space-x-2 text-xs cursor-pointer hover:bg-neutral-800 transition-colors">
                  <Smartphone className="w-4 h-4 text-white" />
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-gray-400">Download on the</div>
                    <div className="font-bold">App Store</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ORDER FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg p-6 sm:p-8 shadow-2xl relative border-t-4 border-[#f4121e]">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-[#111111]">
                  Đăng Ký Thành Công!
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Cảm ơn bạn đã đặt tạp chí Forbes Việt Nam. Bộ phận phát hành sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận thông tin giao nhận.
                </p>
                <button
                  onClick={closeModal}
                  className="bg-[#181716] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#f4121e] transition-colors"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#111111] mb-2">
                  Đăng Ký Đặt Ấn Phẩm
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Gói 01 Năm: 990.000 VNĐ (Giao định kỳ hàng tháng tận nơi)
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#f4121e]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0901234567"
                        className="w-full border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#f4121e]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@company.vn"
                        className="w-full border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#f4121e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Địa chỉ nhận tạp chí *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      className="w-full border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#f4121e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Ghi chú thêm
                    </label>
                    <textarea
                      rows={2}
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="Thông tin xuất hóa đơn VAT (nếu có)..."
                      className="w-full border border-gray-300 p-2.5 text-sm focus:outline-none focus:border-[#f4121e]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#f4121e] hover:bg-[#d8101a] text-white font-bold text-xs uppercase tracking-wider py-3.5 transition-colors shadow-md"
                    >
                      Xác Nhận Đặt Báo
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
