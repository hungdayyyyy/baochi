import Link from "next/link";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import connectDB from "@/lib/db/mongodb";
import Article from "@/lib/db/models/Article";
import Category from "@/lib/db/models/Category";
import Author from "@/lib/db/models/Author";

interface ArticlesPageProps {
  searchParams: {
    q?: string;
    status?: string;
    category?: string;
    page?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage({ searchParams }: ArticlesPageProps) {
  await connectDB();

  const query: any = { deletedAt: null };
  if (searchParams.q) {
    query.title = { $regex: searchParams.q, $options: "i" };
  }
  if (searchParams.status && searchParams.status !== "all") {
    query.status = searchParams.status;
  }
  if (searchParams.category && searchParams.category !== "all") {
    query.categoryId = searchParams.category;
  }

  const currentPage = parseInt(searchParams.page || "1", 10);
  const pageSize = 15;

  const [articles, totalCount, categories, authors] = await Promise.all([
    Article.find(query)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .populate("categoryId", "name slug")
      .populate("authorId", "name")
      .lean(),
    Article.countDocuments(query),
    Category.find({}).sort({ position: 1 }).lean(),
    Author.find({}).sort({ name: 1 }).lean(),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Quản lý Bài viết
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Tổng số: {totalCount} bài viết trong cơ sở dữ liệu
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center space-x-2 bg-[#d8361e] hover:bg-[#b82d18] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo bài viết mới</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <form className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px]">
            <input
              type="text"
              name="q"
              defaultValue={searchParams.q || ""}
              placeholder="Tìm theo tiêu đề..."
              className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-1.5 pl-9 text-xs focus:outline-none focus:border-[#d8361e]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <select
            name="status"
            defaultValue={searchParams.status || "all"}
            className="bg-gray-50 border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
            <option value="scheduled">Lên lịch</option>
          </select>

          <select
            name="category"
            defaultValue={searchParams.category || "all"}
            className="bg-gray-50 border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="all">Tất cả chuyên mục</option>
            {categories.map((c: any) => (
              <option key={c._id.toString()} value={c._id.toString()}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-[#111111] hover:bg-black text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors"
          >
            Lọc
          </button>
        </form>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">Tiêu đề bài viết</th>
                <th className="px-6 py-3.5">Chuyên mục</th>
                <th className="px-6 py-3.5">Tác giả</th>
                <th className="px-6 py-3.5">Trạng thái</th>
                <th className="px-6 py-3.5">Lượt xem</th>
                <th className="px-6 py-3.5">Ngày đăng</th>
                <th className="px-6 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((art: any) => (
                <tr key={art._id.toString()} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 max-w-sm">
                    <Link
                      href={`/admin/articles/${art._id.toString()}`}
                      className="hover:text-[#d8361e] line-clamp-2"
                    >
                      {art.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[11px] font-medium">
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
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(art.publishedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                    <Link
                      href={`/${art.slug}`}
                      target="_blank"
                      className="inline-block p-1 text-gray-400 hover:text-gray-700"
                      title="Xem bài trên web"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/articles/${art._id.toString()}`}
                      className="inline-block p-1 text-blue-600 hover:text-blue-800"
                      title="Chỉnh sửa bài viết"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <div className="flex space-x-2">
              {currentPage > 1 && (
                <Link
                  href={`/admin/articles?page=${currentPage - 1}`}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Trước
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`/admin/articles?page=${currentPage + 1}`}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Sau
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
