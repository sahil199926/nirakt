import { CloudinaryProvider } from "./CloudinaryProvider";
import { S3Provider }         from "./S3Provider";
import type { StorageProvider } from "./types";

export type StorageBackend = "cloudinary" | "s3";

export function createStorageProvider(backend?: StorageBackend): StorageProvider {
  const b = backend ?? (process.env.STORAGE_BACKEND as StorageBackend) ?? "cloudinary";
  switch (b) {
    case "cloudinary": return new CloudinaryProvider();
    case "s3":         return new S3Provider();
    default:           throw new Error(`Unknown storage backend: ${b}`);
  }
}

let _instance: StorageProvider | null = null;
export function getStorage(): StorageProvider {
  if (!_instance) _instance = createStorageProvider();
  return _instance;
}

export type { StorageProvider, UploadOptions, UploadResult } from "./types";
