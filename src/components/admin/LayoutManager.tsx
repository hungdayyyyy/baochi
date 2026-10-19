"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  Plus,
  Eye,
  Check,
  Search,
  X,
  AlertCircle,
} from "lucide-react";
import ArticleCard from "@/components/public/ArticleCard";

interface ArticleItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage: { url: string; alt?: string };
  status: string;
  publishedAt: string;
  viewCount: number;
}

interface SectionOption {
  id: string;
  name: string;
  maxItems: number;
  description: string;
}

const SECTIONS: SectionOption[] = [
  { id: "hero", name: "1. Tiêu điểm đặc biệt (Full-Bleed Hero)", maxItems: 1, description: "Bài viết đinh trang chủ với nền tràn viền và trích đoạn" },
  { id: "trending-sidebar", name: "2. Cột Đọc nhiều nhất (Trending Sidebar)", maxItems: 6, description: "Bảng xếp hạng bài viết đọc nhiều bên cạnh Hero" },
  { id: "kinh-doanh-block", name: "3. Khối Kinh doanh (Lead trái + 4 thẻ 2x2)", maxItems: 5, description: "1 bài lớn bên trái và 4 bài lưới 2x2 bên phải" },
  { id: "startup-strip", name: "4. Dải Start-up (5 bài trượt ngang)", maxItems: 5, description: "Dải 5 bài khởi nghiệp xếp hàng ngang kèm nút mũi tên" },
  { id: "doanh-nghiep-block", name: "5. Khối Doanh nghiệp (4 thẻ 2x2 + Lead phải)", maxItems: 5, description: "4 bài lưới 2x2 bên trái và 1 bài lớn bên phải" },
  { id: "cong-nghe-block", name: "6. Khối Công nghệ (Lead trái + 4 thẻ 2x2)", maxItems: 5, description: "1 bài lớn bên trái và 4 bài lưới 2x2 bên phải" },
  { id: "loi-song-block", name: "7. Khối Lối sống (Cột trái 7 phần)", maxItems: 4, description: "Khối Lối sống gồm 1 bài đinh và các bài phụ" },
  { id: "goc-nhin-block", name: "8. Khối Góc nhìn (Cột phải 5 phần)", maxItems: 5, description: "Danh sách bài bình luận có ảnh nhỏ và tên tác giả" },
  { id: "events-carousel", name: "9. Sự kiện Forbes (Events Section)", maxItems: 6, description: "Các sự kiện và hội nghị sắp diễn ra" },
];

function SortableItem({
  article,
  onRemove,
}: {
  article: ArticleItem;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: article._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded p-3 flex items-center justify-between shadow-sm hover:border-gray-300 transition-colors"
    >
      <div className="flex items-center space-x-3 min-w-0">
        <button
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing p-1"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="relative w-16 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={article.coverImage.url}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="min-w-0">
          <h4 className="text-xs font-bold text-gray-900 truncate">
            {article.title}
          </h4>
          <p className="text-[11px] text-gray-500">
            {new Date(article.publishedAt).toLocaleDateString("vi-VN")} • {article.viewCount.toLocaleString()} lượt xem
          </p>
        </div>
      </div>

      <button
        onClick={() => onRemove(article._id)}
        className="text-gray-400 hover:text-red-600 p-1.5 rounded transition-colors ml-2"
        title="Gỡ khỏi phần này"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function LayoutManager() {
  const [selectedSection, setSelectedSection] = useState<string>("hero");
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Article Picker Modal
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [availableArticles, setAvailableArticles] = useState<ArticleItem[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);

  const currentSectionMeta = SECTIONS.find((s) => s.id === selectedSection)!;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch articles for selected section
  useEffect(() => {
    async function loadLayout() {
      setLoading(true);
      try {
        const res = await fetch(`/api/layouts?page=home&section=${selectedSection}`);
        const data = await res.json();
        if (data.layouts && data.layouts.length > 0) {
          setArticles(data.layouts[0].articleIds || []);
        } else {
          setArticles([]);
        }
      } catch (e) {
        console.error("Failed to load layout:", e);
      } finally {
        setLoading(false);
      }
    }
    loadLayout();
  }, [selectedSection]);

  // Handle Drag Reorder
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setArticles((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemove = (id: string) => {
    setArticles((prev) => prev.filter((a) => a._id !== id));
  };

  // Open Article Picker and fetch published articles
  const openPicker = async () => {
    setPickerOpen(true);
    setPickerLoading(true);
    try {
      const res = await fetch(`/api/articles?limit=40`);
      const data = await res.json();
      setAvailableArticles(data.articles || []);
    } catch (e) {
      console.error(e);
    } finally {
      setPickerLoading(false);
    }
  };

  const handleAddArticle = (art: ArticleItem) => {
    if (articles.some((a) => a._id === art._id)) return;
    if (articles.length >= currentSectionMeta.maxItems) {
      alert(`Mục này chỉ chứa tối đa ${currentSectionMeta.maxItems} bài viết.`);
      return;
    }
    setArticles((prev) => [...prev, art]);
    setPickerOpen(false);
  };

  // Save Layout Atomically
  const handlePublishLayout = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/layouts`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: "home",
          section: selectedSection,
          articleIds: articles.map((a) => a._id),
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Lưu bố cục thất bại. Vui lòng thử lại.");
      }
    } catch (e) {
      console.error(e);
      alert("Đã xảy ra lỗi khi lưu bố cục.");
    } finally {
      setSaving(false);
    }
  };

  const filteredPickerArticles = availableArticles.filter((art) =>
    art.title.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Quản lý Bố cục Trang chủ (Layout Manager)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kéo thả để sắp xếp thứ tự hiển thị bài viết trực quan trên từng vị trí của Forbes.vn
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Xem trước</span>
          </button>
          <button
            onClick={handlePublishLayout}
            disabled={saving}
            className="inline-flex items-center space-x-1.5 bg-[#d8361e] hover:bg-[#b82d18] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded transition-colors disabled:opacity-50 shadow-sm"
          >
            {saving ? (
              <span>Đang lưu...</span>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã xuất bản!</span>
              </>
            ) : (
              <span>Xuất bản Bố cục</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace: Section Selector + Drag & Drop Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sections sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-1">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2 mb-2">
            Chọn vị trí hiển thị (Section)
          </h3>
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`w-full text-left p-3 rounded text-xs transition-colors ${
                selectedSection === sec.id
                  ? "bg-[#111111] text-white font-bold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="font-semibold">{sec.name}</div>
              <div className="text-[11px] opacity-70 truncate mt-0.5">
                {sec.description} (tối đa {sec.maxItems} bài)
              </div>
            </button>
          ))}
        </div>

        {/* Section Ordering Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">
                {currentSectionMeta.name}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Đang hiển thị {articles.length} / {currentSectionMeta.maxItems} bài viết
              </p>
            </div>

            <button
              onClick={openPicker}
              className="inline-flex items-center space-x-1.5 bg-[#111111] hover:bg-gray-900 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm / Đổi bài viết</span>
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400">
              Đang tải danh sách bài viết trong mục...
            </div>
          ) : articles.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-lg">
              <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Mục này chưa có bài viết nào</p>
              <p className="text-xs text-gray-400 mt-1">Bấm nút "Thêm / Đổi bài viết" để gán bài viết vào vị trí này.</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={articles.map((a) => a._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {articles.map((art) => (
                    <SortableItem
                      key={art._id}
                      article={art}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Article Picker Modal */}
      {pickerOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900">
                  Chọn bài viết gán vào {currentSectionMeta.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Chỉ các bài viết ở trạng thái "Đã xuất bản" mới có thể gán vào bố cục
                </p>
              </div>
              <button
                onClick={() => setPickerOpen(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Tìm kiếm theo tiêu đề bài viết..."
                  className="w-full bg-white border border-gray-300 rounded px-4 py-2 pl-10 text-xs focus:outline-none focus:border-[#d8361e]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {pickerLoading ? (
                <div className="py-12 text-center text-xs text-gray-400">Đang tải danh sách bài viết...</div>
              ) : filteredPickerArticles.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">Không tìm thấy bài viết nào phù hợp</div>
              ) : (
                filteredPickerArticles.map((art) => {
                  const isSelected = articles.some((a) => a._id === art._id);
                  return (
                    <div
                      key={art._id}
                      className="p-3 border border-gray-100 rounded hover:bg-gray-50 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="relative w-14 h-9 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={art.coverImage.url}
                            alt={art.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-gray-900 truncate">{art.title}</h5>
                          <span className="text-[10px] text-gray-400">
                            {new Date(art.publishedAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddArticle(art)}
                        disabled={isSelected}
                        className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                          isSelected
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-[#111111] hover:bg-[#d8361e] text-white"
                        }`}
                      >
                        {isSelected ? "Đã gán" : "Chọn bài này"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <span className="font-serif font-bold text-sm text-gray-800">
                Xem trước giao diện: {currentSectionMeta.name}
              </span>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((art) => (
                  <ArticleCard key={art._id} article={art as any} variant="vertical" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
