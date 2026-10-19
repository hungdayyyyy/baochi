import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { getNavCategories } from "@/lib/cache";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: any[] = [];
  try {
    categories = await getNavCategories();
  } catch (e) {
    console.warn("Could not fetch categories from DB, using fallback menu.", e);
  }

  return (
    <div className="flex-1 flex flex-col justify-between">
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
