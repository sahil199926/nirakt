import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { connectDB } from "@/lib/db/connect";
import { Package } from "@/models/Package";
import { PackageForm } from "../_components/PackageForm";

export const dynamic = "force-dynamic";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();
  const pkg = await Package.findById(id).lean();
  if (!pkg) notFound();

  const defaultValues = {
    title:              pkg.title,
    shortDescription:   pkg.shortDescription ?? "",
    description:        pkg.description,
    price:              pkg.price,
    lockInAmount:       pkg.lockInAmount,
    gst:                (pkg.gst ?? 0) as 0 | 5 | 8 | 18,
    duration:           pkg.duration,
    durationDays:       pkg.durationDays,
    badge:              pkg.badge ?? "",
    isInternational:    pkg.isInternational ?? false,
    destinations:       pkg.destinations,
    categorySlugs:      pkg.categorySlugs,
    inclusions:         pkg.inclusions,
    exclusions:         pkg.exclusions,
    highlights:         pkg.highlights,
    itinerary:          pkg.itinerary,
    isActive:           pkg.isActive,
    isFeatured:         pkg.isFeatured,
    isSpecial:          pkg.isSpecial ?? false,
    metaTitle:          pkg.metaTitle ?? "",
    metaDescription:    pkg.metaDescription ?? "",
    coverImage:         pkg.coverImage,
    coverImagePublicId: "",
    images:             pkg.images,
    imagePublicIds:     [],
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/packages"
          className="p-2 text-gray-500 hover:text-primary rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Package</h1>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{pkg.title}</p>
        </div>
      </div>

      <PackageForm packageId={id} defaultValues={defaultValues} />
    </div>
  );
}
