"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ToggleAdminStatusProps {
  adminId: string;
  isActive: boolean;
  name: string;
}

export function ToggleAdminStatus({ adminId, isActive, name }: ToggleAdminStatusProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    const action = isActive ? "deactivate" : "activate";
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${name}?`)) return;
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/settings/admins/${adminId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ isActive: !isActive }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Update failed");
      toast.success(`Admin ${action}d`);
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-colors disabled:opacity-50 shrink-0 ${
        isActive
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-green-50 text-green-600 hover:bg-green-100"
      }`}
    >
      {loading && <Loader2 className="w-3 h-3 animate-spin" />}
      {isActive ? "Deactivate" : "Activate"}
    </button>
  );
}
