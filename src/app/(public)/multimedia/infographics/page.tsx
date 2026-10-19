import CategoryPageTemplate from "@/components/public/CategoryPageTemplate";

export const metadata = {
  title: "Infographic - Dữ liệu trực quan | Forbes Việt Nam",
  description: "Bộ sưu tập Infographics phân tích dữ liệu kinh tế, thị trường tài chính và công nghệ từ Forbes Việt Nam.",
};

export const revalidate = 300;

export default async function InfographicsPage() {
  const category = {
    _id: "cat_infographic",
    name: "Infographic",
    slug: "multimedia/infographics",
  };

  return <CategoryPageTemplate category={category} />;
}
