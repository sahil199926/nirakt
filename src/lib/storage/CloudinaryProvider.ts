import { v2 as cloudinary } from "cloudinary";
import type { StorageProvider, UploadOptions, UploadResult } from "./types";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export class CloudinaryProvider implements StorageProvider {
  async upload(fileBuffer: Buffer, mimeType: string, options: UploadOptions): Promise<UploadResult> {
    const dataUri = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
    const result  = await cloudinary.uploader.upload(dataUri, {
      folder:         `nirakt/${options.folder}`,
      public_id:      options.publicId,
      resource_type:  "image",
    });
    return {
      url:      result.secure_url,
      publicId: result.public_id,
      width:    result.width,
      height:   result.height,
      format:   result.format,
      bytes:    result.bytes,
    };
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  getOptimizedUrl(publicId: string, width = 800, quality = 80): string {
    return cloudinary.url(publicId, {
      transformation: [{ width, quality, crop: "fill", fetch_format: "auto" }],
      secure: true,
    });
  }
}
