import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] bg-white flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <span className="w-3 h-3 rounded-full bg-[#f4121e] inline-block mb-3" />
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-[#111111] mb-4">404</h1>
        <h2 className="font-sans text-xl font-bold text-[#222222] mb-3">
          Không tìm thấy trang yêu cầu
        </h2>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed font-sans">
          Nội dung bạn đang tìm kiếm có thể đã được gỡ bỏ, đổi tên hoặc tạm thời không khả dụng.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#181716] hover:bg-[#f4121e] text-white text-xs font-bold uppercase tracking-wider py-3.5 px-8 transition-colors"
        >
          Trở về Trang chủ
        </Link>
      </div>
    </div>
  );
}
