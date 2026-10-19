import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#111111] text-gray-300 border-t border-[#222222] pt-14 pb-12 font-sans">
      <div className="forbes-container">
        {/* Top brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#262626]">
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-4xl sm:text-5xl font-extrabold uppercase text-white tracking-tighter">
                Forbes
              </span>
              <span className="text-xs uppercase font-bold tracking-widest text-[#d8361e] ml-2">
                Việt Nam
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Tôn vinh tinh thần doanh chủ, đem lại góc nhìn độc lập và sâu sắc về kinh doanh, công nghệ, lãnh đạo và các cơ hội đầu tư tại Việt Nam.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-[#1a1a1a] p-6 rounded border border-[#2a2a2a]">
              <h4 className="font-serif text-lg font-bold text-white mb-2">
                Đăng ký nhận bản tin Forbes Daily
              </h4>
              <p className="text-xs text-gray-400 mb-4">
                Nhận những phân tích kinh tế nổi bật và câu chuyện truyền cảm hứng trực tiếp vào hộp thư mỗi sáng.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Địa chỉ email của bạn..."
                  className="flex-1 bg-[#111111] border border-[#333333] px-4 py-2.5 rounded text-sm text-white focus:outline-none focus:border-[#d8361e]"
                />
                <button
                  type="button"
                  className="bg-[#d8361e] hover:bg-[#b82d18] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded transition-colors whitespace-nowrap"
                >
                  Đăng ký ngay
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Navigation links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 py-10 text-xs border-b border-[#262626]">
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-4">Chuyên mục</h5>
            <ul className="space-y-2.5 text-gray-400">
              <li><Link href="/category/kinh-doanh" className="hover:text-white transition-colors">Kinh doanh</Link></li>
              <li><Link href="/category/doanh-nghiep" className="hover:text-white transition-colors">Doanh nghiệp</Link></li>
              <li><Link href="/category/cong-nghe" className="hover:text-white transition-colors">Công nghệ</Link></li>
              <li><Link href="/category/tieu-diem" className="hover:text-white transition-colors">Tiêu điểm</Link></li>
              <li><Link href="/category/goc-nhin" className="hover:text-white transition-colors">Góc nhìn</Link></li>
              <li><Link href="/category/loi-song" className="hover:text-white transition-colors">Lối sống</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-4">Danh sách Forbes</h5>
            <ul className="space-y-2.5 text-gray-400">
              <li><Link href="/category/ty-phu" className="hover:text-white transition-colors">Tỷ phú thế giới</Link></li>
              <li><Link href="/category/30-under-30" className="hover:text-white transition-colors">Forbes 30 Under 30</Link></li>
              <li><Link href="/category/50-cong-ty" className="hover:text-white transition-colors">50 Công ty niêm yết</Link></li>
              <li><Link href="/category/phu-nu" className="hover:text-white transition-colors">Phụ nữ quyền lực</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-4">Sự kiện & Hội nghị</h5>
            <ul className="space-y-2.5 text-gray-400">
              <li><Link href="/category/hoi-nghi-thuong-hieu" className="hover:text-white transition-colors">Hội nghị Thương hiệu</Link></li>
              <li><Link href="/category/phat-trien-ben-vung" className="hover:text-white transition-colors">Diễn đàn Bền vững</Link></li>
              <li><Link href="/category/hoi-nghi-kinh-doanh" className="hover:text-white transition-colors">Hội nghị Kinh doanh</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-4">Về chúng tôi</h5>
            <ul className="space-y-2.5 text-gray-400">
              <li><Link href="/an-pham" className="hover:text-white transition-colors">Đặt mua ấn phẩm</Link></li>
              <li><Link href="/partnership-inquiries" className="hover:text-white transition-colors">Liên hệ quảng cáo</Link></li>
              <li><Link href="/editorial-standards" className="hover:text-white transition-colors">Tiêu chuẩn biên tập</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Khu vực CMS</Link></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <h5 className="font-bold text-white uppercase tracking-wider mb-4">Kết nối</h5>
            <div className="flex space-x-3 text-sm text-gray-300">
              <span className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#333333] cursor-pointer">f</span>
              <span className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#333333] cursor-pointer">in</span>
              <span className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#333333] cursor-pointer">yt</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & License */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500 space-y-4 md:space-y-0">
          <div>
            <p>© 2026 Forbes Media LLC. Bản quyền thuộc về Forbes Việt Nam.</p>
            <p className="mt-1">Giấy phép xuất bản điện tử số 155/GP-BTTTT do Bộ Thông tin và Truyền thông cấp.</p>
          </div>
          <div className="flex space-x-6 text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
