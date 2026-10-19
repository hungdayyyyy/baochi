import { notFound } from "next/navigation";
import connectDB from "@/lib/db/mongodb";
import Category from "@/lib/db/models/Category";
import SubcategoryPageTemplate from "@/components/public/SubcategoryPageTemplate";

export const revalidate = 300;

interface SubcategoryPageProps {
  params: { slug: string; sub: string };
}

export async function generateMetadata({ params }: SubcategoryPageProps) {
  const fullSlug = `${params.slug}/${params.sub}`;

  try {
    await connectDB();
    const subCategory: any =
      (await Category.findOne({ slug: fullSlug }).lean()) ||
      (await Category.findOne({ slug: params.sub }).lean()) ||
      (await Category.findOne({ slug: { $regex: new RegExp(`/${params.sub}$`) } }).lean());

    if (subCategory) {
      return {
        title: `${subCategory.name} - Forbes Việt Nam`,
        description: `Tin tức và phân tích chuyên sâu về ${subCategory.name} trên Forbes Việt Nam`,
      };
    }
  } catch (e) {
    console.warn("DB error in subcategory metadata:", e);
  }

  return { title: "Chuyên mục | Forbes Việt Nam" };
}

export default async function SubcategoryDynamicPage({ params }: SubcategoryPageProps) {
  const fullSlug = `${params.slug}/${params.sub}`;

  let subCategory: any = null;
  let parentCategory: any = null;
  let siblings: any[] = [];

  try {
    await connectDB();
    subCategory =
      (await Category.findOne({ slug: fullSlug }).lean()) ||
      (await Category.findOne({ slug: params.sub }).lean()) ||
      (await Category.findOne({ slug: { $regex: new RegExp(`/${params.sub}$`) } }).lean());

    if (subCategory) {
      if (subCategory.parentId) {
        parentCategory = await Category.findById(subCategory.parentId).lean();
      }
      if (!parentCategory) {
        parentCategory = await Category.findOne({ slug: params.slug }).lean();
      }

      if (parentCategory) {
        siblings = await Category.find({ parentId: parentCategory._id })
          .sort({ position: 1 })
          .lean();
      }
    }
  } catch (e) {
    console.warn("DB error in subcategory page:", e);
  }

  // Fallback for special slugs like Tiêu điểm & Góc nhìn
  if (!subCategory && (params.slug === "goc-nhin" || params.slug === "tieu-diem")) {
    if (params.sub.includes("y-tuong")) {
      subCategory = { name: "Ý tưởng", slug: "goc-nhin/y-tuong" };
    } else {
      subCategory = { name: "Sự kiện và Bình luận", slug: "goc-nhin/su-kien-va-binh-luan" };
    }
    parentCategory = { name: "Tiêu điểm", slug: "tieu-diem" };
    siblings = [
      { name: "Sự kiện và Bình luận", slug: "goc-nhin/su-kien-va-binh-luan" },
      { name: "Ý tưởng", slug: "goc-nhin/y-tuong" },
    ];
  }

  if (!subCategory) {
    notFound();
  }

  const formattedSub = {
    _id: subCategory._id?.toString() || subCategory.slug,
    name: subCategory.name,
    slug: subCategory.slug,
  };

  const formattedParent = parentCategory
    ? {
        _id: parentCategory._id?.toString() || parentCategory.slug,
        name: parentCategory.name,
        slug: parentCategory.slug === "goc-nhin" ? "tieu-diem" : parentCategory.slug,
        siblings: siblings.map((s: any) => ({
          _id: s._id?.toString() || s.slug,
          name: s.name,
          slug: s.slug,
        })),
      }
    : null;

  return (
    <SubcategoryPageTemplate
      category={formattedSub}
      parentCategory={formattedParent}
    />
  );
}
