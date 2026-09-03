import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { promises as fs } from "fs";
import path from "path";
import { getSession } from "@/lib/auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

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

async function readBuffer(file: File): Promise<Buffer> {
  const bytes = await file.arrayBuffer();
  return Buffer.from(bytes);
}

function hasAllowedImageSignature(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isGif = buffer.subarray(0, 6).toString("ascii") === "GIF87a" || buffer.subarray(0, 6).toString("ascii") === "GIF89a";
  const isWebp = buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";

  return isJpeg || isPng || isGif || isWebp;
}

async function localUpload(file: File) {
  const buffer = await readBuffer(file);
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
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.formData();
    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type." },
        { status: 415 }
      );
    }

    const buffer = await readBuffer(file);
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image is too large. Maximum size is 10 MB." },
        { status: 413 }
      );
    }

    if (!hasAllowedImageSignature(buffer)) {
      return NextResponse.json(
        { error: "Invalid image file." },
        { status: 415 }
      );
    }

    if (!isCloudinaryConfigured) {
      // Vercel's filesystem is read-only, so writing to /public/uploads fails in production.
      // Cloudinary is the only durable storage path for uploaded images.
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          {
            error:
              "Image uploads are unavailable: Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to the Vercel environment variables.",
          },
          { status: 503 }
        );
      }

      try {
        return NextResponse.json(await localUpload(file));
      } catch (err) {
        console.error("Local upload failed:", err);
        return NextResponse.json(
          { error: "Image upload failed. Check write access to public/uploads." },
          { status: 500 }
        );
      }
    }

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
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Image upload failed. Check the Cloudinary configuration." },
          { status: 502 }
        );
      }

      try {
        return NextResponse.json(await localUpload(file));
      } catch (err2) {
        console.error("Local fallback failed:", err2);
        return NextResponse.json(
          { error: "Image upload failed. Please try again." },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Image upload failed. Please try again." },
      { status: 500 }
    );
  }
}
