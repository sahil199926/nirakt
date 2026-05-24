import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { connectDB } from "@/lib/db/connect";
import { Location } from "@/models/Location";
import { LocationForm } from "../_components/LocationForm";

export const dynamic = "force-dynamic";

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();
  const loc = await Location.findById(id).lean();
  if (!loc) notFound();

  const defaultValues = {
    name: loc.name,
    slug: loc.slug,
    isInternational: loc.isInternational ?? false,
    isTrending: loc.isTrending ?? false,
    isActive: loc.isActive ?? true,
    metaTitle: loc.metaTitle ?? "",
    metaDescription: loc.metaDescription ?? "",
    image: loc.image ?? "",
    imagePublicId: loc.imagePublicId ?? "",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/location-master"
          className="p-2 text-gray-500 hover:text-primary rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Location</h1>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{loc.name}</p>
        </div>
      </div>
      <LocationForm locationId={id} defaultValues={defaultValues} />
    </div>
  );
}
