"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

const STATUSES = ["new", "contacted", "qualified", "converted", "lost"] as const;
type LeadStatus = typeof STATUSES[number];

interface LeadActionsProps {
  leadId: string;
  currentStatus: string;
  currentNotes: string;
  isSuperAdmin: boolean;
}

export function LeadActions({ leadId, currentStatus, currentNotes, isSuperAdmin }: LeadActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(currentStatus as LeadStatus);
  const [notes,  setNotes]  = useState(currentNotes);
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();

  const save = async () => {
    setSaving(true);
    try {
      const res  = await fetch(`/api/admin/leads/${leadId}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status, notes }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Update failed");
      toast.success("Lead updated");
      startTransition(() => router.refresh());
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteLead = async () => {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Delete failed");
      }
      toast.success("Lead deleted");
      router.push("/admin/leads");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">CRM Actions</p>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Status</label>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all ${
                status === s
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Add internal notes, follow-up details, etc."
          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        {isSuperAdmin ? (
          <button
            type="button"
            onClick={deleteLead}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Lead
          </button>
        ) : <div />}

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
