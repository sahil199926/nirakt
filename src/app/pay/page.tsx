import type { Metadata } from "next";
import { connectDB } from "@/lib/db/connect";
import { Package } from "@/models/Package";
import { QRCode } from "@/models/QRCode";
import { StaticHeader } from "@/app/components/StaticHeader";
import { FooterSection } from "@/app/sections/FooterSection";
import { PayForm } from "./_components/PayForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pay & Book | Nirakt Travels",
  description: "Confirm your booking by scanning the QR code and completing your payment.",
};

async function getData() {
  try {
    await connectDB();
    const [packages, qrCodes] = await Promise.all([
      Package.find({ isActive: true })
        .sort({ title: 1 })
        .select("title slug price lockInAmount duration")
        .lean(),
      QRCode.find({ isActive: true })
        .sort({ sortOrder: 1, createdAt: 1 })
        .limit(2)
        .select("label upiId image")
        .lean(),
    ]);
    return { packages, qrCodes };
  } catch {
    return { packages: [], qrCodes: [] };
  }
}

export default async function PayPage() {
  const { packages, qrCodes } = await getData();

  const serializedPackages = packages.map((p) => ({
    _id: String(p._id),
    slug: p.slug,
    title: p.title,
    price: p.price,
    lockInAmount: p.lockInAmount ?? null,
    duration: p.duration,
  }));

  const serializedQRCodes = qrCodes.map((q) => ({
    _id: String(q._id),
    label: q.label,
    upiId: q.upiId ?? "",
    image: q.image,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <StaticHeader />
      <main className="flex-1 bg-sand/30">
        <PayForm packages={serializedPackages} qrCodes={serializedQRCodes} />
      </main>
      <FooterSection />
    </div>
  );
}
