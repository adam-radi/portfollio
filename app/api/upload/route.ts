import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { promises as fs } from "fs";
import path from "path";

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

async function fallbackLocalUpload(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const safeExt = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext) ? ext : "png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;
  const targetDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, filename);
  await fs.writeFile(targetPath, buffer);

  return {
    success: true,
    url: `/uploads/${filename}`,
    public_id: filename,
  };
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!isCloudinaryConfigured) {
      return NextResponse.json(await fallbackLocalUpload(file));
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "portfolio",
            allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
            transformation: [{ width: 1200, height: 800, crop: "limit" }],
          },
          (error, result) => {
            if (error) return reject(error);
            if (result) return resolve(result);
            reject(new Error("Upload failed: no result returned."));
          }
        );

        uploadStream.end(buffer);
      });

      return NextResponse.json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch {
      return NextResponse.json(await fallbackLocalUpload(file));
    }
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Image upload failed. Please try again." },
      { status: 500 }
    );
  }
}