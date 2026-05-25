import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { connectDB } from "@/lib/db/connect";
import { Service } from "@/models/Service";
import { ServiceForm } from "./_components/ServiceForm";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/admin/services" className="p-2 text-gray-500 hover:text-primary rounded-xl hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Service</h1>
            <p className="text-sm text-gray-500 mt-0.5">Create a new service category</p>
          </div>
        </div>
        <ServiceForm />
      </div>
    );
  }

  await connectDB();
  const svc = await Service.findById(id).lean();
  if (!svc) notFound();

  const defaultValues = {
    title:               svc.title,
    slug:                svc.slug,
    tagline:             svc.tagline,
    description:         svc.description,
    image:               svc.image,
    categories:          svc.categories,
    popularDestinations: svc.popularDestinations,
    hiddenGems:          svc.hiddenGems ?? [],
    isFeaturedHome:      svc.isFeaturedHome ?? false,
    featuredHomeOrder:   svc.featuredHomeOrder ?? 100,
    metaTitle:           svc.metaTitle ?? "",
    metaDescription:     svc.metaDescription ?? "",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/services" className="p-2 text-gray-500 hover:text-primary rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{svc.title}</p>
        </div>
      </div>
      <ServiceForm serviceId={id} defaultValues={defaultValues} />
    </div>
  );
}
