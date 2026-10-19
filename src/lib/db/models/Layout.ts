import mongoose, { Schema, Model } from "mongoose";
import { ILayout } from "@/types";

const LayoutSchema = new Schema<ILayout>(
  {
    page: { type: String, enum: ["home", "category"], required: true },
    section: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    articleIds: [{ type: Schema.Types.ObjectId, ref: "Article" }],
    maxItems: { type: Number, default: 10 },
  },
  { timestamps: true }
);

// Unique compound index
LayoutSchema.index({ page: 1, section: 1, categoryId: 1 }, { unique: true });

export const Layout: Model<ILayout> =
  mongoose.models.Layout || mongoose.model<ILayout>("Layout", LayoutSchema);

export default Layout;
