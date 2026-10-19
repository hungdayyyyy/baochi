"use client";

import { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Undo,
  Redo,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Maximize2,
  X,
  Loader2,
} from "lucide-react";

interface TiptapProps {
  content: string;
  onChange: (html: string, json: any) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageAlignment, setImageAlignment] = useState<"center" | "left" | "right" | "full">("center");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#004b87] underline hover:text-[#d8361e]",
        },
      }),
      ImageExtension.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-4 shadow-sm",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[350px] p-4 text-sm font-serif leading-relaxed text-gray-800 focus:outline-none prose max-w-none",
      },
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Nhập đường dẫn URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setImageUrl(data.url);
      } else {
        alert(data.error || "Tải ảnh thất bại.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Lỗi tải ảnh lên MinIO/Storage.");
    } finally {
      setUploading(false);
    }
  };

  const insertCustomImage = () => {
    if (!imageUrl.trim()) return;

    let alignmentClass = "block mx-auto my-6 text-center max-w-full";
    let imgClass = "rounded-lg shadow-sm mx-auto";

    if (imageAlignment === "left") {
      alignmentClass = "float-left mr-6 mb-4 max-w-[50%]";
      imgClass = "rounded-lg shadow-sm w-full";
    } else if (imageAlignment === "right") {
      alignmentClass = "float-right ml-6 mb-4 max-w-[50%]";
      imgClass = "rounded-lg shadow-sm w-full";
    } else if (imageAlignment === "full") {
      alignmentClass = "w-full my-6 text-center";
      imgClass = "w-full rounded-lg shadow-sm";
    }

    const captionHtml = imageCaption.trim()
      ? `<figcaption class="text-xs text-gray-500 italic mt-2 text-center">${imageCaption}</figcaption>`
      : "";

    const figureHtml = `
      <figure class="${alignmentClass}">
        <img src="${imageUrl}" alt="${imageCaption || 'Ảnh bài báo'}" class="${imgClass}" />
        ${captionHtml}
      </figure>
      <p></p>
    `;

    editor.chain().focus().insertContent(figureHtml).run();

    setIsImageModalOpen(false);
    setImageUrl("");
    setImageCaption("");
    setImageAlignment("center");
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm focus-within:border-[#d8361e] transition-colors relative">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded text-xs ${
            editor.isActive("bold") ? "bg-gray-200 text-black font-bold" : "text-gray-600 hover:bg-gray-100"
          }`}
          title="In đậm"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded text-xs ${
            editor.isActive("italic") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-100"
          }`}
          title="In nghiêng"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded text-xs ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-black font-bold" : "text-gray-600 hover:bg-gray-100"
          }`}
          title="Tiêu đề H2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded text-xs ${
            editor.isActive("heading", { level: 3 }) ? "bg-gray-200 text-black font-bold" : "text-gray-600 hover:bg-gray-100"
          }`}
          title="Tiêu đề H3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded text-xs ${
            editor.isActive("bulletList") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-100"
          }`}
          title="Danh sách gạch đầu dòng"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded text-xs ${
            editor.isActive("orderedList") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-100"
          }`}
          title="Danh sách số"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded text-xs ${
            editor.isActive("blockquote") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-100"
          }`}
          title="Trích dẫn"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded text-xs ${
            editor.isActive("link") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-100"
          }`}
          title="Chèn link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* Enhanced Image Button */}
        <button
          type="button"
          onClick={() => setIsImageModalOpen(true)}
          className="p-1.5 rounded text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium flex items-center space-x-1"
          title="Chèn ảnh & Chỉnh vị trí (MinIO)"
        >
          <ImageIcon className="w-4 h-4 text-[#d8361e]" />
          <span>Thêm ảnh</span>
        </button>

        <div className="w-[1px] h-4 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1.5 rounded text-xs text-gray-600 hover:bg-gray-100"
          title="Hoàn tác"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1.5 rounded text-xs text-gray-600 hover:bg-gray-100"
          title="Làm lại"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editable Area */}
      <EditorContent editor={editor} />

      {/* MODAL: Insert Image & Custom Alignment */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-fadeIn">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-[#d8361e]" />
                <h3 className="font-bold text-gray-900 text-base">Thêm ảnh vào bài viết (MinIO)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* File upload from computer to MinIO */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Tải ảnh từ máy tính (Lưu trữ MinIO)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#d8361e]" />
                        <span>Đang tải lên MinIO...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-gray-600" />
                        <span>Chọn tệp ảnh...</span>
                      </>
                    )}
                  </button>
                  <span className="text-xs text-gray-400">Hỗ trợ JPG, PNG, WEBP</span>
                </div>
              </div>

              {/* Or direct URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Đường dẫn ảnh (URL)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... hoặc /uploads/articles/..."
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#d8361e]"
                />
              </div>

              {/* Image Position / Alignment Customization */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Tùy chỉnh vị trí hiển thị của ảnh
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setImageAlignment("center")}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all ${
                      imageAlignment === "center"
                        ? "border-[#d8361e] bg-red-50 text-[#d8361e]"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <AlignCenter className="w-5 h-5 mb-1.5" />
                    <span>Căn giữa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageAlignment("left")}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all ${
                      imageAlignment === "left"
                        ? "border-[#d8361e] bg-red-50 text-[#d8361e]"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <AlignLeft className="w-5 h-5 mb-1.5" />
                    <span>Bên trái (Float)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageAlignment("right")}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all ${
                      imageAlignment === "right"
                        ? "border-[#d8361e] bg-red-50 text-[#d8361e]"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <AlignRight className="w-5 h-5 mb-1.5" />
                    <span>Bên phải (Float)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageAlignment("full")}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all ${
                      imageAlignment === "full"
                        ? "border-[#d8361e] bg-red-50 text-[#d8361e]"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <Maximize2 className="w-5 h-5 mb-1.5" />
                    <span>Toàn chiều rộng</span>
                  </button>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Chú thích ảnh (Caption)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Ví dụ: Lễ ký kết diễn ra tại TP.HCM (Ảnh: Forbes)"
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#d8361e]"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={!imageUrl.trim()}
                  onClick={insertCustomImage}
                  className="px-5 py-2 bg-[#d8361e] hover:bg-[#b52a15] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm"
                >
                  Chèn vào bài viết
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
