import mongoose, { Schema, Model } from "mongoose";
import { IAuthor } from "@/types";

const AuthorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    role: { type: String, default: "Phóng viên / Biên tập viên" },
  },
  { timestamps: true }
);

export const Author: Model<IAuthor> =
  mongoose.models.Author || mongoose.model<IAuthor>("Author", AuthorSchema);

export default Author;
