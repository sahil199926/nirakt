import { connectDB } from "@/lib/db/connect";
import { QRCode } from "@/models/QRCode";
import { QRCodesClient } from "./_components/QRCodesClient";

export const dynamic = "force-dynamic";

export default async function QRCodesPage() {
  await connectDB();
  const codes = await QRCode.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
  const serialized = codes.map((c) => ({
    _id: String(c._id),
    label: c.label,
    upiId: c.upiId ?? "",
    image: c.image,
    imagePublicId: c.imagePublicId ?? "",
    isActive: c.isActive,
    sortOrder: c.sortOrder,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">QR Codes</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage payment QR codes shown on the public payment page. The top 2 active codes are displayed.
        </p>
      </div>
      <QRCodesClient codes={serialized} />
    </div>
  );
}
