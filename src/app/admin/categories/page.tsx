import Link from "next/link";
import connectDB from "@/lib/db/mongodb";
import Category from "@/lib/db/models/Category";
import Article from "@/lib/db/models/Article";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await connectDB();

  const categories = await Category.find({})
    .sort({ position: 1, name: 1 })
    .populate("parentId", "name")
    .lean();

  const articleCounts = await Article.aggregate([
    { $match: { deletedAt: null } },
    { $group: { _id: "$categoryId", count: { $sum: 1 } } },
  ]);

  const countMap = new Map(articleCounts.map((c) => [c._id.toString(), c.count]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Quản lý Chuyên mục
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Cấu trúc danh mục tin tức, menu điều hướng và thứ tự ưu tiên
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-3.5">Thứ tự</th>
              <th className="px-6 py-3.5">Tên chuyên mục</th>
              <th className="px-6 py-3.5">Đường dẫn (Slug)</th>
              <th className="px-6 py-3.5">Chuyên mục cha</th>
              <th className="px-6 py-3.5">Hiển thị Menu</th>
              <th className="px-6 py-3.5">Số bài viết</th>
              <th className="px-6 py-3.5 text-right">Xem trên web</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat: any) => (
              <tr key={cat._id.toString()} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 font-mono text-gray-400">
                  {cat.position}
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  {cat.name}
                </td>
                <td className="px-6 py-4 font-mono text-gray-500">
                  {cat.slug}
                </td>
                <td className="px-6 py-4">
                  {cat.parentId ? (
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">
                      {cat.parentId.name}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${cat.showInMenu ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {cat.showInMenu ? "Hiển thị" : "Ẩn"}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {countMap.get(cat._id.toString()) || 0} bài
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/category/${cat.slug}`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Xem →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
