"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, CheckCircle, ArrowRight } from "lucide-react";

export default function PartnershipInquiriesPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    topic: "sponsorship",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen">
      {/* Hero Header */}
      <div className="w-full bg-[#181716] text-white py-14 border-b border-[#2d2c2a]">
        <div className="max-w-[1220px] mx-auto px-4 text-center">
          <span className="text-[12px] font-bold uppercase tracking-widest text-[#f4121e] block mb-3">
            HỢP TÁC DOANH NGHIỆP
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Cơ Hội Hợp Tác Cùng Forbes Việt Nam
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-sans">
            Đồng hành cùng ấn bản kinh doanh hàng đầu, kết nối thương hiệu của bạn tới cộng đồng doanh nhân, nhà đầu tư và các lãnh đạo doanh nghiệp xuất sắc nhất.
          </p>
        </div>
      </div>

      <div className="max-w-[1220px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Value Propositions & Contact Information */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#111111] mb-4">
                Các Hình Thức Hợp Tác Chiến Lược
              </h2>
              <div className="space-y-4">
                <div className="bg-white p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-base text-[#111111] mb-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-[#f4121e] mr-2 inline-block" />
                    Tài trợ Sự kiện & Hội nghị Thượng đỉnh (Conferences & Summits)
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Đồng hành cùng các sự kiện uy tín quy mô lớn: Forbes Brand Conference, Women Summit, Under 30 Summit, Business Forum.
                  </p>
                </div>

                <div className="bg-white p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-base text-[#111111] mb-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-[#f4121e] mr-2 inline-block" />
                    Nội dung Thương hiệu (BrandVoice & Native Content)
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Kể câu chuyện đổi mới sáng tạo, phát triển bền vững (ESG) và năng lực quản trị của doanh nghiệp qua lăng kính phóng sự chuyên sâu chuẩn Forbes.
                  </p>
                </div>

                <div className="bg-white p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-base text-[#111111] mb-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-[#f4121e] mr-2 inline-block" />
                    Quảng cáo Kỹ thuật số & Đa nền tảng (Digital Display & Video)
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Tiếp cận hơn 3 triệu độc giả hàng tháng qua các vị trí hiển thị cao cấp trên website forbes.vn, newsletter và kênh video chuyên đề.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Box */}
            <div className="bg-[#181716] text-white p-8 border border-[#2d2c2a]">
              <h3 className="font-serif text-xl font-bold mb-4">
                Ban Phát Triển Kinh Doanh
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#f4121e] shrink-0" />
                  <span>partnership@forbes.vn</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#f4121e] shrink-0" />
                  <span>(+84) 28 3936 9390 (Ext: 102)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#f4121e] shrink-0 mt-0.5" />
                  <span>Toà nhà Pax Sky, 186 Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, TP.HCM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Inquiry Form */}
          <div className="lg:col-span-6">
            <div className="bg-white p-8 md:p-10 border border-gray-200 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-[#111111] mb-2">
                Gửi Yêu Cầu Hợp Tác
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Vui lòng điền thông tin bên dưới, bộ phận phụ trách sẽ liên hệ phản hồi trong vòng 24 giờ làm việc.
              </p>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 p-8 text-center rounded">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-serif text-xl font-bold text-green-900 mb-2">
                    Gửi yêu cầu thành công!
                  </h4>
                  <p className="text-sm text-green-800 mb-6">
                    Cảm ơn quý đối tác đã quan tâm. Đại diện Forbes Việt Nam sẽ liên hệ với quý đối tác qua email và số điện thoại đã cung cấp.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-[#181716] hover:bg-black text-white font-bold text-xs uppercase px-6 py-2.5 tracking-wider transition-colors"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-gray-50 border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#f4121e] focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Email công việc *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full bg-gray-50 border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#f4121e] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0901234567"
                        className="w-full bg-gray-50 border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#f4121e] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Tên Doanh nghiệp / Tổ chức *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Công ty Cổ phần ABC"
                      className="w-full bg-gray-50 border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#f4121e] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Lĩnh vực quan tâm hợp tác
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#f4121e] focus:bg-white"
                    >
                      <option value="sponsorship">Tài trợ sự kiện & Hội nghị (Events Sponsorship)</option>
                      <option value="brandvoice">Bài viết thương hiệu (BrandVoice / Native)</option>
                      <option value="digital-ads">Quảng cáo Digital Banner & Display</option>
                      <option value="magazine">Quảng cáo trên Tạp chí in</option>
                      <option value="other">Ý tưởng hợp tác khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Nội dung chi tiết yêu cầu
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Mô tả mục tiêu chiến dịch, thời gian dự kiến và ngân sách..."
                      className="w-full bg-gray-50 border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#f4121e] focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#f4121e] hover:bg-[#d8101a] text-white font-bold text-sm uppercase py-3.5 tracking-wider transition-colors rounded-none mt-2"
                  >
                    Gửi yêu cầu hợp tác
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
