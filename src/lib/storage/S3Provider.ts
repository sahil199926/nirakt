// TODO: implement with @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner
import type { StorageProvider, UploadOptions, UploadResult } from "./types";

export class S3Provider implements StorageProvider {
  async upload(_buf: Buffer, _mime: string, _opts: UploadOptions): Promise<UploadResult> {
    throw new Error("S3Provider not yet implemented. Install @aws-sdk/client-s3 and implement.");
  }
  async delete(_publicId: string): Promise<void> {
    throw new Error("S3Provider not yet implemented.");
  }
  getOptimizedUrl(_publicId: string, _width?: number, _quality?: number): string {
    throw new Error("S3Provider not yet implemented.");
  }
}
