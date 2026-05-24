"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, X, Loader2, CreditCard, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Payment {
  _id: string;
  leadName?: string;
  leadPhone?: string;
  packageTitle?: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  transactionId?: string;
  notes?: string;
  paidAt: string;
  addedManually: boolean;
}

const METHOD_LABELS: Record<string, string> = {
  razorpay: "Razorpay",
  upi: "UPI",
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  other: "Other",
};

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-500",
};

interface AddPaymentFormValues {
  leadName: string;
  leadPhone: string;
  packageTitle: string;
  amount: number | "";
  method: string;
  status: string;
  transactionId: string;
  notes: string;
  paidAt: string;
}

export function PaymentsClient({ payments: initial }: { payments: Payment[] }) {
  const router = useRouter();
  const [payments, setPayments] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [leadSearch, setLeadSearch] = useState("");
  const [leadResults, setLeadResults] = useState<{ _id: string; name: string; phone: string; packageTitle?: string }[]>([]);
  const [form, setForm] = useState<AddPaymentFormValues>({
    leadName: "",
    leadPhone: "",
    packageTitle: "",
    amount: "",
    method: "upi",
    status: "completed",
    transactionId: "",
    notes: "",
    paidAt: new Date().toISOString().split("T")[0],
  });

  const searchLeads = async (q: string) => {
    setLeadSearch(q);
    if (!q.trim()) { setLeadResults([]); return; }
    try {
      const res = await fetch(`/api/admin/leads?search=${encodeURIComponent(q)}&limit=5`);
      const data = await res.json();
      setLeadResults(data.leads ?? []);
    } catch { setLeadResults([]); }
  };

  const selectLead = (lead: { _id: string; name: string; phone: string; packageTitle?: string }) => {
    setForm((f) => ({ ...f, leadName: lead.name, leadPhone: lead.phone, packageTitle: lead.packageTitle ?? "" }));
    setLeadSearch(lead.name);
    setLeadResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      toast.success("Payment recorded");
      setPayments([data, ...payments]);
      setShowModal(false);
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = search
    ? payments.filter((p) =>
        p.leadName?.toLowerCase().includes(search.toLowerCase()) ||
        p.leadPhone?.includes(search) ||
        p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
        p.packageTitle?.toLowerCase().includes(search.toLowerCase())
      )
    : payments;

  const inputCls = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payments…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Payment
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead / Package</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Manual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  filtered.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-gray-900">{payment.leadName ?? "—"}</p>
                          <p className="text-xs text-gray-400">{payment.leadPhone ?? ""}</p>
                          {payment.packageTitle && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[180px]">{payment.packageTitle}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-primary">
                          ₹{Number(payment.amount).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {METHOD_LABELS[payment.method] ?? payment.method}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2.5 py-1 text-[10px] font-bold rounded-full capitalize", STATUS_STYLES[payment.status] ?? "bg-gray-100 text-gray-600")}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {format(new Date(payment.paidAt), "dd MMM yyyy")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {payment.addedManually && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full">Manual</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4" onClick={() => setShowModal(false)}>
          <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-gray-900">Add Payment</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Lead search */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Link to Lead (optional)</label>
                <div className="relative">
                  <input
                    value={leadSearch}
                    onChange={(e) => searchLeads(e.target.value)}
                    className={inputCls}
                    placeholder="Search lead by name or phone…"
                  />
                  {leadResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden">
                      {leadResults.map((lead) => (
                        <button
                          key={lead._id}
                          type="button"
                          onClick={() => selectLead(lead)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-sand transition-colors text-left"
                        >
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            {lead.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                            <p className="text-xs text-gray-400">{lead.phone}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Lead Name</label>
                  <input value={form.leadName} onChange={(e) => setForm((f) => ({ ...f, leadName: e.target.value }))} className={inputCls} placeholder="Name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Lead Phone</label>
                  <input value={form.leadPhone} onChange={(e) => setForm((f) => ({ ...f, leadPhone: e.target.value }))} className={inputCls} placeholder="Phone" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Package / Reason</label>
                <input value={form.packageTitle} onChange={(e) => setForm((f) => ({ ...f, packageTitle: e.target.value }))} className={inputCls} placeholder="e.g. Bali 6D Package" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Amount (INR) *</label>
                  <input
                    type="number"
                    min={1}
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value ? Number(e.target.value) : "" }))}
                    className={inputCls}
                    placeholder="5000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Payment Date *</label>
                  <input type="date" value={form.paidAt} onChange={(e) => setForm((f) => ({ ...f, paidAt: e.target.value }))} className={inputCls} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Method</label>
                  <select value={form.method} onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))} className={`${inputCls} appearance-none`}>
                    {Object.entries(METHOD_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className={`${inputCls} appearance-none`}>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Transaction ID</label>
                <input value={form.transactionId} onChange={(e) => setForm((f) => ({ ...f, transactionId: e.target.value }))} className={inputCls} placeholder="e.g. TXN123456789" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} className={`${inputCls} resize-none`} placeholder="Internal notes…" />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Saving…" : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
