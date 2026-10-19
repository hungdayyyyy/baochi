import { NextRequest, NextResponse } from "next/server";

const imageCache = new Map<string, { buffer: ArrayBuffer; contentType: string }>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Check in-memory cache
  if (imageCache.has(targetUrl)) {
    const cached = imageCache.get(targetUrl)!;
    return new NextResponse(cached.buffer, {
      status: 200,
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      return new NextResponse(`Failed to fetch image: ${res.status}`, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();

    // Cache in memory (up to 200 images)
    if (imageCache.size > 200) {
      const firstKey = imageCache.keys().next().value;
      if (firstKey) imageCache.delete(firstKey);
    }
    imageCache.set(targetUrl, { buffer: arrayBuffer, contentType });

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    console.error("Image proxy error:", err.message);
    return new NextResponse(`Error proxying image: ${err.message}`, { status: 500 });
  }
}
