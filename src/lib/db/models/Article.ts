import mongoose, { Schema, Model } from "mongoose";
import { IArticle } from "@/types";
import { normalizeSearchText } from "@/lib/vietnamese";
import "./Category";
import "./Author";
import "./Tag";

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: "" },
    content: {
      html: { type: String, default: "" },
      json: { type: Schema.Types.Mixed, default: {} },
    },
    coverImage: {
      url: { type: String, required: true },
      alt: { type: String, default: "" },
      width: { type: Number, default: 1200 },
      height: { type: Number, default: 675 },
    },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: "Author", default: null, index: true },
    tagIds: [{ type: Schema.Types.ObjectId, ref: "Tag", index: true }],
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date, default: Date.now, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    viewCount: { type: Number, default: 0 },
    seo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    },
    deletedAt: { type: Date, default: null, index: true },
    searchText: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto-fill searchText for diacritic-insensitive search
ArticleSchema.pre("save", function (next) {
  this.searchText = normalizeSearchText(`${this.title} ${this.excerpt}`);
  next();
});

// Compound indexes
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ categoryId: 1, publishedAt: -1 });
ArticleSchema.index({ status: 1, isFeatured: -1, publishedAt: -1 });

// Full text search index
ArticleSchema.index({ title: "text", excerpt: "text", searchText: "text" });

export const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>("Article", ArticleSchema);

export default Article;
