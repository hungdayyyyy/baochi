import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidateTag, revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import Layout from "@/lib/db/models/Layout";
import Article from "@/lib/db/models/Article";

// GET layout by page & section
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "home";
  const section = searchParams.get("section");
  const categoryId = searchParams.get("categoryId") || null;

  try {
    await connectDB();
    const query: any = { page };
    if (section) query.section = section;
    if (categoryId) query.categoryId = categoryId;

    const layouts = await Layout.find(query)
      .populate({
        path: "articleIds",
        select: "title slug excerpt coverImage status publishedAt viewCount",
      })
      .lean();

    return NextResponse.json({ layouts });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT: Atomically update layout articles
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { page, section, categoryId, articleIds } = await req.json();

    if (!page || !section || !Array.isArray(articleIds)) {
      return NextResponse.json({ error: "Invalid layout payload" }, { status: 400 });
    }

    // Verify: No duplicate IDs
    const uniqueIds = Array.from(new Set(articleIds.map((id: string) => id.toString())));

    // Verify: Only published articles allowed
    const validArticles = await Article.find({
      _id: { $in: uniqueIds },
      status: "published",
      deletedAt: null,
    }).select("_id");

    const validIdSet = new Set(validArticles.map((a) => a._id.toString()));
    const finalIds = uniqueIds.filter((id) => validIdSet.has(id));

    const query: any = { page, section };
    if (categoryId) query.categoryId = categoryId;

    const layout = await Layout.findOneAndUpdate(
      query,
      {
        $set: { articleIds: finalIds },
      },
      { upsert: true, new: true }
    );

    // Trigger revalidation
    revalidateTag("layouts");
    revalidateTag("articles");
    revalidatePath("/");
    if (page === "category" && categoryId) {
      revalidatePath(`/category`);
    }

    return NextResponse.json({ success: true, layout });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
