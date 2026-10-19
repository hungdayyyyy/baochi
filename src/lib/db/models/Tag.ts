import mongoose, { Schema, Model } from "mongoose";
import { ITag } from "@/types";

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export const Tag: Model<ITag> =
  mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema);

export default Tag;
