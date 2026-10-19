import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Article from "@/lib/db/models/Article";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    await connectDB();
    await Article.updateOne({ slug }, { $inc: { viewCount: 1 } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
