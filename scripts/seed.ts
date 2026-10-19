import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// MongoDB URI
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/forbes_vn";

// Schemas
const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    position: { type: Number, default: 0 },
    showInMenu: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AuthorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    role: { type: String, default: "Phóng viên" },
  },
  { timestamps: true }
);

const TagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor"], default: "editor" },
  },
  { timestamps: true }
);

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: {
      html: { type: String, default: "" },
      json: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    coverImage: {
      url: { type: String, required: true },
      alt: { type: String, default: "" },
      width: { type: Number, default: 1200 },
      height: { type: Number, default: 675 },
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Author", default: null },
    tagIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    status: { type: String, enum: ["draft", "published", "scheduled"], default: "published" },
    publishedAt: { type: Date, default: Date.now },
    isFeatured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    seo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    },
    deletedAt: { type: Date, default: null },
    searchText: { type: String, default: "" },
  },
  { timestamps: true }
);

const LayoutSchema = new mongoose.Schema(
  {
    page: { type: String, enum: ["home", "category"], required: true },
    section: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    articleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    maxItems: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export async function seed() {
  console.log("Connecting to MongoDB at:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
  const Author = mongoose.models.Author || mongoose.model("Author", AuthorSchema);
  const Tag = mongoose.models.Tag || mongoose.model("Tag", TagSchema);
  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Article = mongoose.models.Article || mongoose.model("Article", ArticleSchema);
  const Layout = mongoose.models.Layout || mongoose.model("Layout", LayoutSchema);

  // Read seed data from scripts/seed-data.json
  const seedDataPath = path.join(__dirname, "seed-data.json");
  if (!fs.existsSync(seedDataPath)) {
    throw new Error(`Seed data file not found at ${seedDataPath}`);
  }
  const rawData = fs.readFileSync(seedDataPath, "utf-8");
  const seedData = JSON.parse(rawData);

  console.log(`Loaded seed data with ${seedData.articles.length} articles and ${seedData.categories.length} categories.`);

  // 1. Seed Users (Admin & Editor)
  console.log("1. Seeding Users...");
  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123456", 10);
  const editorHash = await bcrypt.hash("Editor@123456", 10);

  await User.updateOne(
    { email: "admin@forbes.vn" },
    {
      $set: {
        name: "Tổng biên tập Forbes",
        passwordHash: adminHash,
        role: "admin",
      },
    },
    { upsert: true }
  );

  await User.updateOne(
    { email: "editor@forbes.vn" },
    {
      $set: {
        name: "Ban Thư ký Toà soạn",
        passwordHash: editorHash,
        role: "editor",
      },
    },
    { upsert: true }
  );
  console.log("Users seeded: admin@forbes.vn, editor@forbes.vn");

  // 2. Seed Authors
  console.log("2. Seeding Authors...");
  const authorMap = new Map<string, any>();
  const defaultAuthors = [
    { name: "Forbes Việt Nam", slug: "forbes-viet-nam", bio: "Ban biên tập toà soạn Forbes Việt Nam", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", role: "Ban Biên Tập" },
    { name: "Kiều Giang", slug: "kieu-giang", bio: "Phóng viên chuyên trách Forbes", avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150", role: "Phóng viên" },
    { name: "Matt Craig", slug: "matt-craig", bio: "Forbes Staff Contributor", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", role: "Staff Contributor" },
    { name: "Gloria Haraito", slug: "gloria-haraito", bio: "Chuyên gia phân tích thị trường Forbes", avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150", role: "Biên tập viên cao cấp" },
    { name: "Chengbo Liu", slug: "chengbo-liu", bio: "Phóng viên kinh tế Châu Á", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", role: "Phóng viên thường trú" },
    { name: "Steve Forbes", slug: "steve-forbes", bio: "Chủ tịch kiêm Tổng biên tập Forbes Media", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", role: "Chủ tịch Forbes Media" },
  ];

  for (const a of defaultAuthors) {
    const doc = await Author.findOneAndUpdate(
      { slug: a.slug },
      { $set: a },
      { upsert: true, new: true }
    );
    authorMap.set(a.slug, doc._id);
    authorMap.set(a.name, doc._id);
  }

  // 3. Seed Categories (Parents first, then children)
  console.log("3. Seeding Categories...");
  const categoryMap = new Map<string, any>(); // maps original _id or slug -> new Mongo ObjectId
  const parents = seedData.categories.filter((c: any) => !c.parentId);
  const children = seedData.categories.filter((c: any) => c.parentId);

  for (const c of parents) {
    const doc = await Category.findOneAndUpdate(
      { slug: c.slug },
      {
        $set: {
          name: c.name,
          slug: c.slug,
          position: c.position || 0,
          showInMenu: c.showInMenu !== false,
          parentId: null,
        },
      },
      { upsert: true, new: true }
    );
    categoryMap.set(c._id, doc._id);
    categoryMap.set(c.slug, doc._id);
  }

  for (const c of children) {
    const parentDbId = categoryMap.get(c.parentId) || null;
    const doc = await Category.findOneAndUpdate(
      { slug: c.slug },
      {
        $set: {
          name: c.name,
          slug: c.slug,
          position: c.position || 0,
          showInMenu: c.showInMenu !== false,
          parentId: parentDbId,
        },
      },
      { upsert: true, new: true }
    );
    categoryMap.set(c._id, doc._id);
    categoryMap.set(c.slug, doc._id);
  }

  // 4. Seed Articles
  console.log("4. Seeding Articles...");
  const articleIdMap = new Map<string, any>(); // maps old article._id or slug -> new Mongo ObjectId

  for (const art of seedData.articles) {
    // Resolve Category
    const catSlug = art.category?.slug || "kinh-doanh";
    let catId = categoryMap.get(catSlug) || categoryMap.get(art.categoryId);
    if (!catId) {
      // Fallback to top parent category
      const topCatSlug = catSlug.split("/")[0];
      catId = categoryMap.get(topCatSlug) || categoryMap.get("kinh-doanh");
    }

    // Resolve Author
    const authorName = art.author?.name || "Forbes Việt Nam";
    const authorId = authorMap.get(authorName) || authorMap.get("forbes-viet-nam");

    // Upsert Article
    const doc = await Article.findOneAndUpdate(
      { slug: art.slug },
      {
        $set: {
          title: art.title,
          slug: art.slug,
          excerpt: art.excerpt || "",
          content: {
            html: art.content?.html || art.content || "",
            json: art.content?.json || {},
          },
          coverImage: {
            url: art.coverImage?.url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
            alt: art.coverImage?.alt || art.title,
            width: art.coverImage?.width || 1200,
            height: art.coverImage?.height || 675,
          },
          categoryId: catId,
          authorId: authorId,
          tagIds: [],
          status: "published",
          publishedAt: new Date(art.publishedAt || Date.now()),
          isFeatured: art.isFeatured || false,
          viewCount: art.viewCount || 100,
        },
      },
      { upsert: true, new: true }
    );

    articleIdMap.set(art._id, doc._id);
    articleIdMap.set(art.slug, doc._id);
  }
  console.log(`Seeded ${seedData.articles.length} articles into MongoDB.`);

  // 5. Seed Layouts
  console.log("5. Seeding Layouts...");
  if (seedData.layouts && seedData.layouts.length > 0) {
    for (const l of seedData.layouts) {
      const validArticleIds = (l.articleIds || [])
        .map((oldId: string) => articleIdMap.get(oldId))
        .filter(Boolean);

      const catDbId = l.categoryId ? categoryMap.get(l.categoryId) || null : null;

      await Layout.findOneAndUpdate(
        { page: l.page, section: l.section, categoryId: catDbId },
        {
          $set: {
            page: l.page,
            section: l.section,
            categoryId: catDbId,
            articleIds: validArticleIds,
            maxItems: l.maxItems || validArticleIds.length || 10,
          },
        },
        { upsert: true }
      );
    }
    console.log(`Seeded ${seedData.layouts.length} main section layouts.`);
  }

  // 6. Seed Subcategory Tab Layouts
  console.log("6. Seeding Subcategory Tab Layouts...");
  if (seedData.subcategoryArticleMap) {
    for (const [subSlug, oldIds] of Object.entries(seedData.subcategoryArticleMap as Record<string, string[]>)) {
      const validArticleIds = oldIds
        .map((oldId: string) => articleIdMap.get(oldId))
        .filter(Boolean);

      if (validArticleIds.length > 0) {
        await Layout.findOneAndUpdate(
          { page: "home", section: subSlug },
          {
            $set: {
              page: "home",
              section: subSlug,
              categoryId: categoryMap.get(subSlug) || null,
              articleIds: validArticleIds,
              maxItems: 5,
            },
          },
          { upsert: true }
        );
      }
    }
    console.log(`Seeded ${Object.keys(seedData.subcategoryArticleMap).length} subcategory tab layouts.`);
  }

  console.log("==========================================");
  console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("==========================================");
}

// Auto-run when executed directly
if (require.main === module || process.argv[1]?.includes("seed")) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seed error:", err);
      process.exit(1);
    });
}
