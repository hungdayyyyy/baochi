import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import connectDB from "@/lib/db/mongodb";
import Article from "@/lib/db/models/Article";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret") || (authHeader ? authHeader.replace("Bearer ", "") : "");

  const expectedSecret = process.env.CRON_SECRET || "forbes_cron_scheduled_publish_secret_key_2026";
  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const now = new Date();

    const result = await Article.updateMany(
      {
        status: "scheduled",
        publishedAt: { $lte: now },
      },
      {
        $set: { status: "published" },
      }
    );

    if (result.modifiedCount > 0) {
      revalidateTag("articles");
      revalidateTag("layouts");
      revalidatePath("/");
    }

    return NextResponse.json({
      success: true,
      publishedCount: result.modifiedCount,
      timestamp: now.toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
