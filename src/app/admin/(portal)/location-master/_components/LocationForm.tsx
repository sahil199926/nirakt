"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { ImageUploader } from "@/app/admin/_components/ImageUploader";

interface LocationFormValues {
  name: string;
  slug: string;
  isInternational: boolean;
  isTrending: boolean;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  image: string;
  imagePublicId: string;
}

interface LocationFormProps {
  defaultValues?: Partial<LocationFormValues>;
  locationId?: string;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <p className="text-sm font-bold text-gray-800">{title}</p>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="p-5 space-y-4">{children}</div>}
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function LocationForm({ defaultValues, locationId }: LocationFormProps) {
  const router = useRouter();
  const isEdit = !!locationId;

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<LocationFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      isInternational: false,
      isTrending: false,
      isActive: true,
      metaTitle: "",
      metaDescription: "",
      image: "",
      imagePublicId: "",
      ...defaultValues,
    },
  });

  const image = watch("image");
  const name = watch("name");

  const onSubmit = async (data: LocationFormValues) => {
    if (!data.slug) data.slug = slugify(data.name);

    const url = isEdit ? `/api/admin/locations/${locationId}` : "/api/admin/locations";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Save failed");
      toast.success(isEdit ? "Location updated" : "Location created");
      router.push("/admin/location-master");
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Section title="Basic Information">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Name *</label>
          <input
            {...register("name", { required: "Name is required" })}
            className={inputCls}
            placeholder="e.g. Bali, Kerala, Paris"
            onChange={(e) => {
              register("name").onChange(e);
              if (!isEdit) setValue("slug", slugify(e.target.value));
            }}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Slug *</label>
          <input
            {...register("slug", { required: "Slug is required" })}
            className={inputCls}
            placeholder="bali, kerala, paris"
          />
          {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Type</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!watch("isInternational")}
                onChange={() => setValue("isInternational", false)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-gray-700">Domestic (India)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={watch("isInternational")}
                onChange={() => setValue("isInternational", true)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-gray-700">International</span>
            </label>
          </div>
        </div>
      </Section>

      <Section title="Image">
        <p className="text-xs text-gray-500">
          Required ratio: <strong>3:4</strong> (portrait). Max 5 MB. Use{" "}
          <a href="https://tinywow.com/image/resize" target="_blank" rel="noopener noreferrer" className="text-primary underline">tiny.wow</a> to resize.
        </p>
        <ImageUploader
          value={image || undefined}
          folder="locations"
          label="Upload Location Image"
          className="h-64"
          maxSizeMB={5}
          aspectConstraint={{ ratio: 3 / 4, label: "3:4", tolerance: 0.1 }}
          onChange={(url, publicId) => {
            setValue("image", url);
            setValue("imagePublicId", publicId);
          }}
          onRemove={() => {
            setValue("image", "");
            setValue("imagePublicId", "");
          }}
        />
      </Section>

      <Section title="Settings">
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register("isTrending")} type="checkbox" className="w-4 h-4 accent-primary" />
            <span className="text-sm font-medium text-gray-700">Trending (show on Destinations page)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register("isActive")} type="checkbox" className="w-4 h-4 accent-primary" />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>
      </Section>

      <Section title="SEO" defaultOpen={false}>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Meta Title</label>
          <input {...register("metaTitle")} className={inputCls} placeholder={`${name || "Location"} Travel Packages | Nirakt Travels`} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Meta Description</label>
          <textarea {...register("metaDescription")} rows={2} className={`${inputCls} resize-none`} placeholder="Leave blank to auto-generate" />
        </div>
      </Section>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Create Location"}
        </button>
      </div>
    </form>
  );
}
