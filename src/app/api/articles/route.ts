import { NextRequest, NextResponse } from "next/server";
import { getCategoryArticlesCursor } from "@/lib/cache";
import connectDB from "@/lib/db/mongodb";
import Article from "@/lib/db/models/Article";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const cursorDate = searchParams.get("cursorDate") || undefined;
  const cursorId = searchParams.get("cursorId") || undefined;
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  if (category) {
    const data = await getCategoryArticlesCursor({
      categorySlug: category,
      cursorDate,
      cursorId,
      limit,
    });
    return NextResponse.json(data);
  }

  // General list
  try {
    await connectDB();
    const articles = await Article.find({ status: "published", deletedAt: null })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate("categoryId", "name slug")
      .populate("authorId", "name slug avatarUrl role")
      .lean();

    return NextResponse.json({ articles });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST: Create article (Admin/Editor)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();

    const article = await Article.create({
      ...body,
      status: body.status || "draft",
    });

    return NextResponse.json(article, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
