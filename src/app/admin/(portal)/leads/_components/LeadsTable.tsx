"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  status: string;
  isLockIn: boolean;
  packageTitle?: string;
  destinationType?: string;
  preferredDestination?: string;
  createdAt: string;
}

interface Filters {
  status: string;
  source: string;
  isLockIn: string;
  search: string;
}

interface LeadsTableProps {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  filters: Filters;
  statusCounts: Record<string, number>;
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  new:        { label: "New",        cls: "bg-green-100 text-green-700"   },
  contacted:  { label: "Contacted",  cls: "bg-blue-100 text-blue-700"     },
  qualified:  { label: "Qualified",  cls: "bg-purple-100 text-purple-700" },
  converted:  { label: "Converted",  cls: "bg-emerald-100 text-emerald-700" },
  lost:       { label: "Lost",       cls: "bg-gray-100 text-gray-500"     },
};

const SOURCE_LABELS: Record<string, string> = {
  contact_form:    "Contact Form",
  cta_banner:      "CTA Banner",
  hero_form:       "Hero Form",
  package_enquiry: "Package Enquiry",
  lock_in:         "Lock-In Payment",
};

export function LeadsTable({ leads, total, page, limit, filters, statusCounts }: LeadsTableProps) {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState(filters.search);

  const totalPages = Math.ceil(total / limit);

  const buildUrl = (overrides: Partial<Filters & { page: number }>) => {
    const p = { ...filters, page: 1, ...overrides };
    const params = new URLSearchParams();
    if (p.status)           params.set("status",   p.status);
    if (p.source)           params.set("source",   p.source);
    if (p.isLockIn)         params.set("isLockIn", p.isLockIn);
    if (p.search)           params.set("search",   p.search);
    if ((p as { page: number }).page > 1) params.set("page", String((p as { page: number }).page));
    return `/admin/leads?${params.toString()}`;
  };

  const applySearch = () => router.push(buildUrl({ search: searchVal }));

  return (
    <div className="space-y-4">
      {/* Status tabs */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1.5 w-fit">
        {[
          { value: "", label: "All" },
          ...Object.entries(STATUS_LABELS).map(([v, { label }]) => ({ value: v, label })),
        ].map(({ value, label }) => (
          <Link
            key={value}
            href={buildUrl({ status: value })}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors",
              filters.status === value
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            {label}
            {value && statusCounts[value] ? (
              <span className="ml-1.5 text-[10px] opacity-70">({statusCounts[value]})</span>
            ) : null}
          </Link>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") applySearch(); }}
            placeholder="Search name, phone, email…"
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-56"
          />
        </div>
        <select
          value={filters.source}
          onChange={(e) => router.push(buildUrl({ source: e.target.value }))}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white"
        >
          <option value="">All sources</option>
          {Object.entries(SOURCE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          value={filters.isLockIn}
          onChange={(e) => router.push(buildUrl({ isLockIn: e.target.value }))}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white"
        >
          <option value="">All leads</option>
          <option value="true">Lock-In only</option>
          <option value="false">Regular only</option>
        </select>
        {(filters.status || filters.source || filters.isLockIn || filters.search) && (
          <Link href="/admin/leads" className="text-xs text-primary font-medium hover:underline">
            Clear filters
          </Link>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Intent</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                    No leads found
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {lead.name[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{lead.name}</p>
                          <p className="text-xs text-gray-400">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-600">{SOURCE_LABELS[lead.source] ?? lead.source}</span>
                        {lead.isLockIn && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full w-fit">
                            PAID
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-600 truncate max-w-[160px]">
                        {lead.packageTitle ?? lead.preferredDestination ?? lead.destinationType ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2.5 py-1 text-[10px] font-bold rounded-full capitalize",
                        STATUS_LABELS[lead.status]?.cls ?? "bg-gray-100 text-gray-600"
                      )}>
                        {STATUS_LABELS[lead.status]?.label ?? lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {format(new Date(lead.createdAt), "dd MMM, HH:mm")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/leads/${lead._id}`}
                        className="p-1.5 text-gray-300 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <Link
                href={buildUrl({ page: page - 1 })}
                className={cn("p-2 rounded-lg transition-colors", page <= 1 ? "text-gray-200 pointer-events-none" : "text-gray-600 hover:bg-gray-100")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <span className="text-xs font-medium text-gray-700 px-2">{page} / {totalPages}</span>
              <Link
                href={buildUrl({ page: page + 1 })}
                className={cn("p-2 rounded-lg transition-colors", page >= totalPages ? "text-gray-200 pointer-events-none" : "text-gray-600 hover:bg-gray-100")}
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
