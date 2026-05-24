"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X, Loader2, Trash2, ToggleLeft, ToggleRight, QrCode } from "lucide-react";
import { ImageUploader } from "@/app/admin/_components/ImageUploader";

interface QRCodeItem {
  _id: string;
  label: string;
  upiId: string;
  image: string;
  imagePublicId: string;
  isActive: boolean;
  sortOrder: number;
}

const inputCls = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

export function QRCodesClient({ codes: initial }: { codes: QRCodeItem[] }) {
  const router = useRouter();
  const [codes, setCodes] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [upiId, setUpiId] = useState("");
  const [image, setImage] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");

  const resetForm = () => { setLabel(""); setUpiId(""); setImage(""); setImagePublicId(""); };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) { toast.error("Label is required"); return; }
    if (!image) { toast.error("QR code image is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/qr-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label.trim(), upiId: upiId.trim(), image, imagePublicId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      toast.success("QR code added");
      setCodes((prev) => [...prev, data]);
      setShowModal(false);
      resetForm();
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (code: QRCodeItem) => {
    try {
      const res = await fetch(`/api/admin/qr-codes/${code._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !code.isActive }),
      });
      if (!res.ok) throw new Error("Failed");
      setCodes((prev) => prev.map((c) => c._id === code._id ? { ...c, isActive: !c.isActive } : c));
      toast.success(code.isActive ? "Deactivated" : "Activated");
    } catch {
      toast.error("Failed to update");
    }
  };

  const deleteCode = async (code: QRCodeItem) => {
    if (!confirm(`Delete "${code.label}"? This cannot be undone.`)) return;
    setDeleting(code._id);
    try {
      const res = await fetch(`/api/admin/qr-codes/${code._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setCodes((prev) => prev.filter((c) => c._id !== code._id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const active = codes.filter((c) => c.isActive);

  return (
    <>
      <div className="space-y-5">
        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-sm text-blue-800">
          <QrCode className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
          <p>
            <strong>{active.length}</strong> active QR code{active.length !== 1 ? "s" : ""}.{" "}
            {active.length < 2
              ? `Add ${2 - active.length} more to show a backup QR on the payment page.`
              : "The top 2 active QR codes (by sort order) are shown on the payment page."}
          </p>
        </div>

        {/* Add button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add QR Code
          </button>
        </div>

        {/* QR Code cards */}
        {codes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <QrCode className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-1">No QR codes yet</p>
            <p className="text-gray-400 text-xs">Add a QR code to enable the payment page</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {codes.map((code, idx) => (
              <div
                key={code._id}
                className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                  code.isActive ? "border-gray-200" : "border-gray-100 opacity-60"
                }`}
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-50">
                  <Image
                    src={code.image}
                    alt={code.label}
                    fill
                    className="object-contain p-4"
                    sizes="300px"
                  />
                  {/* Active badge */}
                  {idx < 2 && code.isActive && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                      {idx === 0 ? "Primary" : "Backup"}
                    </span>
                  )}
                </div>

                {/* Info + actions */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{code.label}</p>
                    {code.upiId && (
                      <p className="text-xs text-gray-500 mt-0.5 font-mono">{code.upiId}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      onClick={() => toggleActive(code)}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-primary transition-colors"
                    >
                      {code.isActive
                        ? <ToggleRight className="w-4 h-4 text-green-500" />
                        : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                      {code.isActive ? "Active" : "Inactive"}
                    </button>

                    <button
                      onClick={() => deleteCode(code)}
                      disabled={deleting === code._id}
                      className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                    >
                      {deleting === code._id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add QR Code Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4"
          onClick={() => { setShowModal(false); resetForm(); }}
        >
          <div
            className="relative w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-gray-900">Add QR Code</h2>
              </div>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Label *</label>
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className={inputCls}
                  placeholder="e.g. PhonePe, GPay, Primary UPI"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">UPI ID <span className="text-gray-400 font-normal">(shown under QR)</span></label>
                <input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className={inputCls}
                  placeholder="e.g. nirakt@ybl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">QR Code Image *</label>
                <p className="text-xs text-gray-400 mb-2">Square image (1:1). Max 5 MB.</p>
                <ImageUploader
                  value={image || undefined}
                  folder="qr-codes"
                  label="Upload QR Code"
                  className="h-56"
                  maxSizeMB={5}
                  aspectConstraint={{ ratio: 1, label: "1:1", tolerance: 0.15 }}
                  onChange={(url, pid) => { setImage(url); setImagePublicId(pid); }}
                  onRemove={() => { setImage(""); setImagePublicId(""); }}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Saving…" : "Add QR Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
