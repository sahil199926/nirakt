import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Package } from "@/models/Package";
import { QRCode } from "@/models/QRCode";

export const dynamic = "force-dynamic";

export async function GET() {
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

    return NextResponse.json({
      packages: packages.map((p) => ({
        _id: String(p._id),
        slug: p.slug,
        title: p.title,
        price: p.price,
        lockInAmount: p.lockInAmount ?? null,
        duration: p.duration,
      })),
      qrCodes: qrCodes.map((q) => ({
        _id: String(q._id),
        label: q.label,
        upiId: q.upiId ?? "",
        image: q.image,
      })),
    });
  } catch {
    return NextResponse.json({ packages: [], qrCodes: [] });
  }
}
