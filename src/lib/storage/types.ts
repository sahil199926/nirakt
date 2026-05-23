export interface UploadOptions {
  folder: string;
  publicId?: string;
  transformation?: Record<string, unknown>[];
}

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

export interface StorageProvider {
  upload(fileBuffer: Buffer, mimeType: string, options: UploadOptions): Promise<UploadResult>;
  delete(publicId: string): Promise<void>;
  getOptimizedUrl(publicId: string, width?: number, quality?: number): string;
}
