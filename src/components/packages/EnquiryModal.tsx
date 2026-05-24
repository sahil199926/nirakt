"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Phone, Loader2, CheckCircle2, Lock } from "lucide-react";
import { DESTINATION_TYPES, BUDGET_RANGES } from "@/app/lib/constants";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageTitle?: string;
  packageSlug?: string;
  packageId?: string;
  prefillDestination?: string;
}

interface EnquiryFormValues {
  name: string;
  phone: string;
  email: string;
  destinationType: string;
  preferredDestination: string;
  travelDate: string;
  travelers: number;
  budget: string;
  message: string;
}

export function EnquiryModal({
  isOpen,
  onClose,
  packageTitle,
  packageSlug,
  packageId,
  prefillDestination,
}: EnquiryModalProps) {
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<EnquiryFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      destinationType: prefillDestination ?? "",
      preferredDestination: prefillDestination ?? "",
      travelDate: "",
      travelers: 2,
      budget: "",
      message: packageTitle ? `I'm interested in: ${packageTitle}` : "",
    },
  });

  const onSubmit = async (data: EnquiryFormValues) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "package_enquiry",
          packageId: packageId ?? undefined,
          packageTitle: packageTitle ?? undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Submission failed");
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        reset();
        onClose();
      }, 3500);
    } catch {
      // silent fail — form remains open
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-sand">
          <div>
            <h2 className="text-base font-bold text-primary">Book a Call</h2>
            {packageTitle && (
              <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{packageTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-sand transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <CheckCircle2 className="w-14 h-14 text-secondary mb-4" />
            <h3 className="text-lg font-bold text-primary mb-2">Enquiry Sent!</h3>
            <p className="text-sm text-text-muted">Our travel expert will call you within 30 minutes.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Your name"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone / WhatsApp *</label>
                <input
                  {...register("phone", { required: "Phone is required" })}
                  type="tel"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="9876543210"
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Travel Date</label>
                <input
                  {...register("travelDate")}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Travelers</label>
                <input
                  {...register("travelers", { valueAsNumber: true })}
                  type="number"
                  min={1}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Budget Range</label>
                <select
                  {...register("budget")}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                >
                  <option value="">Select budget</option>
                  {BUDGET_RANGES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message</label>
              <textarea
                {...register("message")}
                rows={3}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                placeholder="Tell us more about your trip requirements…"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-accent text-white font-semibold rounded-xl hover:brightness-110 transition-all shadow-button disabled:opacity-60"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
              ) : (
                <><Phone className="w-4 h-4" /> Book a Call</>
              )}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
              <Lock className="w-3 h-3" /> We respect your privacy. No spam, ever.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
