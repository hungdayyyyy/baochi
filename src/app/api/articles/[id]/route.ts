import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidateTag, revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import Article from "@/lib/db/models/Article";

// GET single article by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const article = await Article.findById(params.id)
      .populate("categoryId", "name slug")
      .populate("authorId", "name slug")
      .populate("tagIds", "name slug")
      .lean();

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT: Update article
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();

    const updated = await Article.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    revalidateTag("articles");
    revalidateTag("layouts");
    revalidatePath("/");
    revalidatePath(`/${updated.slug}`);

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE: Soft delete article
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const updated = await Article.findByIdAndUpdate(
      params.id,
      { $set: { deletedAt: new Date(), status: "draft" } },
      { new: true }
    );

    revalidateTag("articles");
    revalidateTag("layouts");
    revalidatePath("/");

    return NextResponse.json({ success: true, article: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
