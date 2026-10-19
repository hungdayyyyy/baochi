"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Eye, Save, Trash2, ArrowLeft } from "lucide-react";
import TiptapEditor from "./TiptapEditor";
import { slugifyVietnamese } from "@/lib/vietnamese";

interface CategoryOption {
  _id: string;
  name: string;
}

interface AuthorOption {
  _id: string;
  name: string;
}

interface TagOption {
  _id: string;
  name: string;
}

interface ArticleFormProps {
  initialData?: any;
  categories: CategoryOption[];
  authors: AuthorOption[];
  tags: TagOption[];
}

export default function ArticleForm({
  initialData,
  categories,
  authors,
  tags,
}: ArticleFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [contentHtml, setContentHtml] = useState(initialData?.content?.html || "");
  const [contentJson, setContentJson] = useState(initialData?.content?.json || {});
  const [coverUrl, setCoverUrl] = useState(
    initialData?.coverImage?.url ||
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80"
  );
  const [categoryId, setCategoryId] = useState(initialData?.categoryId?._id || initialData?.categoryId || categories[0]?._id || "");
  const [authorId, setAuthorId] = useState(initialData?.authorId?._id || initialData?.authorId || authors[0]?._id || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    (initialData?.tagIds || []).map((t: any) => (typeof t === "object" ? t._id : t))
  );
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">(initialData?.status || "published");
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seo?.description || "");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Auto-generate Vietnamese slug when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      setSlug(slugifyVietnamese(val));
    }
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setCoverUrl(data.url);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Tải ảnh thất bại.");
    } finally {
      setUploading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      alert("Vui lòng nhập tiêu đề và đường dẫn slug");
      return;
    }

    setSaving(true);
    const payload = {
      title,
      slug,
      excerpt,
      content: {
        html: contentHtml,
        json: contentJson,
      },
      coverImage: {
        url: coverUrl,
        alt: title,
        width: 1200,
        height: 675,
      },
      categoryId,
      authorId: authorId || null,
      tagIds: selectedTags,
      status,
      publishedAt: new Date(publishedAt),
      isFeatured,
      seo: {
        title: seoTitle || title,
        description: seoDescription || excerpt,
      },
    };

    try {
      const isEdit = !!initialData?._id;
      const url = isEdit ? `/api/articles/${initialData._id}` : "/api/articles";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/articles");
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Lưu bài viết thất bại.");
      }
    } catch (e: any) {
      alert("Đã xảy ra lỗi kết nối.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?._id) return;
    if (!confirm("Bạn có chắc chắn muốn xoá bài viết này?")) return;

    try {
      const res = await fetch(`/api/articles/${initialData._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/articles");
        router.refresh();
      }
    } catch (e) {
      alert("Xoá bài viết thất bại.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 text-gray-500 hover:text-black rounded hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              {initialData ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Soạn thảo với Tiptap editor và thiết lập SEO, chuyên mục, ảnh bìa
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {initialData && (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center space-x-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2.5 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xoá</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Xem trước</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-1.5 bg-[#d8361e] hover:bg-[#b82d18] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded transition-colors disabled:opacity-50 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Đang lưu..." : "Lưu bài viết"}</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Editor (8 cols) + Settings (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Main Canvas */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Tiêu đề bài viết *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Nhập tiêu đề theo chuẩn Forbes..."
                className="w-full font-serif text-xl font-bold bg-gray-50 border border-gray-300 rounded p-3 focus:bg-white focus:outline-none focus:border-[#d8361e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Đường dẫn tĩnh (Slug) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full text-xs font-mono bg-gray-50 border border-gray-300 rounded p-2 text-gray-600 focus:outline-none focus:border-[#d8361e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Đoạn trích tóm tắt (Excerpt / Sapo)
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Tóm tắt nội dung chính trong 2-3 câu..."
                className="w-full font-serif text-sm bg-gray-50 border border-gray-300 rounded p-3 text-gray-800 focus:outline-none focus:border-[#d8361e]"
              />
            </div>
          </div>

          {/* Tiptap Rich Text Editor */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Nội dung chi tiết bài viết (Tiptap Rich Text)
            </label>
            <TiptapEditor
              content={contentHtml}
              onChange={(html, json) => {
                setContentHtml(html);
                setContentJson(json);
              }}
            />
          </div>
        </div>

        {/* Sidebar Settings Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing & Status */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              Xuất bản & Trạng thái
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Trạng thái
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs font-semibold focus:outline-none"
              >
                <option value="published">Đã xuất bản (Published)</option>
                <option value="draft">Bản nháp (Draft)</option>
                <option value="scheduled">Lên lịch đăng (Scheduled)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Thời gian xuất bản
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-[#d8361e] focus:ring-[#d8361e]"
              />
              <label htmlFor="isFeatured" className="text-xs font-semibold text-gray-700 cursor-pointer">
                Đánh dấu bài viết nổi bật (Featured)
              </label>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-serif text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              Ảnh bìa bài viết
            </h3>

            {coverUrl && (
              <div className="relative aspect-[16/9] w-full rounded overflow-hidden bg-gray-100 border border-gray-200">
                <Image src={coverUrl} alt="Cover Preview" fill className="object-cover" />
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-500 mb-1">Đường dẫn ảnh:</label>
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs bg-gray-50 border border-gray-300 rounded p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Hoặc tải ảnh lên MinIO:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {uploading && <p className="text-[11px] text-blue-600 mt-1">Đang tải lên lưu trữ MinIO...</p>}
            </div>
          </div>

          {/* Category & Author */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              Phân loại & Tác giả
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Chuyên mục *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Tác giả
              </label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs focus:outline-none"
              >
                {authors.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Thẻ Tags liên quan
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                {tags.map((t) => {
                  const isChecked = selectedTags.includes(t._id);
                  return (
                    <button
                      type="button"
                      key={t._id}
                      onClick={() => handleTagToggle(t._id)}
                      className={`text-[11px] px-2.5 py-1 rounded transition-colors ${
                        isChecked
                          ? "bg-[#d8361e] text-white font-semibold"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
