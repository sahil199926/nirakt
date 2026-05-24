"use client";

import { useCallback, useState } from "react";
import { useDropzone }           from "react-dropzone";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { cn }                    from "@/lib/utils";
import Image                     from "next/image";

export interface AspectConstraint {
  ratio: number;       // e.g. 16/9 or 3/4
  label: string;       // e.g. "16:9" or "3:4"
  tolerance: number;   // allowed deviation, e.g. 0.1
}

interface ImageUploaderProps {
  value?:    string;
  onChange:  (url: string, publicId: string) => void;
  onRemove?: () => void;
  folder?:   string;
  label?:    string;
  className?: string;
  maxSizeMB?: number;
  aspectConstraint?: AspectConstraint;
}

function checkAspectRatio(file: File, constraint: AspectConstraint): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const actual = img.width / img.height;
      if (Math.abs(actual - constraint.ratio) > constraint.tolerance) {
        const w = Math.round(constraint.ratio * 600);
        resolve(
          `Image ratio must be ${constraint.label}. Your image is ${img.width}×${img.height}. ` +
          `Please resize it (suggested: ${w}×600px). ` +
          `Use Squoosh (squoosh.app) or Canva (canva.com) to fix the ratio.`
        );
      } else {
        resolve(null);
      }
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

export function ImageUploader({
  value,
  onChange,
  onRemove,
  folder = "general",
  label = "Upload Image",
  className,
  maxSizeMB = 5,
  aspectConstraint,
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError("");

    // Size check
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(
        `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max allowed: ${maxSizeMB} MB. ` +
        `Compress at Squoosh (squoosh.app) or TinyPNG (tinypng.com).`
      );
      return;
    }

    // Aspect ratio check
    if (aspectConstraint) {
      const ratioErr = await checkAspectRatio(file, aspectConstraint);
      if (ratioErr) {
        setError(ratioErr);
        return;
      }
    }

    setLoading(true);
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
  }, [folder, onChange, maxSizeMB, aspectConstraint]);

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
    <div className="space-y-2">
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
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WebP — max {maxSizeMB} MB
              {aspectConstraint ? ` · Ratio ${aspectConstraint.label}` : ""}
            </p>
          </>
        )}
      </div>
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
