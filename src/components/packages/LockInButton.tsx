"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";

interface LockInButtonProps {
  packageId: string;
  packageTitle: string;
  lockInAmount: number;
  className?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: Record<string, any>) => { open(): void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) { resolve(true); return; }
    const script   = document.createElement("script");
    script.id      = "razorpay-script";
    script.src     = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function LockInButton({ packageId, packageTitle, lockInAmount, className = "" }: LockInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [email,   setEmail]   = useState("");
  const [step,    setStep]    = useState<"idle" | "form" | "success">("idle");

  const handlePay = async () => {
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) { alert("Failed to load payment gateway. Try again."); setLoading(false); return; }

    try {
      const orderRes  = await fetch("/api/razorpay/create-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ packageId }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error ?? "Order creation failed");

      const rzp = new window.Razorpay({
        key:          orderData.keyId,
        amount:       orderData.amount,
        currency:     orderData.currency,
        order_id:     orderData.orderId,
        name:         "Nirakt Travels",
        description:  `Lock-In: ${packageTitle}`,
        prefill: { name, email, contact: phone },
        theme:        { color: "#1a5276" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                name, phone, email,
                packageId,
                packageTitle,
                amountPaid: lockInAmount,
              }),
            });
            if (!verifyRes.ok) {
              const vd = await verifyRes.json();
              throw new Error(vd.error ?? "Verification failed");
            }
            setStep("success");
          } catch (e: unknown) {
            alert(e instanceof Error ? e.message : "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });
      rzp.open();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Payment failed");
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-5 text-center">
        <p className="text-green-700 font-bold text-base">Package Locked In!</p>
        <p className="text-green-600 text-sm mt-1">Our travel expert will call you within 2 hours to confirm your booking.</p>
      </div>
    );
  }

  if (step === "idle") {
    return (
      <button
        onClick={() => setStep("form")}
        className={`w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-colors ${className}`}
      >
        <Lock className="w-4 h-4" />
        Lock In for ₹{lockInAmount.toLocaleString("en-IN")}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
      <p className="text-sm font-bold text-gray-800">Enter details to proceed</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name *"
        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone / WhatsApp *"
        type="tel"
        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (optional)"
        type="email"
        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      />
      <div className="flex gap-2">
        <button
          onClick={() => setStep("idle")}
          className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handlePay}
          disabled={loading || !name.trim() || !phone.trim()}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Pay ₹{lockInAmount.toLocaleString("en-IN")}
        </button>
      </div>
      <p className="text-[10px] text-gray-400 text-center">Secured by Razorpay. Lock-in amount will be adjusted in final payment.</p>
    </div>
  );
}
