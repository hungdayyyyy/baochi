"use client";

import { useEffect } from "react";

export default function ViewCountTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Non-blocking asynchronous view count increment
    fetch(`/api/articles/view?slug=${encodeURIComponent(slug)}`, {
      method: "POST",
    }).catch(() => {
      // Ignore background analytics errors
    });
  }, [slug]);

  return null;
}
