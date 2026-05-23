import { connectDB } from "@/lib/db/connect";
import { Service, type IServiceCategory } from "@/models/Service";
import { auth } from "@/auth";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const session = await auth();
  await connectDB();
  const services = await Service.find().sort({ title: 1 }).lean();
  const isSuperAdmin = session?.user?.role === "super_admin";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-sm text-gray-500 mt-0.5">{services.length} services configured</p>
        </div>
        {isSuperAdmin && (
          <Link
            href="/admin/services/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Service
          </Link>
        )}
      </div>

      <div className="grid gap-4">
        {services.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-400">No services yet</p>
            {isSuperAdmin && (
              <Link href="/admin/services/new" className="inline-block mt-3 text-sm font-medium text-primary hover:underline">
                Create your first service
              </Link>
            )}
          </div>
        ) : (
          services.map((svc) => (
            <div key={String(svc._id)} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-bold text-gray-900">{svc.title}</h2>
                  <span className="text-xs text-gray-400 font-mono">/{svc.slug}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{svc.tagline}</p>
                {svc.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {svc.categories.map((cat: IServiceCategory) => (
                      <span key={cat.slug} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Link
                href={`/admin/services/${String(svc._id)}`}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors shrink-0"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
