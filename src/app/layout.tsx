import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forbes Việt Nam - Tôn vinh tinh thần doanh chủ",
  description: "Bản tin và phân tích chuyên sâu về kinh doanh, tài chính, công nghệ, lãnh đạo và các cơ hội đầu tư tại Việt Nam từ Forbes.",
  keywords: ["Forbes", "Forbes Việt Nam", "Kinh doanh", "Tài chính", "Tỷ phú", "Doanh nhân", "Đầu tư"],
  openGraph: {
    title: "Forbes Việt Nam - Tôn vinh tinh thần doanh chủ",
    description: "Tạp chí kinh doanh hàng đầu tôn vinh tinh thần doanh chủ và đổi mới sáng tạo.",
    siteName: "Forbes Việt Nam",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col font-sans bg-white text-[#222222]">
        {children}
      </body>
    </html>
  );
}
