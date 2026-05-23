import { connectDB } from "@/lib/db/connect";
import { Package } from "@/models/Package";
import { Lead } from "@/models/Lead";
import { Package as PackageIcon, Users, TrendingUp, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  await connectDB();

  const [
    totalPackages,
    activePackages,
    totalLeads,
    newLeads,
    lockInLeads,
    recentLeads,
  ] = await Promise.all([
    Package.countDocuments(),
    Package.countDocuments({ isActive: true }),
    Lead.countDocuments(),
    Lead.countDocuments({ status: "new" }),
    Lead.countDocuments({ isLockIn: true }),
    Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return { totalPackages, activePackages, totalLeads, newLeads, lockInLeads, recentLeads };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const statCards = [
    {
      label: "Total Packages",
      value: stats.totalPackages,
      sub: `${stats.activePackages} active`,
      icon: PackageIcon,
      href: "/admin/packages",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Leads",
      value: stats.totalLeads,
      sub: `${stats.newLeads} new`,
      icon: Users,
      href: "/admin/leads",
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Lock-In Payments",
      value: stats.lockInLeads,
      sub: "paid leads",
      icon: TrendingUp,
      href: "/admin/leads?isLockIn=true",
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "New Leads",
      value: stats.newLeads,
      sub: "need follow-up",
      icon: Star,
      href: "/admin/leads?status=new",
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your travel portal</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{card.label}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </Link>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Recent Leads</h2>
          <Link href="/admin/leads" className="text-xs text-primary font-medium hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {stats.recentLeads.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400 text-center">No leads yet</p>
          ) : (
            stats.recentLeads.map((lead) => (
              <div key={String(lead._id)} className="flex items-center gap-4 px-6 py-3.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                  {lead.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{lead.name}</p>
                  <p className="text-xs text-gray-400 truncate">{lead.phone} · {lead.source.replace("_", " ")}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {lead.isLockIn && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">
                      PAID
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full capitalize ${
                    lead.status === "new" ? "bg-green-100 text-green-700" :
                    lead.status === "contacted" ? "bg-blue-100 text-blue-700" :
                    lead.status === "converted" ? "bg-emerald-100 text-emerald-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {lead.status}
                  </span>
                  <Link
                    href={`/admin/leads/${String(lead._id)}`}
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
