import mongoose, { Schema, Model } from "mongoose";
import { ICategory } from "@/types";

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    position: { type: Number, default: 0 },
    showInMenu: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
