"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X, Loader2, UserPlus } from "lucide-react";
import { DESTINATION_TYPES, BUDGET_RANGES } from "@/app/lib/constants";

interface LeadFormValues {
  name: string;
  phone: string;
  email: string;
  source: string;
  status: string;
  destinationType: string;
  preferredDestination: string;
  travelDate: string;
  travelers: number | "";
  budget: string;
  message: string;
  packageTitle: string;
}

const inputCls = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

export function AddLeadButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<LeadFormValues>({
    name: "",
    phone: "",
    email: "",
    source: "contact_form",
    status: "new",
    destinationType: "",
    preferredDestination: "",
    travelDate: "",
    travelers: "",
    budget: "",
    message: "",
    packageTitle: "",
  });

  const set = (key: keyof LeadFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form, travelers: form.travelers !== "" ? Number(form.travelers) : undefined };
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      toast.success("Lead added");
      setOpen(false);
      setForm({ name: "", phone: "", email: "", source: "contact_form", status: "new", destinationType: "", preferredDestination: "", travelDate: "", travelers: "", budget: "", message: "", packageTitle: "" });
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Lead
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4" onClick={() => setOpen(false)}>
          <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-gray-900">Add New Lead</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Name *</label>
                  <input value={form.name} onChange={set("name")} className={inputCls} placeholder="Full name" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone *</label>
                  <input value={form.phone} onChange={set("phone")} className={inputCls} placeholder="9876543210" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="email@example.com" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Source</label>
                  <select value={form.source} onChange={set("source")} className={`${inputCls} appearance-none`}>
                    <option value="contact_form">Contact Form</option>
                    <option value="cta_banner">CTA Banner</option>
                    <option value="hero_form">Hero Form</option>
                    <option value="package_enquiry">Package Enquiry</option>
                    <option value="lock_in">Lock-In</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Status</label>
                  <select value={form.status} onChange={set("status")} className={`${inputCls} appearance-none`}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Destination Interest</label>
                <select value={form.destinationType} onChange={set("destinationType")} className={`${inputCls} appearance-none`}>
                  <option value="">Select…</option>
                  {DESTINATION_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Preferred Destination</label>
                  <input value={form.preferredDestination} onChange={set("preferredDestination")} className={inputCls} placeholder="e.g. Kerala, Bali" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Travel Date</label>
                  <input type="date" value={form.travelDate} onChange={set("travelDate")} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Travelers</label>
                  <input type="number" min={1} value={form.travelers} onChange={set("travelers")} className={inputCls} placeholder="2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Budget</label>
                  <select value={form.budget} onChange={set("budget")} className={`${inputCls} appearance-none`}>
                    <option value="">Select…</option>
                    {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Package / Intent</label>
                <input value={form.packageTitle} onChange={set("packageTitle")} className={inputCls} placeholder="e.g. Bali 6D Package" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message / Notes</label>
                <textarea value={form.message} onChange={set("message")} rows={2} className={`${inputCls} resize-none`} placeholder="Additional context…" />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Saving…" : "Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
