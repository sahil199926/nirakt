"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Plus, X, Loader2, CreditCard, Search, ImageIcon, RefreshCw,
  QrCode, Wallet, ArrowLeft, ExternalLink, Trash2, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

interface LockInLead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  packageTitle?: string;
  preferredDestination?: string;
  travelDate?: string;
  travelers?: number;
  budget?: string;
  message?: string;
  status: string;
  lockIn: {
    amountPaid: number;
    transactionId?: string;
    paidAt: string;
    verified: boolean;
  };
  createdAt: string;
}

interface PaymentRecord {
  _id: string;
  leadId?: string;
  leadName?: string;
  leadPhone?: string;
  packageTitle?: string;
  amount: number;
  method: string;
  status: string;
  transactionId?: string;
  notes?: string;
  proofImage?: string;
  paidAt: string;
  addedManually: boolean;
}

interface LeadDetail {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  packageTitle?: string;
  preferredDestination?: string;
  destinationType?: string;
  travelDate?: string;
  travelers?: number;
  budget?: string;
  message?: string;
  status: string;
  createdAt: string;
}

interface Stats {
  totalRevenue: number;
  pendingCount: number;
  totalCount: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const METHOD_LABELS: Record<string, string> = {
  razorpay: "Razorpay", upi: "UPI", cash: "Cash",
  bank_transfer: "Bank Transfer", other: "Other",
};

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-500",
};

const LEAD_STATUS_STYLES: Record<string, string> = {
  new: "bg-green-100 text-green-700",
  contacted: "bg-blue-100 text-blue-700",
  qualified: "bg-purple-100 text-purple-700",
  converted: "bg-emerald-100 text-emerald-700",
  lost: "bg-gray-100 text-gray-500",
};

function matchesSearch(p: PaymentRecord, q: string) {
  const ql = q.toLowerCase();
  return (
    p.leadName?.toLowerCase().includes(ql) ||
    p.leadPhone?.includes(q) ||
    p.transactionId?.toLowerCase().includes(ql) ||
    p.packageTitle?.toLowerCase().includes(ql)
  );
}

// ── Row Component ──────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
      <span className="w-32 text-xs font-semibold text-gray-400 shrink-0">{label}</span>
      <span className="text-sm text-gray-800">{String(value)}</span>
    </div>
  );
}

// ── Payment Detail Modal ───────────────────────────────────────────────────────

function PaymentDetailModal({
  payment,
  onClose,
  onDeleted,
  onStatusChanged,
}: {
  payment: PaymentRecord;
  onClose: () => void;
  onDeleted: (id: string) => void;
  onStatusChanged: (id: string, status: string) => void;
}) {
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loadingLead, setLoadingLead] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!payment.leadId) return;
    setLoadingLead(true);
    fetch(`/api/admin/leads/${payment.leadId}`)
      .then((r) => r.json())
      .then((data) => setLead(data))
      .catch(() => null)
      .finally(() => setLoadingLead(false));
  }, [payment.leadId]);

  const handleDelete = async () => {
    if (!confirm("Delete this payment record? This cannot be undone.")) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/payments/${payment._id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Payment deleted");
      onDeleted(payment._id);
      onClose();
    } else {
      toast.error("Failed to delete");
    }
    setDeleting(false);
  };

  const setStatus = async (status: string) => {
    setUpdatingStatus(true);
    const res = await fetch(`/api/admin/payments/${payment._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success("Status updated");
      onStatusChanged(payment._id, status);
    } else {
      toast.error("Failed to update");
    }
    setUpdatingStatus(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4" onClick={onClose}>
      <div
        className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base font-bold text-gray-900">Payment Details</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Payment Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payment</p>
            <InfoRow label="Amount" value={`₹${Number(payment.amount).toLocaleString("en-IN")}`} />
            <InfoRow label="Method" value={METHOD_LABELS[payment.method] ?? payment.method} />
            <InfoRow label="Transaction ID" value={payment.transactionId} />
            <InfoRow label="Date" value={format(new Date(payment.paidAt), "dd MMM yyyy, HH:mm")} />
            <InfoRow label="Notes" value={payment.notes} />
            <InfoRow label="Package" value={payment.packageTitle} />
            <div className="flex gap-3 py-2">
              <span className="w-32 text-xs font-semibold text-gray-400 shrink-0">Status</span>
              <span className={cn("px-2.5 py-0.5 text-[10px] font-bold rounded-full capitalize", STATUS_STYLES[payment.status] ?? "bg-gray-100 text-gray-600")}>
                {payment.status}
              </span>
            </div>
          </div>

          {/* Proof Image */}
          {payment.proofImage && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Proof</p>
              <a href={payment.proofImage} target="_blank" rel="noopener noreferrer" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={payment.proofImage}
                  alt="Payment proof"
                  className="max-h-56 w-auto rounded-xl border border-gray-200 hover:opacity-90 transition-opacity"
                />
              </a>
              <a href={payment.proofImage} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
              >
                <ExternalLink className="w-3 h-3" /> Open full size
              </a>
            </div>
          )}

          {/* Lead Info */}
          {payment.leadId && (
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">Linked Lead</p>
              {loadingLead ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading lead…
                </div>
              ) : lead ? (
                <>
                  <InfoRow label="Name" value={lead.name} />
                  <InfoRow label="Phone" value={lead.phone} />
                  <InfoRow label="Email" value={lead.email} />
                  <InfoRow label="Package" value={lead.packageTitle} />
                  <InfoRow label="Destination" value={lead.preferredDestination} />
                  <InfoRow label="Travel Date" value={lead.travelDate} />
                  <InfoRow label="Travelers" value={lead.travelers} />
                  <InfoRow label="Budget" value={lead.budget} />
                  <InfoRow label="Message" value={lead.message} />
                  <div className="flex gap-3 py-2 items-center">
                    <span className="w-32 text-xs font-semibold text-gray-400 shrink-0">CRM Status</span>
                    <span className={cn("px-2.5 py-0.5 text-[10px] font-bold rounded-full capitalize", LEAD_STATUS_STYLES[lead.status] ?? "bg-gray-100 text-gray-600")}>
                      {lead.status}
                    </span>
                  </div>
                  <a href={`/admin/leads/${lead._id}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Open Lead
                  </a>
                </>
              ) : (
                <>
                  <InfoRow label="Name" value={payment.leadName} />
                  <InfoRow label="Phone" value={payment.leadPhone} />
                </>
              )}
            </div>
          )}

          {/* CRUD Actions */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</p>
            <div className="flex flex-wrap gap-2">
              {["completed", "pending", "failed", "refunded"].map((s) => (
                <button
                  key={s}
                  disabled={payment.status === s || updatingStatus}
                  onClick={() => setStatus(s)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors",
                    payment.status === s
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                  )}
                >
                  {updatingStatus && payment.status !== s ? <Loader2 className="w-3 h-3 animate-spin inline mr-1" /> : null}
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Delete Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Lock-In Lead Detail Modal ─────────────────────────────────────────────────

function LockInDetailModal({
  lead,
  onClose,
  onVerified,
}: {
  lead: LockInLead;
  onClose: () => void;
  onVerified: (id: string) => void;
}) {
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    setVerifying(true);
    const res = await fetch(`/api/admin/leads/${lead._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "lockIn.verified": true }),
    });
    if (res.ok) {
      toast.success("Payment verified");
      onVerified(lead._id);
      onClose();
    } else {
      toast.error("Failed to verify");
    }
    setVerifying(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4" onClick={onClose}>
      <div
        className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base font-bold text-gray-900">Razorpay Lock-In</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Contact */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact</p>
            <InfoRow label="Name" value={lead.name} />
            <InfoRow label="Phone" value={lead.phone} />
            <InfoRow label="Email" value={lead.email} />
          </div>

          {/* Trip Intent */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Trip Intent</p>
            <InfoRow label="Package" value={lead.packageTitle} />
            <InfoRow label="Destination" value={lead.preferredDestination} />
            <InfoRow label="Travel Date" value={lead.travelDate} />
            <InfoRow label="Travelers" value={lead.travelers} />
            <InfoRow label="Budget" value={lead.budget} />
            <InfoRow label="Message" value={lead.message} />
            <div className="flex gap-3 py-2 items-center">
              <span className="w-32 text-xs font-semibold text-gray-400 shrink-0">CRM Status</span>
              <span className={cn("px-2.5 py-0.5 text-[10px] font-bold rounded-full capitalize", LEAD_STATUS_STYLES[lead.status] ?? "bg-gray-100 text-gray-600")}>
                {lead.status}
              </span>
            </div>
          </div>

          {/* Lock-In Payment */}
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">Lock-In Payment</p>
            <InfoRow label="Amount Paid" value={`₹${lead.lockIn.amountPaid.toLocaleString("en-IN")}`} />
            <InfoRow label="Transaction ID" value={lead.lockIn.transactionId} />
            <InfoRow label="Paid At" value={format(new Date(lead.lockIn.paidAt), "dd MMM yyyy, HH:mm")} />
            <div className="flex gap-3 py-2 items-center">
              <span className="w-32 text-xs font-semibold text-gray-400 shrink-0">Verified</span>
              {lead.lockIn.verified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Yes
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full">Pending</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-2">
            {!lead.lockIn.verified && (
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                {verifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                Mark Verified
              </button>
            )}
            <a
              href={`/admin/leads/${lead._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open Full Lead
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Add Payment Modal ─────────────────────────────────────────────────────────

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

function AddPaymentModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (payment: PaymentRecord) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [leadSearch, setLeadSearch] = useState("");
  const [leadResults, setLeadResults] = useState<{ _id: string; name: string; phone: string; packageTitle?: string }[]>([]);
  const [form, setForm] = useState<AddPaymentFormValues>({
    leadName: "", leadPhone: "", packageTitle: "", amount: "",
    method: "upi", status: "completed", transactionId: "", notes: "",
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
    if (!form.amount || Number(form.amount) <= 0) { toast.error("Please enter a valid amount"); return; }
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
      onAdded(data);
      onClose();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4" onClick={onClose}>
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-gray-900">Add Payment</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Link to Lead (optional)</label>
            <div className="relative">
              <input value={leadSearch} onChange={(e) => searchLeads(e.target.value)} className={inputCls} placeholder="Search lead by name or phone…" />
              {leadResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden">
                  {leadResults.map((lead) => (
                    <button key={lead._id} type="button" onClick={() => selectLead(lead)}
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
              <input type="number" min={1} value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value ? Number(e.target.value) : "" }))}
                className={inputCls} placeholder="5000" required />
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
                {Object.entries(METHOD_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
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
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
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
  );
}

// ── Tables ─────────────────────────────────────────────────────────────────────

function PaymentsTable({
  payments,
  onRowClick,
}: {
  payments: PaymentRecord[];
  onRowClick: (p: PaymentRecord) => void;
}) {
  return (
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
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Proof</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">No payments found</td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p._id} onClick={() => onRowClick(p)} className="hover:bg-gray-50/80 cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{p.leadName ?? "—"}</p>
                    <p className="text-xs text-gray-400">{p.leadPhone ?? ""}</p>
                    {p.packageTitle && <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[180px]">{p.packageTitle}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-primary">₹{Number(p.amount).toLocaleString("en-IN")}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{METHOD_LABELS[p.method] ?? p.method}</td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2.5 py-1 text-[10px] font-bold rounded-full capitalize", STATUS_STYLES[p.status] ?? "bg-gray-100 text-gray-600")}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{format(new Date(p.paidAt), "dd MMM yyyy")}</td>
                  <td className="px-4 py-3 text-center">
                    {p.proofImage ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">
                        <ImageIcon className="w-3 h-3" /> View
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LockInTable({
  leads,
  onRowClick,
}: {
  leads: LockInLead[];
  onRowClick: (l: LockInLead) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead / Package</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid At</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">No Razorpay lock-in payments found</td>
              </tr>
            ) : (
              leads.map((l) => (
                <tr key={l._id} onClick={() => onRowClick(l)} className="hover:bg-gray-50/80 cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{l.name}</p>
                    <p className="text-xs text-gray-400">{l.phone}</p>
                    {l.packageTitle && <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[180px]">{l.packageTitle}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-purple-600">₹{l.lockIn.amountPaid.toLocaleString("en-IN")}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{l.lockIn.transactionId ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {format(new Date(l.lockIn.paidAt), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2.5 py-1 text-[10px] font-bold rounded-full capitalize", LEAD_STATUS_STYLES[l.status] ?? "bg-gray-100 text-gray-600")}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {l.lockIn.verified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Yes
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full">Pending</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Client ───────────────────────────────────────────────────────────────

export function PaymentsClient() {
  const [tab, setTab] = useState<"online" | "manual">("online");
  const [manualSubTab, setManualSubTab] = useState<"added" | "qr">("added");
  const [search, setSearch] = useState("");
  const [lockInLeads, setLockInLeads] = useState<LockInLead[]>([]);
  const [manualPayments, setManualPayments] = useState<PaymentRecord[]>([]);
  const [qrPayments, setQrPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, pendingCount: 0, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [selectedLead, setSelectedLead] = useState<LockInLead | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [paymentsRes, leadsRes] = await Promise.all([
        fetch("/api/admin/payments?limit=200"),
        fetch("/api/admin/leads?source=lock_in&limit=200"),
      ]);
      const [paymentsData, leadsData] = await Promise.all([paymentsRes.json(), leadsRes.json()]);

      const all: PaymentRecord[] = paymentsData.payments ?? [];
      setManualPayments(all.filter((p) => p.addedManually));
      setQrPayments(all.filter((p) => !p.addedManually));
      setStats(paymentsData.stats ?? { totalRevenue: 0, pendingCount: 0, totalCount: 0 });
      setLockInLeads(leadsData.leads ?? []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Compute lock-in total client-side
  const lockInTotal = lockInLeads.reduce((s, l) => s + (l.lockIn?.amountPaid ?? 0), 0);

  // Filtered lists
  const filteredLockIn = search
    ? lockInLeads.filter((l) => {
        const q = search.toLowerCase();
        return l.name.toLowerCase().includes(q) || l.phone.includes(search) ||
          l.lockIn?.transactionId?.toLowerCase().includes(q) ||
          l.packageTitle?.toLowerCase().includes(q);
      })
    : lockInLeads;

  const filteredManual = search ? manualPayments.filter((p) => matchesSearch(p, search)) : manualPayments;
  const filteredQr = search ? qrPayments.filter((p) => matchesSearch(p, search)) : qrPayments;

  const handlePaymentAdded = (payment: PaymentRecord) => {
    setManualPayments((prev) => [payment, ...prev]);
    setStats((s) => ({ ...s, totalCount: s.totalCount + 1 }));
  };

  const handlePaymentDeleted = (id: string) => {
    setManualPayments((prev) => prev.filter((p) => p._id !== id));
    setQrPayments((prev) => prev.filter((p) => p._id !== id));
    setStats((s) => ({ ...s, totalCount: Math.max(0, s.totalCount - 1) }));
  };

  const handlePaymentStatusChanged = (id: string, status: string) => {
    const update = (prev: PaymentRecord[]) =>
      prev.map((p) => (p._id === id ? { ...p, status } : p));
    setManualPayments(update);
    setQrPayments(update);
    setSelectedPayment((prev) => (prev?._id === id ? { ...prev, status } : prev));
  };

  const handleLeadVerified = (id: string) => {
    setLockInLeads((prev) =>
      prev.map((l) => l._id === id ? { ...l, lockIn: { ...l.lockIn, verified: true } } : l)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
            <p className="text-sm text-gray-500 mt-0.5">{stats.totalCount} payment records · {lockInLeads.length} lock-in leads</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchAll} className="p-2 text-gray-500 hover:text-primary rounded-xl hover:bg-gray-100 transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Payment
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Payment Revenue</p>
            <p className="text-xl font-bold text-primary">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
            <p className="text-xs text-gray-400 mt-0.5">Completed payments</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Lock-In Total</p>
            <p className="text-xl font-bold text-purple-600">₹{lockInTotal.toLocaleString("en-IN")}</p>
            <p className="text-xs text-gray-400 mt-0.5">{lockInLeads.length} Razorpay deposits</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Records</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">All payment records</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pending</p>
            <p className="text-xl font-bold text-orange-500">{stats.pendingCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">Awaiting confirmation</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setTab("online")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors",
                tab === "online" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Wallet className="w-3.5 h-3.5" /> Online Payment
            </button>
            <button
              onClick={() => setTab("manual")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors",
                tab === "manual" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <CreditCard className="w-3.5 h-3.5" /> Manual Payment
            </button>
          </div>

          {tab === "manual" && (
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setManualSubTab("added")}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                  manualSubTab === "added" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                Manually Added
              </button>
              <button
                onClick={() => setManualSubTab("qr")}
                className={cn(
                  "flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                  manualSubTab === "qr" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <QrCode className="w-3 h-3" /> QR Paid
              </button>
            </div>
          )}

          <div className="relative sm:ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full sm:w-56 pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Tab content */}
        {tab === "online" && (
          <div>
            <p className="text-xs text-gray-400 mb-3">Razorpay lock-in deposits — {filteredLockIn.length} records</p>
            <LockInTable leads={filteredLockIn} onRowClick={setSelectedLead} />
          </div>
        )}

        {tab === "manual" && manualSubTab === "added" && (
          <div>
            <p className="text-xs text-gray-400 mb-3">Admin-added payments — {filteredManual.length} records</p>
            <PaymentsTable payments={filteredManual} onRowClick={setSelectedPayment} />
          </div>
        )}

        {tab === "manual" && manualSubTab === "qr" && (
          <div>
            <p className="text-xs text-gray-400 mb-3">QR code payments from /pay page — {filteredQr.length} records</p>
            <PaymentsTable payments={filteredQr} onRowClick={setSelectedPayment} />
          </div>
        )}
      </div>

      {/* Add Payment Modal */}
      {showAddModal && (
        <AddPaymentModal onClose={() => setShowAddModal(false)} onAdded={handlePaymentAdded} />
      )}

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onDeleted={handlePaymentDeleted}
          onStatusChanged={handlePaymentStatusChanged}
        />
      )}

      {/* Lock-In Lead Detail Modal */}
      {selectedLead && (
        <LockInDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onVerified={handleLeadVerified}
        />
      )}
    </>
  );
}
