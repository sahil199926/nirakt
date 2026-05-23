"use client";

import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { TagInput } from "@/app/admin/_components/TagInput";
import { ImageUploader } from "@/app/admin/_components/ImageUploader";

interface CategoryInput {
  name: string;
  slug: string;
}

interface ServiceFormValues {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  imagePublicId: string;
  categories: CategoryInput[];
  popularDestinations: string[];
  hiddenGems: string[];
  metaTitle: string;
  metaDescription: string;
}

interface ServiceFormProps {
  serviceId?: string;
  defaultValues?: Partial<ServiceFormValues>;
}

const inputCls = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function ServiceForm({ serviceId, defaultValues }: ServiceFormProps) {
  const router = useRouter();
  const isEdit = !!serviceId;
  const [image, setImage] = useState(defaultValues?.image ?? "");

  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<ServiceFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      tagline: "",
      description: "",
      image: "",
      imagePublicId: "",
      categories: [],
      popularDestinations: [],
      hiddenGems: [],
      metaTitle: "",
      metaDescription: "",
      ...defaultValues,
    },
  });

  const { fields: catFields, append: catAppend, remove: catRemove } = useFieldArray({
    control,
    name: "categories",
  });

  const onSubmit = async (data: ServiceFormValues) => {
    const url    = isEdit ? `/api/admin/services/${serviceId}` : "/api/admin/services";
    const method = isEdit ? "PUT" : "POST";
    try {
      const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Save failed");
      toast.success(isEdit ? "Service updated" : "Service created");
      router.push("/admin/services");
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <p className="text-sm font-bold text-gray-800">Basic Information</p>
        <Field label="Service Title *" error={errors.title?.message}>
          <input {...register("title", { required: "Title is required" })} className={inputCls} placeholder="e.g. Honeymoon Packages" />
        </Field>
        <Field label="Slug *" error={errors.slug?.message}>
          <input {...register("slug", { required: "Slug is required", pattern: { value: /^[a-z0-9-]+$/, message: "Only lowercase letters, numbers, hyphens" } })} className={inputCls} placeholder="e.g. honeymoon-packages" />
        </Field>
        <Field label="Tagline *" error={errors.tagline?.message}>
          <input {...register("tagline", { required: "Tagline is required" })} className={inputCls} placeholder="Short tagline for this service" />
        </Field>
        <Field label="Description *" error={errors.description?.message}>
          <textarea {...register("description", { required: "Description is required" })} rows={3} className={`${inputCls} resize-none`} />
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <p className="text-sm font-bold text-gray-800">Service Image</p>
        <ImageUploader
          value={image || undefined}
          folder="services"
          label="Upload Service Image"
          className="h-48"
          onChange={(url, publicId) => {
            setImage(url);
            setValue("image", url);
            setValue("imagePublicId", publicId);
          }}
          onRemove={() => {
            setImage("");
            setValue("image", "");
            setValue("imagePublicId", "");
          }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-gray-800">Package Categories</p>
          <button
            type="button"
            onClick={() => catAppend({ name: "", slug: "" })}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Add Category
          </button>
        </div>
        {catFields.length === 0 && (
          <p className="text-xs text-gray-400">No categories yet. Packages can be tagged with these.</p>
        )}
        {catFields.map((field, idx) => (
          <div key={field.id} className="flex items-start gap-3">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <input
                {...register(`categories.${idx}.name` as const, { required: true })}
                className={inputCls}
                placeholder="Category name"
              />
              <input
                {...register(`categories.${idx}.slug` as const, { required: true, pattern: /^[a-z0-9-]+$/ })}
                className={inputCls}
                placeholder="category-slug"
              />
            </div>
            <button
              type="button"
              onClick={() => catRemove(idx)}
              className="p-2.5 text-gray-400 hover:text-red-500 rounded-xl hover:bg-gray-100 mt-0.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <p className="text-sm font-bold text-gray-800">Destinations</p>
        <Field label="Popular Destinations">
          <Controller
            name="popularDestinations"
            control={control}
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Manali, Shimla" />
            )}
          />
        </Field>
        <Field label="Hidden Gems">
          <Controller
            name="hiddenGems"
            control={control}
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Spiti, Kinnaur" />
            )}
          />
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <p className="text-sm font-bold text-gray-800">SEO</p>
        <Field label="Meta Title">
          <input {...register("metaTitle")} className={inputCls} />
        </Field>
        <Field label="Meta Description">
          <textarea {...register("metaDescription")} rows={2} className={`${inputCls} resize-none`} />
        </Field>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Create Service"}
        </button>
      </div>
    </form>
  );
}
