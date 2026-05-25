"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  CheckCircle2, ChevronDown, Upload, Loader2,
  Phone, MessageCircle, ArrowRight, Info, ExternalLink, Download, ZoomIn,
} from "lucide-react";
import { BRAND, DESTINATION_TYPES } from "@/app/lib/constants";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PackageOption {
  _id: string;
  slug: string;
  title: string;
  price: number;
  lockInAmount: number | null;
  duration: string;
}

interface QRCodeOption {
  _id: string;
  label: string;
  upiId: string;
  image: string;
}

interface PayFormProps {
  packages: PackageOption[];
  qrCodes: QRCodeOption[];
}

type Step = 1 | 2 | 3;

const inputCls = "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white";
const labelCls = "block text-xs font-semibold text-gray-700 mb-1.5";

export function PayForm({ packages, qrCodes }: PayFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ leadId: string; packageSlug: string | null } | null>(null);

  // Step 1 — Package + Details
  const [selectedPkg, setSelectedPkg] = useState<PackageOption | null>(null);
  const [pkgSearch, setPkgSearch] = useState("");
  const [pkgDropdownOpen, setPkgDropdownOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [destinationType, setDestinationType] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState("");
  const [message, setMessage] = useState("");

  // Step 2 — Payment
  const [amount, setAmount] = useState("");
  const [txnId, setTxnId] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [proofUploading, setProofUploading] = useState(false);
  const [downloadingQR, setDownloadingQR] = useState<string | null>(null);
  const [zoomedQR, setZoomedQR] = useState<QRCodeOption | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadQR = async (imageUrl: string, label: string, id: string) => {
    setDownloadingQR(id);
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${label.replace(/\s+/g, "-")}-QR.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // CORS fallback — opens image in new tab; user can long-press → Save on mobile
      window.open(imageUrl, "_blank");
      toast("Image opened in new tab — long-press to save it", { duration: 4000 });
    } finally {
      setDownloadingQR(null);
    }
  };

  const filteredPackages = pkgSearch
    ? packages.filter((p) => p.title.toLowerCase().includes(pkgSearch.toLowerCase()))
    : packages;

  const selectPackage = (pkg: PackageOption) => {
    setSelectedPkg(pkg);
    setPkgSearch(pkg.title);
    setPkgDropdownOpen(false);
    setAmount(String(pkg.lockInAmount ?? ""));
  };

  const handleProofSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5 MB"); return; }
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const goToStep2 = () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    if (!phone.trim()) { toast.error("Phone number is required"); return; }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) { toast.error("Enter the amount paid"); return; }
    setSubmitting(true);

    try {
      let proofImage = "";
      let proofImagePublicId = "";

      if (proofFile) {
        setProofUploading(true);
        const fd = new FormData();
        fd.append("file", proofFile);
        const upRes = await fetch("/api/pay/upload", { method: "POST", body: fd });
        setProofUploading(false);
        if (upRes.ok) {
          const upData = await upRes.json();
          proofImage = upData.url ?? upData.secure_url ?? "";
          proofImagePublicId = upData.publicId ?? upData.public_id ?? "";
        }
      }

      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          packageId: selectedPkg?._id,
          packageTitle: selectedPkg?.title,
          packageSlug: selectedPkg?.slug,
          destinationType: destinationType || undefined,
          travelDate: travelDate || undefined,
          travelers: travelers || undefined,
          message: message.trim() || undefined,
          amount: Number(amount),
          transactionId: txnId.trim() || undefined,
          proofImage: proofImage || undefined,
          proofImagePublicId: proofImagePublicId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setResult({ leadId: data.leadId, packageSlug: data.packageSlug });
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
      setProofUploading(false);
    }
  };

  // ── Step 3: Success ────────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">Payment Submitted!</h1>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Thank you, <strong>{name}</strong>. Our team will verify your payment within 24 hours and reach
          out on <strong>{phone}</strong> to confirm your booking.
        </p>
        <p className="text-xs text-gray-400 mb-8">
          Reference: <span className="font-mono text-gray-600">{result?.leadId}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {result?.packageSlug && (
            <Link
              href={`/packages/${result.packageSlug}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              View Package <ExternalLink className="w-4 h-4" />
            </Link>
          )}
          <a
            href={`https://wa.me/${BRAND.mobile.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I just submitted payment. Reference: ${result?.leadId}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Share on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Page title */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Pay & Confirm Booking</h1>
        <p className="text-gray-500 text-sm">Scan the QR code, pay the booking deposit, and we'll confirm your trip.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {[
          { n: 1, label: "Your Details" },
          { n: 2, label: "Pay" },
        ].map(({ n, label }) => (
          <div key={n} className="flex items-center gap-2">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
              step >= n ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
            )}>
              {n}
            </div>
            <span className={cn("text-sm font-medium hidden sm:block", step >= n ? "text-primary" : "text-gray-400")}>
              {label}
            </span>
            {n < 2 && <div className={cn("w-10 h-px", step > n ? "bg-primary" : "bg-gray-200")} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Main form ─────────────────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-5">

          {step === 1 && (
            <>
              {/* Package selector */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Select Package</h2>

                <div className="relative">
                  <label className={labelCls}>Package <span className="text-gray-400 font-normal">(optional)</span></label>
                  <div className="relative">
                    <input
                      value={pkgSearch}
                      onChange={(e) => { setPkgSearch(e.target.value); setPkgDropdownOpen(true); setSelectedPkg(null); }}
                      onFocus={() => setPkgDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setPkgDropdownOpen(false), 150)}
                      className={inputCls}
                      placeholder="Search or select a package…"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {pkgDropdownOpen && filteredPackages.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-20 bg-white border border-gray-200 rounded-xl shadow-xl mt-1 max-h-56 overflow-y-auto">
                      {filteredPackages.map((pkg) => (
                        <button
                          key={pkg._id}
                          type="button"
                          onMouseDown={() => selectPackage(pkg)}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-sand transition-colors text-left border-b border-gray-50 last:border-0"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{pkg.title}</p>
                            <p className="text-xs text-gray-400">{pkg.duration}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-primary">₹{pkg.price.toLocaleString("en-IN")}</p>
                            {pkg.lockInAmount && (
                              <p className="text-[10px] text-gray-400">Deposit ₹{pkg.lockInAmount.toLocaleString("en-IN")}</p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedPkg && (
                  <div className="flex items-center justify-between p-3.5 bg-primary/5 border border-primary/20 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-primary">{selectedPkg.title}</p>
                      <p className="text-xs text-gray-500">{selectedPkg.duration}</p>
                    </div>
                    <Link
                      href={`/packages/${selectedPkg.slug}`}
                      target="_blank"
                      className="text-xs text-primary hover:text-secondary flex items-center gap-1 transition-colors"
                    >
                      Details <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Contact details */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Your Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Name *</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Rahul Sharma" />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number *</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+91 98765 43210" type="tel" />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Email <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" type="email" />
                </div>
              </div>

              {/* Trip details */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Trip Details <span className="text-gray-400 font-normal text-xs normal-case">(optional)</span></h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Travel Type</label>
                    <select value={destinationType} onChange={(e) => setDestinationType(e.target.value)} className={cn(inputCls, "appearance-none")}>
                      <option value="">Select type…</option>
                      {DESTINATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Travel Date</label>
                    <input value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className={inputCls} type="date" />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Number of Travelers</label>
                  <input value={travelers} onChange={(e) => setTravelers(e.target.value)} className={inputCls} placeholder="e.g. 2" type="number" min={1} />
                </div>

                <div>
                  <label className={labelCls}>Message / Special Requests</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={cn(inputCls, "resize-none")} placeholder="Any special requests or questions…" />
                </div>
              </div>

              <button
                onClick={goToStep2}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Proceed to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {/* Summary */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-2">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">Summary</h2>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-900">{name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">{phone}</span>
                </div>
                {selectedPkg && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Package</span>
                    <span className="font-medium text-gray-900 text-right max-w-[60%]">{selectedPkg.title}</span>
                  </div>
                )}
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-primary hover:underline mt-1"
                >
                  Edit details
                </button>
              </div>

              {/* Amount */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Amount Paid *</h2>

                <div>
                  <label className={labelCls}>Amount (₹)</label>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={inputCls}
                    type="number"
                    min={1}
                    placeholder={selectedPkg?.lockInAmount ? String(selectedPkg.lockInAmount) : "Enter amount paid"}
                  />
                  {selectedPkg?.lockInAmount && (
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Booking deposit for this package is ₹{selectedPkg.lockInAmount.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

                {/* Transaction ID */}
                <div>
                  <label className={labelCls}>Transaction / UTR ID <span className="text-gray-400 font-normal">(recommended)</span></label>
                  <input
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    className={inputCls}
                    placeholder="e.g. 411234567890"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">Found in your UPI app under payment history.</p>
                </div>

                {/* Proof upload */}
                <div>
                  <label className={labelCls}>Payment Screenshot <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProofSelect}
                    className="hidden"
                  />
                  {proofPreview ? (
                    <div className="relative mt-1">
                      <Image
                        src={proofPreview}
                        alt="Payment proof"
                        width={400}
                        height={300}
                        className="w-full max-h-64 object-contain rounded-xl border border-gray-200 bg-gray-50"
                      />
                      <button
                        onClick={() => { setProofFile(null); setProofPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow text-gray-500 hover:text-red-500 transition-colors border border-gray-200"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all text-gray-400 hover:text-primary"
                    >
                      <Upload className="w-5 h-5" />
                      <span className="text-xs font-medium">Upload screenshot (JPG/PNG, max 5 MB)</span>
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white font-bold rounded-xl hover:brightness-110 transition-all disabled:opacity-60 text-base shadow-button"
              >
                {(submitting || proofUploading) && <Loader2 className="w-5 h-5 animate-spin" />}
                {proofUploading ? "Uploading proof…" : submitting ? "Submitting…" : "✓  I've Made the Payment"}
              </button>

              <p className="text-center text-xs text-gray-400 pb-2">
                Our team will verify and confirm your booking within 24 hours.
              </p>
            </>
          )}
        </div>

        {/* ── QR codes sidebar (sticky on desktop) ───────────────────────── */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-6 space-y-4">
            {qrCodes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center text-sm text-gray-400">
                <p className="font-medium mb-1">Payment QR not available</p>
                <p className="text-xs">Please contact us directly to pay.</p>
                <a
                  href={`tel:${BRAND.mobile.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-1.5 mt-3 text-primary text-xs font-semibold"
                >
                  <Phone className="w-3.5 h-3.5" /> {BRAND.mobile}
                </a>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
                  Scan to Pay
                </p>
                {/* Mobile tip */}
                <div className="flex items-start gap-2 px-1 lg:hidden">
                  <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-600">
                    On the same device? Download the QR and scan it from another phone or laptop.
                  </p>
                </div>
                {qrCodes.map((qr, idx) => (
                  <div key={qr._id} className={cn(
                    "bg-white rounded-2xl border p-4 text-center space-y-3",
                    idx === 0 ? "border-primary/40 shadow-sm" : "border-gray-200 opacity-80"
                  )}>
                    {idx === 1 && (
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Backup QR</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setZoomedQR(qr)}
                      aria-label={`Zoom QR code for ${qr.label}`}
                      className="relative aspect-square w-full max-w-[220px] mx-auto block cursor-zoom-in group rounded-lg overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <Image
                        src={qr.image}
                        alt={qr.label}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        sizes="220px"
                      />
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-200">
                        <span className="bg-white/95 rounded-full p-2.5 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 shadow-md">
                          <ZoomIn className="w-5 h-5 text-primary" />
                        </span>
                      </span>
                    </button>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{qr.label}</p>
                      {qr.upiId && (
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{qr.upiId}</p>
                      )}
                    </div>
                    {/* Download button — essential on mobile where you can't scan your own screen */}
                    <button
                      onClick={() => downloadQR(qr.image, qr.label, qr._id)}
                      disabled={downloadingQR === qr._id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/8 text-primary text-xs font-semibold rounded-xl hover:bg-primary/15 active:scale-95 transition-all disabled:opacity-50 border border-primary/20"
                    >
                      {downloadingQR === qr._id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Download className="w-3.5 h-3.5" />}
                      {downloadingQR === qr._id ? "Downloading…" : "Download QR Code"}
                    </button>
                  </div>
                ))}

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 space-y-1.5">
                  <p className="font-semibold">How to pay:</p>
                  <ol className="space-y-1 list-decimal list-inside text-amber-700">
                    <li>Open PhonePe, GPay, or any UPI app</li>
                    <li>Scan the QR code above</li>
                    <li>Enter the booking deposit amount</li>
                    <li>Note the Transaction ID from your app</li>
                    <li>Come back here and click &quot;I&apos;ve Made the Payment&quot;</li>
                  </ol>
                </div>

                <a
                  href={`https://wa.me/${BRAND.mobile.replace(/\D/g, "")}?text=${encodeURIComponent("Hi, I need help with payment on nirakt.com")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Need help? WhatsApp us
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>

    <Dialog
      open={!!zoomedQR}
      onOpenChange={(open) => {
        if (!open) setZoomedQR(null);
      }}
    >
      <DialogContent className="max-w-md sm:max-w-lg p-6">
        {zoomedQR && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">{zoomedQR.label}</DialogTitle>
              {zoomedQR.upiId && (
                <DialogDescription className="text-center font-mono">
                  {zoomedQR.upiId}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="relative aspect-square w-full bg-white rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={zoomedQR.image}
                alt={zoomedQR.label}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 90vw, 500px"
              />
            </div>
            <button
              type="button"
              onClick={() => downloadQR(zoomedQR.image, zoomedQR.label, zoomedQR._id)}
              disabled={downloadingQR === zoomedQR._id}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/8 text-primary text-xs font-semibold rounded-xl hover:bg-primary/15 active:scale-95 transition-all disabled:opacity-50 border border-primary/20"
            >
              {downloadingQR === zoomedQR._id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              {downloadingQR === zoomedQR._id ? "Downloading…" : "Download QR Code"}
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}
