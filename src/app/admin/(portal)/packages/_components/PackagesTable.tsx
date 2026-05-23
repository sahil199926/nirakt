"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PackageRow {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  price: number;
  duration: string;
  destinations: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

interface PackagesTableProps {
  packages: PackageRow[];
  total: number;
  page: number;
  limit: number;
  search: string;
}

export function PackagesTable({ packages, total, page, limit, search }: PackagesTableProps) {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState(search);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const totalPages = Math.ceil(total / limit);

  const doSearch = (val: string) => {
    const params = new URLSearchParams();
    if (val) params.set("search", val);
    router.push(`/admin/packages?${params.toString()}`);
  };

  const deletePackage = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }
      toast.success("Package deleted");
      startTransition(() => router.refresh());
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") doSearch(searchVal); }}
            placeholder="Search packages…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <button
          onClick={() => doSearch(searchVal)}
          className="px-3.5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Package</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {packages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-400">
                  No packages found
                </td>
              </tr>
            ) : (
              packages.map((pkg) => (
                <tr key={pkg._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                        {pkg.coverImage && (
                          <Image
                            src={pkg.coverImage}
                            alt={pkg.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{pkg.title}</p>
                        <p className="text-xs text-gray-400 truncate">{pkg.destinations.slice(0, 2).join(", ")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    ₹{pkg.price.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{pkg.duration}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pkg.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {pkg.isActive ? "Active" : "Inactive"}
                      </span>
                      {pkg.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/packages/${pkg._id}`}
                        className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => deletePackage(pkg._id, pkg.title)}
                        disabled={deletingId === pkg._id}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        {deletingId === pkg._id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <Link
              href={`/admin/packages?page=${page - 1}${search ? `&search=${search}` : ""}`}
              className={`p-2 rounded-lg transition-colors ${page <= 1 ? "text-gray-200 pointer-events-none" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-medium text-gray-700 px-2">
              {page} / {totalPages}
            </span>
            <Link
              href={`/admin/packages?page=${page + 1}${search ? `&search=${search}` : ""}`}
              className={`p-2 rounded-lg transition-colors ${page >= totalPages ? "text-gray-200 pointer-events-none" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
