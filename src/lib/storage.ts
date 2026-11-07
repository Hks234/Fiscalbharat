import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_BYTES } from "@/lib/constants";

function configured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function client() {
  if (!configured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
    );
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export function validateUpload(file: File) {
  if (!file || file.size === 0) {
    throw new Error("Please choose a file to upload.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File must be 10 MB or smaller.");
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("This file type is not allowed.");
  }
}

async function uploadBuffer(file: File, folder: string, type: "authenticated" | "upload") {
  validateUpload(file);
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
  const result = await client().uploader.upload(dataUri, {
    folder,
    resource_type: type === "upload" ? "image" : "auto",
    type,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  });
  return {
    storageKey: result.public_id,
    fileType: file.type,
    fileName: file.name,
    fileSize: file.size,
    secureUrl: result.secure_url as string | undefined,
  };
}

export async function uploadToCloudinary(file: File, folder: string) {
  return uploadBuffer(file, folder, "authenticated");
}

export async function uploadPublicAsset(file: File, folder: string) {
  return uploadBuffer(file, folder, "upload");
}

export function signedFileUrl(storageKey: string, downloadName?: string) {
  return client().utils.private_download_url(storageKey, "", {
    resource_type: "auto",
    type: "authenticated",
    expires_at: Math.floor(Date.now() / 1000) + 120,
    attachment: Boolean(downloadName),
  });
}

export function signedPreviewUrl(storageKey: string) {
  return client().url(storageKey, {
    resource_type: "auto",
    type: "authenticated",
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + 120,
  });
}

export async function deleteFromCloudinary(storageKey: string) {
  if (!configured() || !storageKey) return;
  await client().uploader.destroy(storageKey, {
    resource_type: "auto",
    type: "authenticated",
    invalidate: true,
  });
}

export function isCloudinaryConfigured() {
  return configured();
}
