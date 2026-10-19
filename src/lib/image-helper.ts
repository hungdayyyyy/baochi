export function getProxiedImageUrl(url?: string | null): string {
  if (!url) return "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600";
  if (url.startsWith("/assets/") || url.startsWith("/uploads/") || url.startsWith("data:")) {
    return url;
  }
  if (url.includes("forbes.vn")) {
    return `/api/img?url=${encodeURIComponent(url)}`;
  }
  return url;
}
