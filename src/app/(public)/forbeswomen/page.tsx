import Link from "next/link";
import Image from "next/image";
import ArticleCard from "@/components/public/ArticleCard";
import { getLayoutArticles } from "@/lib/cache";
import { PopulatedArticle } from "@/types";

export const revalidate = 300;

export const metadata = {
  title: "ForbesWomen - Câu chuyện nổi bật | Forbes Việt Nam",
  description: "Tôn vinh các nữ lãnh đạo, doanh nhân và những người tiên phong kiến tạo giá trị cho xã hội.",
};

export default async function ForbesWomenPage() {
  let spotlightArticle: PopulatedArticle | null = null;
  let articles: PopulatedArticle[] = [];

  try {
    const list = await getLayoutArticles("home", "feature-carousel");
    spotlightArticle = list[0] || null;
    articles = list.slice(1);
  } catch (err) {
    console.warn("Could not load forbeswomen articles:", err);
  }

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen">
      {/* ForbesWomen Hero Banner */}
      <div className="w-full bg-[#181716] text-white py-12 border-b border-[#2d2c2a]">
        <div className="max-w-[1220px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#f4121e] block mb-2">
                CHUYÊN ĐỀ ĐẶC BIỆT
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                Forbes<span className="text-[#f4121e]">Women</span>
              </h1>
              <p className="text-gray-300 text-base leading-relaxed">
                Nơi tôn vinh bản lĩnh, tầm nhìn chiến lược và sức mạnh thay đổi của các nữ lãnh đạo doanh nghiệp, các nhà sáng lập và những nhân vật truyền cảm hứng tại Việt Nam và khu vực.
              </p>
            </div>
            <div className="bg-[#242321] p-6 border border-[#3a3937] text-center shrink-0 w-full md:w-[320px]">
              <span className="text-xs uppercase tracking-widest text-gray-400 block mb-1">
                ẤN BẢN ĐẶC BIỆT
              </span>
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Top 50 Nữ Doanh Nhân Tiêu Biểu
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Danh sách bình chọn thường niên uy tín nhất từ Hội đồng biên tập Forbes Việt Nam.
              </p>
              <Link
                href="/partnership-inquiries"
                className="inline-block bg-[#f4121e] hover:bg-[#d8101a] text-white font-bold text-xs uppercase px-4 py-2 transition-colors"
              >
                Đăng ký đề cử
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1220px] mx-auto px-4 py-10">
        {/* Spotlight Story */}
        {spotlightArticle && (
          <div className="mb-12 bg-white border border-gray-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center">
              <div className="md:col-span-7 relative aspect-[16/10] overflow-hidden">
                <Image
                  src={spotlightArticle.coverImage?.url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200"}
                  alt={spotlightArticle.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="md:col-span-5 p-8">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#f4121e] block mb-2">
                  CÂU CHUYỆN NỔI BẬT
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#111111] mb-4 hover:text-[#f4121e] transition-colors leading-tight">
                  <Link href={`/${spotlightArticle.slug}`}>{spotlightArticle.title}</Link>
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4">
                  {spotlightArticle.excerpt}
                </p>
                <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                  Tác giả: <span className="font-bold text-gray-800">{spotlightArticle.author?.name || "Lê Vy"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <div key={art._id} className="bg-white border border-gray-200 p-4 shadow-sm">
              <ArticleCard article={art} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
