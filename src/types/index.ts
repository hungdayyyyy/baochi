import { Types } from "mongoose";

export type ArticleStatus = "draft" | "published" | "scheduled";
export type UserRole = "admin" | "editor";

export interface ICoverImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ISEO {
  title?: string;
  description?: string;
}

export interface IArticle {
  _id: string | Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: {
    html: string;
    json: any;
  };
  coverImage: ICoverImage;
  categoryId: string | Types.ObjectId;
  authorId?: string | Types.ObjectId;
  tagIds: (string | Types.ObjectId)[];
  status: ArticleStatus;
  publishedAt: Date;
  isFeatured: boolean;
  viewCount: number;
  seo?: ISEO;
  deletedAt?: Date | null;
  searchText?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  _id: string | Types.ObjectId;
  name: string;
  slug: string;
  parentId?: string | Types.ObjectId | null;
  position: number;
  showInMenu: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthor {
  _id: string | Types.ObjectId;
  name: string;
  slug: string;
  bio?: string;
  avatarUrl?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITag {
  _id: string | Types.ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  _id: string | Types.ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILayout {
  _id: string | Types.ObjectId;
  page: "home" | "category";
  section: string;
  categoryId?: string | Types.ObjectId | null;
  articleIds: (string | Types.ObjectId)[];
  maxItems: number;
  createdAt: Date;
  updatedAt: Date;
}

// Populated Article for UI presentation
export interface PopulatedArticle extends Omit<IArticle, "categoryId" | "authorId" | "tagIds"> {
  _id: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  } | null;
  author?: {
    _id: string;
    name: string;
    slug: string;
    avatarUrl?: string;
    role?: string;
  } | null;
  tags?: {
    _id: string;
    name: string;
    slug: string;
  }[];
}
