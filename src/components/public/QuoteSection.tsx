export default function QuoteSection({
  quote = "Thành công trong kinh doanh không chỉ đo bằng quy mô lợi nhuận, mà còn ở giá trị bền vững để lại cho cộng đồng.",
  author = "Steve Forbes",
  title = "Chủ tịch kiêm Tổng biên tập Forbes Media",
}: {
  quote?: string;
  author?: string;
  title?: string;
}) {
  return (
    <section className="w-full bg-[#f8f9fa] text-[#111111] py-12 border-y border-gray-200">
      <div className="forbes-container max-w-4xl text-center">
        <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#f4121e] mb-3 inline-block">
          Câu nói của ngày • Quote of the Day
        </span>
        <blockquote className="font-serif text-xl sm:text-2xl md:text-[28px] leading-relaxed italic mb-6 text-[#111111]">
          "{quote}"
        </blockquote>
        <div className="text-xs font-sans">
          <p className="font-bold uppercase tracking-wider text-[#111111]">{author}</p>
          <p className="text-gray-500 mt-0.5">{title}</p>
        </div>
      </div>
    </section>
  );
}
