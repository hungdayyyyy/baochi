import Link from "next/link";
import { FileText, CheckCircle2, Clock, Eye, PlusCircle, ArrowUpRight } from "lucide-react";
import connectDB from "@/lib/db/mongodb";
import Article from "@/lib/db/models/Article";
import Category from "@/lib/db/models/Category";
import User from "@/lib/db/models/User";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await connectDB();

  const [
    totalArticles,
    publishedCount,
    draftCount,
    scheduledCount,
    totalCategories,
    recentArticles,
  ] = await Promise.all([
    Article.countDocuments({ deletedAt: null }),
    Article.countDocuments({ status: "published", deletedAt: null }),
    Article.countDocuments({ status: "draft", deletedAt: null }),
    Article.countDocuments({ status: "scheduled", deletedAt: null }),
    Category.countDocuments(),
    Article.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("categoryId", "name slug")
      .populate("authorId", "name")
      .lean(),
  ]);

  const stats = [
    { label: "Tổng bài viết", value: totalArticles, icon: FileText, color: "text-blue-600 bg-blue-50" },
    { label: "Đã xuất bản", value: publishedCount, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { label: "Bản nháp", value: draftCount, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Lên lịch đăng", value: scheduledCount, icon: Clock, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">
            Bảng điều khiển Toà soạn
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Tổng hợp dữ liệu bài viết, hiệu suất đọc và bố cục trang Forbes Việt Nam
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center space-x-2 bg-[#d8361e] hover:bg-[#b82d18] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Viết bài mới</span>
          </Link>
          <Link
            href="/admin/layouts"
            className="inline-flex items-center space-x-2 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded transition-colors shadow-sm"
          >
            <span>Quản lý Bố cục</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-3xl font-black font-serif text-gray-900 mt-2">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Articles Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-gray-900">
            Bài viết mới cập nhật
          </h3>
          <Link
            href="/admin/articles"
            className="text-xs font-semibold text-[#d8361e] hover:underline flex items-center space-x-1"
          >
            <span>Xem tất cả bài viết</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">Tiêu đề bài viết</th>
                <th className="px-6 py-3.5">Chuyên mục</th>
                <th className="px-6 py-3.5">Tác giả</th>
                <th className="px-6 py-3.5">Trạng thái</th>
                <th className="px-6 py-3.5">Lượt xem</th>
                <th className="px-6 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentArticles.map((art: any) => (
                <tr key={art._id.toString()} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-md">
                    <Link href={`/admin/articles/${art._id.toString()}`} className="hover:text-[#d8361e] line-clamp-1">
                      {art.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[11px] font-semibold">
                      {art.categoryId?.name || "Chưa phân loại"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {art.authorId?.name || "Toà soạn"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        art.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : art.status === "scheduled"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {art.status === "published"
                        ? "Đã xuất bản"
                        : art.status === "scheduled"
                        ? "Lên lịch"
                        : "Bản nháp"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {art.viewCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/articles/${art._id.toString()}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
