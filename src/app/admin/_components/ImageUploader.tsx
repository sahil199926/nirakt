"use client";

import { useCallback, useState } from "react";
import { useDropzone }           from "react-dropzone";
import { Upload, X, Loader2 }    from "lucide-react";
import { cn }                    from "@/lib/utils";
import Image                     from "next/image";

interface ImageUploaderProps {
  value?:    string;   // current url (for preview)
  onChange:  (url: string, publicId: string) => void;
  onRemove?: () => void;
  folder?:   string;
  label?:    string;
  className?: string;
}

export function ImageUploader({ value, onChange, onRemove, folder = "general", label = "Upload Image", className }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file",   file);
      fd.append("folder", folder);
      const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url, data.publicId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }, [folder, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    disabled: loading,
  });

  if (value) {
    return (
      <div className={cn("relative group rounded-xl overflow-hidden border border-gray-200", className)}>
        <Image src={value} alt="Uploaded" fill className="object-cover" sizes="400px" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onRemove?.()}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50",
        className
      )}
    >
      <input {...getInputProps()} />
      {loading ? (
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      ) : (
        <>
          <Upload className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 5 MB</p>
        </>
      )}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
