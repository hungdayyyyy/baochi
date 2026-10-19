import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export interface StorageProvider {
  uploadFile(file: Buffer, fileName: string, contentType: string): Promise<string>;
}

class LocalStorageProvider implements StorageProvider {
  async uploadFile(file: Buffer, fileName: string, contentType: string): Promise<string> {
    const fs = await import("fs/promises");
    const path = await import("path");

    const uploadDir = path.join(process.cwd(), "public", "uploads", "articles");
    await fs.mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const safeName = `${timestamp}-${fileName.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, safeName);

    await fs.writeFile(filePath, file);
    return `/uploads/articles/${safeName}`;
  }
}

class MinIOStorageProvider implements StorageProvider {
  private client: S3Client;
  private bucket: string;
  private publicEndpoint: string;
  private localFallback = new LocalStorageProvider();

  constructor() {
    const endpoint = process.env.MINIO_ENDPOINT || "http://localhost:9000";
    const accessKeyId = process.env.MINIO_ACCESS_KEY || "minioadmin";
    const secretAccessKey = process.env.MINIO_SECRET_KEY || "minioadmin123";
    this.bucket = process.env.MINIO_BUCKET || "forbes-media";
    this.publicEndpoint = process.env.MINIO_PUBLIC_URL || endpoint;

    this.client = new S3Client({
      endpoint,
      region: "us-east-1",
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true, // required for MinIO
    });
  }

  async uploadFile(file: Buffer, fileName: string, contentType: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const key = `uploads/${timestamp}-${fileName.replace(/\s+/g, "-")}`;

      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file,
          ContentType: contentType,
          ACL: "public-read",
        })
      );

      return `${this.publicEndpoint.replace(/\/$/, "")}/${this.bucket}/${key}`;
    } catch (err) {
      console.warn("MinIO S3 upload failed or server unreachable, falling back to local storage:", err);
      return this.localFallback.uploadFile(file, fileName, contentType);
    }
  }
}

// Storage Factory
export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER || "minio";

  if (provider === "minio" || provider === "s3" || provider === "r2") {
    // S3-compatible (MinIO, AWS S3, Cloudflare R2) with safe fallback
    return new MinIOStorageProvider();
  }

  return new LocalStorageProvider();
}

export const storage = getStorageProvider();
