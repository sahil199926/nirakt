"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { RichTextEditor } from "@/app/admin/_components/RichTextEditor";
import { TagInput } from "@/app/admin/_components/TagInput";
import { ItineraryEditor, ItineraryDay } from "@/app/admin/_components/ItineraryEditor";
import { PackageCategorySelect } from "@/app/admin/_components/PackageCategorySelect";
import { ImageUploader } from "@/app/admin/_components/ImageUploader";
import { INDIA_STATES } from "@/app/lib/constants";
import type { GstRate } from "@/models/Package";

interface PackageFormValues {
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  lockInAmount: number | "";
  gst: GstRate;
  duration: string;
  durationDays: number | "";
  badge: string;
  isInternational: boolean;
  destinations: string[];
  categorySlugs: string[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  isActive: boolean;
  isFeatured: boolean;
  isSpecial: boolean;
  metaTitle: string;
  metaDescription: string;
  coverImage: string;
  coverImagePublicId: string;
  images: string[];
  imagePublicIds: string[];
}

interface PackageFormProps {
  defaultValues?: Partial<PackageFormValues>;
  packageId?: string;
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

function Field({ label, error, children, hint }: { label: string; error?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

const GST_OPTIONS: { label: string; value: GstRate }[] = [
  { label: "None (0%)", value: 0 },
  { label: "5%", value: 5 },
  { label: "8%", value: 8 },
  { label: "18%", value: 18 },
];

export function PackageForm({ defaultValues, packageId }: PackageFormProps) {
  const router = useRouter();
  const isEdit = !!packageId;

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<PackageFormValues>({
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      price: 0,
      lockInAmount: "",
      gst: 0,
      duration: "",
      durationDays: "",
      badge: "",
      isInternational: false,
      destinations: [],
      categorySlugs: [],
      inclusions: [],
      exclusions: [],
      highlights: [],
      itinerary: [],
      isActive: true,
      isFeatured: false,
      isSpecial: false,
      metaTitle: "",
      metaDescription: "",
      coverImage: "",
      coverImagePublicId: "",
      images: [],
      imagePublicIds: [],
      ...defaultValues,
    },
  });

  const coverImage = watch("coverImage");
  const isInternational = watch("isInternational");
  const gst = watch("gst");

  const onSubmit = async (data: PackageFormValues) => {
    const payload = {
      ...data,
      price: Number(data.price),
      gst: Number(data.gst) as GstRate,
      lockInAmount: data.lockInAmount !== "" ? Number(data.lockInAmount) : undefined,
      durationDays: data.durationDays !== "" ? Number(data.durationDays) : undefined,
    };

    const url    = isEdit ? `/api/admin/packages/${packageId}` : "/api/admin/packages";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Save failed");
      toast.success(isEdit ? "Package updated" : "Package created");
      router.push("/admin/packages");
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Basic Info */}
      <Section title="Basic Information">
        <Field label="Title *" error={errors.title?.message}>
          <input
            {...register("title", { required: "Title is required" })}
            className={inputCls}
            placeholder="e.g. Manali Snow Adventure — 6N/7D"
          />
        </Field>
        <Field label="Short Description" error={errors.shortDescription?.message}>
          <textarea
            {...register("shortDescription")}
            rows={2}
            className={`${inputCls} resize-none`}
            placeholder="Brief tagline shown on cards (max 120 chars)"
          />
        </Field>
        <Field label="Description *" error={errors.description?.message}>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>
      </Section>

      {/* Pricing & Duration */}
      <Section title="Pricing & Duration">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (INR) *" error={errors.price?.message}>
            <input
              {...register("price", { required: "Price is required", min: { value: 1, message: "Price must be > 0" } })}
              type="number"
              className={inputCls}
              placeholder="45000"
            />
          </Field>
          <Field label="Lock-In Amount (INR)">
            <input
              {...register("lockInAmount")}
              type="number"
              className={inputCls}
              placeholder="2000 (optional)"
            />
          </Field>
          <Field label="Duration Label *" error={errors.duration?.message}>
            <input
              {...register("duration", { required: "Duration is required" })}
              className={inputCls}
              placeholder="6N / 7D"
            />
          </Field>
          <Field label="Duration (days)">
            <input
              {...register("durationDays")}
              type="number"
              className={inputCls}
              placeholder="7"
            />
          </Field>
        </div>

        {/* GST */}
        <Field label="GST Rate" hint="Select applicable GST. Choose 'None' if price is GST-inclusive or exempt.">
          <div className="flex items-center gap-4 flex-wrap">
            {GST_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  value={opt.value}
                  checked={Number(gst) === opt.value}
                  onChange={() => setValue("gst", opt.value)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Badge / Tag">
          <input
            {...register("badge")}
            className={inputCls}
            placeholder="e.g. Best Seller, New, Limited"
          />
        </Field>
      </Section>

      {/* Cover Image */}
      <Section title="Cover Image">
        <p className="text-xs text-gray-500">Required ratio: <strong>16:9</strong>. Max 5 MB. Use <a href="https://squoosh.app" target="_blank" rel="noopener noreferrer" className="text-primary underline">squoosh.app</a> or <a href="https://www.canva.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">canva.com</a> to resize.</p>
        <ImageUploader
          value={coverImage || undefined}
          folder="packages"
          label="Upload Cover Image"
          className="h-48"
          maxSizeMB={5}
          aspectConstraint={{ ratio: 16 / 9, label: "16:9", tolerance: 0.15 }}
          onChange={(url, publicId) => {
            setValue("coverImage", url);
            setValue("coverImagePublicId", publicId);
          }}
          onRemove={() => {
            setValue("coverImage", "");
            setValue("coverImagePublicId", "");
          }}
        />
        {errors.coverImage && (
          <p className="text-xs text-red-500 mt-1">{errors.coverImage.message}</p>
        )}
      </Section>

      {/* Destinations & Categories */}
      <Section title="Destinations & Categories">
        {/* International toggle */}
        <Field label="Package Type">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!isInternational}
                onChange={() => setValue("isInternational", false)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-gray-700">Domestic (India)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={isInternational}
                onChange={() => setValue("isInternational", true)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-gray-700">International</span>
            </label>
          </div>
        </Field>

        {isInternational ? (
          <Field label="International Destinations" hint="Enter destination names (countries, cities, regions)">
            <Controller
              name="destinations"
              control={control}
              render={({ field }) => (
                <TagInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Type destination and press Enter (e.g. Bali, Dubai)"
                />
              )}
            />
          </Field>
        ) : (
          <Field label="State(s) in India" hint="Select all applicable states">
            <Controller
              name="destinations"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <div className="relative">
                    <select
                      className={`${inputCls} appearance-none`}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && !field.value.includes(val)) {
                          field.onChange([...field.value, val]);
                        }
                        e.target.value = "";
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Select a state…</option>
                      {INDIA_STATES.filter((s) => !field.value.includes(s)).map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((state) => (
                        <span
                          key={state}
                          className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                        >
                          {state}
                          <button
                            type="button"
                            onClick={() => field.onChange(field.value.filter((s) => s !== state))}
                            className="hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            />
          </Field>
        )}

        <Field label="Categories">
          <Controller
            name="categorySlugs"
            control={control}
            render={({ field }) => (
              <PackageCategorySelect value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>
      </Section>

      {/* Inclusions & Exclusions */}
      <Section title="Inclusions & Exclusions">
        <Field label="Inclusions">
          <Controller
            name="inclusions"
            control={control}
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Breakfast, Hotel, Transfers" />
            )}
          />
        </Field>
        <Field label="Exclusions">
          <Controller
            name="exclusions"
            control={control}
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Flights, Visa, Personal expenses" />
            )}
          />
        </Field>
        <Field label="Highlights">
          <Controller
            name="highlights"
            control={control}
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Rohtang Pass, Solang Valley" />
            )}
          />
        </Field>
      </Section>

      {/* Itinerary */}
      <Section title="Itinerary" defaultOpen={false}>
        <Controller
          name="itinerary"
          control={control}
          render={({ field }) => (
            <ItineraryEditor value={field.value} onChange={field.onChange} />
          )}
        />
      </Section>

      {/* SEO */}
      <Section title="SEO" defaultOpen={false}>
        <Field label="Meta Title">
          <input {...register("metaTitle")} className={inputCls} placeholder="Leave blank to use package title" />
        </Field>
        <Field label="Meta Description">
          <textarea {...register("metaDescription")} rows={2} className={`${inputCls} resize-none`} placeholder="Leave blank to use short description" />
        </Field>
      </Section>

      {/* Publish settings */}
      <Section title="Publish Settings">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register("isActive")} type="checkbox" className="w-4 h-4 accent-primary" />
            <span className="text-sm font-medium text-gray-700">Active (visible on site)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register("isFeatured")} type="checkbox" className="w-4 h-4 accent-primary" />
            <span className="text-sm font-medium text-gray-700">Featured (show on homepage)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register("isSpecial")} type="checkbox" className="w-4 h-4 accent-primary" />
            <span className="text-sm font-medium text-gray-700">Special (show in Specials section)</span>
          </label>
        </div>
      </Section>

      {/* Actions */}
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
          {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Create Package"}
        </button>
      </div>
    </form>
  );
}
