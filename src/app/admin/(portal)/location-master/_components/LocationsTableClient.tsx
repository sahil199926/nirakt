"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Globe, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationRow {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  isInternational: boolean;
  isTrending: boolean;
  isActive: boolean;
}

export function LocationsTableClient({ locations }: { locations: LocationRow[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/locations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Location deleted");
      router.refresh();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  if (locations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No locations yet</p>
        <p className="text-sm text-gray-400 mt-1">Add your first location to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trending</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="w-20 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {locations.map((loc) => (
              <tr key={loc._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {loc.image ? (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <Image src={loc.image} alt={loc.name} fill className="object-cover" sizes="40px" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-sand flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-text-muted" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{loc.name}</p>
                      <p className="text-xs text-gray-400">{loc.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    {loc.isInternational ? <Globe className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                    {loc.isInternational ? "International" : "Domestic"}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {loc.isTrending && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full w-fit">
                      <Star className="w-3 h-3" /> Trending
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2.5 py-1 text-[10px] font-bold rounded-full",
                    loc.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  )}>
                    {loc.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/location-master/${loc._id}`}
                      className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(loc._id, loc.name)}
                      disabled={deleting === loc._id}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
