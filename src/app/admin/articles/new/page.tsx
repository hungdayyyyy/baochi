import connectDB from "@/lib/db/mongodb";
import Category from "@/lib/db/models/Category";
import Author from "@/lib/db/models/Author";
import Tag from "@/lib/db/models/Tag";
import ArticleForm from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  await connectDB();

  const [categories, authors, tags] = await Promise.all([
    Category.find({}).sort({ position: 1 }).lean(),
    Author.find({}).sort({ name: 1 }).lean(),
    Tag.find({}).sort({ name: 1 }).lean(),
  ]);

  return (
    <ArticleForm
      categories={categories.map((c: any) => ({ _id: c._id.toString(), name: c.name }))}
      authors={authors.map((a: any) => ({ _id: a._id.toString(), name: a.name }))}
      tags={tags.map((t: any) => ({ _id: t._id.toString(), name: t.name }))}
    />
  );
}
