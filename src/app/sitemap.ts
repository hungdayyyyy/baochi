import { MetadataRoute } from "next";
import connectDB from "@/lib/db/mongodb";
import Article from "@/lib/db/models/Article";
import Category from "@/lib/db/models/Category";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://forbes.vn";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
  ];

  try {
    await connectDB();
    const categories = await Category.find({}).select("slug updatedAt").lean();
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat: any) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: cat.updatedAt || new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    const articles = await Article.find({ status: "published", deletedAt: null })
      .select("slug updatedAt")
      .sort({ publishedAt: -1 })
      .limit(100)
      .lean();

    const articleRoutes: MetadataRoute.Sitemap = articles.map((art: any) => ({
      url: `${baseUrl}/${art.slug}`,
      lastModified: art.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
  } catch (e) {
    return staticRoutes;
  }
}
