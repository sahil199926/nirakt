"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { PayForm } from "./PayForm";

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

interface PayData {
  packages: PackageOption[];
  qrCodes: QRCodeOption[];
}

export function PayClient() {
  const [data, setData] = useState<PayData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/pay/init", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json() as Promise<PayData>;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-gray-500">
          Couldn&apos;t load the payment page. Please refresh and try again.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-xs">Loading payment details…</p>
      </div>
    );
  }

  return <PayForm packages={data.packages} qrCodes={data.qrCodes} />;
}
