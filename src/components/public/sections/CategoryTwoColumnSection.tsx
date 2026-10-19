import Link from "next/link";
import { PopulatedArticle } from "@/types";
import LeadStory from "./LeadStory";
import FeatureGrid from "./FeatureGrid";
import ListWithThumbnail from "./ListWithThumbnail";

interface CategoryTwoColumnSectionProps {
  leftTitle: string;
  leftCategorySlug: string;
  leftArticles: PopulatedArticle[];
  rightTitle: string;
  rightCategorySlug: string;
  rightArticles: PopulatedArticle[];
  className?: string;
}

export default function CategoryTwoColumnSection({
  leftTitle,
  leftCategorySlug,
  leftArticles = [],
  rightTitle,
  rightCategorySlug,
  rightArticles = [],
  className = "",
}: CategoryTwoColumnSectionProps) {
  const leftLead = leftArticles[0];
  const leftSubGrid = leftArticles.slice(1, 3);
  const rightList = rightArticles.slice(0, 4);

  return (
    <section className={`w-full py-8 border-b border-gray-200 bg-white ${className}`}>
      <div className="max-w-[1220px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN: 7 cols (e.g., Lối sống) */}
          <div className="lg:col-span-7">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-5">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f4121e] inline-block" />
                <h2 className="font-sans text-[20px] sm:text-[22px] font-bold text-[#111111] tracking-tight">
                  <Link href={`/${leftCategorySlug}`} className="hover:text-[#f4121e] transition-colors">
                    {leftTitle}
                  </Link>
                </h2>
              </div>

              <Link
                href={`/${leftCategorySlug}`}
                className="text-xs sm:text-[13px] font-sans font-medium text-[#777777] hover:text-[#f4121e] flex items-center space-x-1 transition-colors"
              >
                <span>Xem thêm</span>
                <span className="text-[14px]">→</span>
              </Link>
            </div>

            {/* Lead Story */}
            {leftLead && <LeadStory article={leftLead} className="mb-6" />}

            {/* Sub-grid of 2 articles */}
            {leftSubGrid.length > 0 && <FeatureGrid articles={leftSubGrid} columns={2} />}
          </div>

          {/* RIGHT COLUMN: 5 cols (e.g., Góc nhìn) */}
          <div className="lg:col-span-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-5">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f4121e] inline-block" />
                <h2 className="font-sans text-[20px] sm:text-[22px] font-bold text-[#111111] tracking-tight">
                  <Link href={`/${rightCategorySlug}`} className="hover:text-[#f4121e] transition-colors">
                    {rightTitle}
                  </Link>
                </h2>
              </div>

              <Link
                href={`/${rightCategorySlug}`}
                className="text-xs sm:text-[13px] font-sans font-medium text-[#777777] hover:text-[#f4121e] flex items-center space-x-1 transition-colors"
              >
                <span>Xem thêm</span>
                <span className="text-[14px]">→</span>
              </Link>
            </div>

            {/* List with thumbnails matching IMAGE 3 */}
            <ListWithThumbnail articles={rightList} />
          </div>
        </div>
      </div>
    </section>
  );
}
