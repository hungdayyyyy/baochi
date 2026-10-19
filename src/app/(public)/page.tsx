import MasterHeadSection from "@/components/public/MasterHeadSection";
import QuoteSection from "@/components/public/QuoteSection";
import CategoryHomeSection from "@/components/public/CategoryHomeSection";
import StartupStripSection from "@/components/public/sections/StartupStripSection";
import CategoryTwoColumnSection from "@/components/public/sections/CategoryTwoColumnSection";
import EventsSection from "@/components/public/EventsSection";
import { getLayoutArticles, getCategoryArticlesCursor, getSubcategoryMap } from "@/lib/cache";
import { PopulatedArticle } from "@/types";

export const revalidate = 300; // ISR 5 minutes

const kinhDoanhSubs = [
  { name: "THỊ TRƯỜNG", slug: "kinh-doanh/thi-truong" },
  { name: "TÀI CHÍNH", slug: "kinh-doanh/tai-chinh-kinh-doanh" },
  { name: "BẤT ĐỘNG SẢN", slug: "kinh-doanh/bat-dong-san" },
  { name: "CÔNG NGHIỆP", slug: "kinh-doanh/cong-nghiep" },
  { name: "DỊCH VỤ", slug: "kinh-doanh/dich-vu" },
];

const doanhNghiepSubs = [
  { name: "DOANH NHÂN", slug: "doanh-nghiep/doanh-nhan" },
  { name: "HỒ SƠ CÔNG TY", slug: "doanh-nghiep/ho-so-cong-ty" },
  { name: "QUẢN TRỊ", slug: "doanh-nghiep/quan-tri" },
  { name: "START-UP", slug: "doanh-nghiep/start-up" },
  { name: "CHUYỂN ĐỔI SỐ", slug: "doanh-nghiep/chuyen-doi-so" },
  { name: "NHÂN VẬT", slug: "doanh-nghiep/nhan-vat" },
];

const congNgheSubs = [
  { name: "ĐỔI MỚI", slug: "cong-nghe/doi-moi" },
  { name: "CHIẾN LƯỢC", slug: "cong-nghe/chien-luoc" },
  { name: "TRÍ TUỆ NHÂN TẠO (AI)", slug: "cong-nghe/tri-tue-nhan-tao" },
  { name: "XU HƯỚNG", slug: "cong-nghe/xu-huong" },
  { name: "SÁNG TẠO", slug: "cong-nghe/sang-tao" },
  { name: "CÔNG NGHỆ XANH", slug: "cong-nghe/cong-nghe-xanh" },
  { name: "BLOCKCHAIN", slug: "cong-nghe/blockchain" },
  { name: "FINTECH", slug: "cong-nghe/fintech" },
];

export default async function HomePage() {
  let spotlightArticle: PopulatedArticle | null = null;
  let topStories: PopulatedArticle[] = [];
  let featureCarousel: PopulatedArticle[] = [];
  let trendingSidebar: PopulatedArticle[] = [];

  let kinhDoanhArticles: PopulatedArticle[] = [];
  let startupArticles: PopulatedArticle[] = [];
  let doanhNghiepArticles: PopulatedArticle[] = [];
  let congNgheArticles: PopulatedArticle[] = [];
  let loiSongArticles: PopulatedArticle[] = [];
  let gocNhinArticles: PopulatedArticle[] = [];
  let subMap: Record<string, PopulatedArticle[]> = {};

  try {
    subMap = await getSubcategoryMap();
  } catch (err) {
    console.warn("Could not load subcategory map:", err);
  }

  try {
    const [
      heroArticles,
      spotlight,
      top,
      carousel,
      trending,
      kinhDoanhBlock,
      startupBlock,
      doanhNghiepBlock,
      congNgheBlock,
      loiSongBlock,
      gocNhinBlock,
      kinhDoanhStream,
      startupStream,
      doanhNghiepStream,
      congNgheStream,
      loiSongStream,
      gocNhinStream,
    ] = await Promise.all([
      getLayoutArticles("home", "hero"),
      getLayoutArticles("home", "spotlight"),
      getLayoutArticles("home", "master-head-top"),
      getLayoutArticles("home", "feature-carousel"),
      getLayoutArticles("home", "trending-sidebar"),
      getLayoutArticles("home", "kinh-doanh-block"),
      getLayoutArticles("home", "startup-strip"),
      getLayoutArticles("home", "doanh-nghiep-block"),
      getLayoutArticles("home", "cong-nghe-block"),
      getLayoutArticles("home", "loi-song-block"),
      getLayoutArticles("home", "goc-nhin-block"),
      getCategoryArticlesCursor({ categorySlug: "kinh-doanh", limit: 6 }),
      getCategoryArticlesCursor({ categorySlug: "start-up", limit: 6 }),
      getCategoryArticlesCursor({ categorySlug: "doanh-nghiep", limit: 6 }),
      getCategoryArticlesCursor({ categorySlug: "cong-nghe", limit: 6 }),
      getCategoryArticlesCursor({ categorySlug: "loi-song", limit: 6 }),
      getCategoryArticlesCursor({ categorySlug: "goc-nhin", limit: 6 }),
    ]);

    spotlightArticle = heroArticles[0] || spotlight[0] || null;
    topStories = top;
    featureCarousel = carousel;
    trendingSidebar = trending;

    kinhDoanhArticles = kinhDoanhBlock.length > 0 ? kinhDoanhBlock : kinhDoanhStream.articles;
    startupArticles = startupBlock.length > 0 ? startupBlock : startupStream.articles;
    doanhNghiepArticles = doanhNghiepBlock.length > 0 ? doanhNghiepBlock : doanhNghiepStream.articles;
    congNgheArticles = congNgheBlock.length > 0 ? congNgheBlock : congNgheStream.articles;
    loiSongArticles = loiSongBlock.length > 0 ? loiSongBlock : loiSongStream.articles;
    gocNhinArticles = gocNhinBlock.length > 0 ? gocNhinBlock : gocNhinStream.articles;
  } catch (err) {
    console.warn("Database error in HomePage:", err);
  }

  return (
    <div className="w-full bg-[#f8f9fa]">
      {/* 1. Master Head: Full-Bleed Background Hero + Trending Sidebar */}
      <MasterHeadSection
        spotlight={spotlightArticle}
        topStories={topStories}
        carouselArticles={featureCarousel}
        trendingArticles={trendingSidebar}
      />

      {/* 2. Quote of the Day Strip */}
      <QuoteSection />

      {/* 3. Kinh doanh Category Section (IMAGE 1: Lead Left + 4 Cards 2x2 Right) */}
      <CategoryHomeSection
        title="Kinh doanh"
        categorySlug="kinh-doanh"
        subcategories={kinhDoanhSubs}
        articles={kinhDoanhArticles}
        subcategoryMap={subMap}
        layoutVariant="lead-left"
      />

      {/* 4. Start-up Section (IMAGE 2: 5 Cards Horizontal Strip with right arrow) */}
      <StartupStripSection articles={startupArticles} />

      {/* 5. Doanh nghiệp Category Section (IMAGE 3: 4 Cards 2x2 Left + Lead Right Gloria Moncrief) */}
      <CategoryHomeSection
        title="Doanh nghiệp"
        categorySlug="doanh-nghiep"
        subcategories={doanhNghiepSubs}
        articles={doanhNghiepArticles}
        subcategoryMap={subMap}
        layoutVariant="lead-right"
      />

      {/* 6. Công nghệ Category Section (IMAGE 4: Lead Left AI Nông nghiệp + 4 Cards 2x2 Right) */}
      <CategoryHomeSection
        title="Công nghệ"
        categorySlug="cong-nghe"
        subcategories={congNgheSubs}
        articles={congNgheArticles}
        subcategoryMap={subMap}
        layoutVariant="lead-left"
      />

      {/* 7. Lối sống (7 cols) & Góc nhìn (5 cols) (IMAGE 5) */}
      <CategoryTwoColumnSection
        leftTitle="Lối sống"
        leftCategorySlug="loi-song"
        leftArticles={loiSongArticles}
        rightTitle="Góc nhìn"
        rightCategorySlug="goc-nhin"
        rightArticles={gocNhinArticles}
      />

      {/* 8. Events & Conferences Section */}
      <EventsSection />
    </div>
  );
}
