import connectDB from "@/lib/db/mongodb";
import Author from "@/lib/db/models/Author";
import Article from "@/lib/db/models/Article";

export const dynamic = "force-dynamic";

export default async function AdminAuthorsPage() {
  await connectDB();

  const authors = await Author.find({}).sort({ name: 1 }).lean();
  const counts = await Article.aggregate([
    { $match: { deletedAt: null } },
    { $group: { _id: "$authorId", count: { $sum: 1 } } },
  ]);

  const countMap = new Map(counts.map((c) => [c._id ? c._id.toString() : "", c.count]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Quản lý Tác giả & Ban biên tập
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Danh sách phóng viên, biên tập viên và chuyên gia phân tích của Forbes Việt Nam
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-3.5">Họ và tên</th>
              <th className="px-6 py-3.5">Vai trò / Chức danh</th>
              <th className="px-6 py-3.5">Tiểu sử tóm tắt</th>
              <th className="px-6 py-3.5 text-right">Tổng số bài viết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {authors.map((author: any) => (
              <tr key={author._id.toString()} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    {author.name.charAt(0)}
                  </div>
                  <span>{author.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-700 font-medium">
                  {author.role}
                </td>
                <td className="px-6 py-4 text-gray-500 max-w-md truncate">
                  {author.bio || "—"}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900">
                  {countMap.get(author._id.toString()) || 0} bài
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
