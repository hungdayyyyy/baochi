import { notFound } from "next/navigation";
import connectDB from "@/lib/db/mongodb";
import Article from "@/lib/db/models/Article";
import Category from "@/lib/db/models/Category";
import Author from "@/lib/db/models/Author";
import Tag from "@/lib/db/models/Tag";
import ArticleForm from "@/components/admin/ArticleForm";

interface EditArticlePageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  await connectDB();

  const [article, categories, authors, tags] = await Promise.all([
    Article.findById(params.id).lean(),
    Category.find({}).sort({ position: 1 }).lean(),
    Author.find({}).sort({ name: 1 }).lean(),
    Tag.find({}).sort({ name: 1 }).lean(),
  ]);

  if (!article) {
    notFound();
  }

  const serializedArticle = {
    ...article,
    _id: (article as any)._id.toString(),
    categoryId: (article as any).categoryId ? (article as any).categoryId.toString() : "",
    authorId: (article as any).authorId ? (article as any).authorId.toString() : "",
    tagIds: ((article as any).tagIds || []).map((t: any) => t.toString()),
  };

  return (
    <ArticleForm
      initialData={serializedArticle}
      categories={categories.map((c: any) => ({ _id: c._id.toString(), name: c.name }))}
      authors={authors.map((a: any) => ({ _id: a._id.toString(), name: a.name }))}
      tags={tags.map((t: any) => ({ _id: t._id.toString(), name: t.name }))}
    />
  );
}
