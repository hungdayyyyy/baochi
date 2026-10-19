import connectDB from "@/lib/db/mongodb";
import Tag from "@/lib/db/models/Tag";
import Article from "@/lib/db/models/Article";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  await connectDB();

  const tags = await Tag.find({}).sort({ name: 1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Quản lý Thẻ Từ khoá (Tags)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Tổng cộng: {tags.length} từ khoá chủ đề
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {tags.map((tag: any) => (
            <div
              key={tag._id.toString()}
              className="bg-gray-50 border border-gray-200 rounded px-4 py-2 flex items-center space-x-2 text-xs"
            >
              <span className="font-semibold text-gray-800">#{tag.name}</span>
              <span className="text-[10px] text-gray-400 font-mono">({tag.slug})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
