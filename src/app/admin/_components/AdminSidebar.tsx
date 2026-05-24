"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plane, LayoutDashboard, Package, Layers, Users, Settings, LogOut, MapPin, CreditCard } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard",       label: "Dashboard",       icon: LayoutDashboard },
  { href: "/admin/packages",        label: "Packages",        icon: Package },
  { href: "/admin/services",        label: "Services",        icon: Layers },
  { href: "/admin/location-master", label: "Locations",       icon: MapPin },
  { href: "/admin/leads",           label: "Leads",           icon: Users },
  { href: "/admin/payments",        label: "Payments",        icon: CreditCard },
];

interface AdminSidebarProps {
  newLeadCount?: number;
}

export function AdminSidebar({ newLeadCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-primary flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
          <Plane className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">NIRAKT</p>
          <p className="text-white/50 text-[10px] uppercase tracking-widest">Admin Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {label === "Leads" && newLeadCount > 0 && (
                <span className="ml-auto bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {newLeadCount > 99 ? "99+" : newLeadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
            pathname === "/admin/settings"
              ? "bg-white/15 text-white"
              : "text-white/60 hover:text-white hover:bg-white/10"
          )}
        >
          <Settings className="w-4 h-4" /> Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
