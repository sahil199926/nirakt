import { connectDB } from "@/lib/db/connect";
import { Lead } from "@/models/Lead";
import { Payment } from "@/models/Payment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { name, phone, email, packageId, packageTitle, packageSlug,
          travelDate, travelers, message, amount,
          transactionId, proofImage, proofImagePublicId } = body;

  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!phone?.trim()) return NextResponse.json({ error: "Phone is required" }, { status: 400 });
  if (!amount || Number(amount) <= 0) return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });

  await connectDB();

  const lead = await Lead.create({
    name: name.trim(),
    phone: phone.trim(),
    email: email?.trim() || undefined,
    source: "qr_payment",
    isLockIn: false,
    travelDate: travelDate || undefined,
    travelers: travelers ? Number(travelers) : undefined,
    message: message?.trim() || undefined,
    packageId: packageId || undefined,
    packageTitle: packageTitle || undefined,
    status: "new",
  });

  const payment = await Payment.create({
    leadId: lead._id,
    leadName: lead.name,
    leadPhone: lead.phone,
    packageId: packageId || undefined,
    packageTitle: packageTitle || undefined,
    amount: Number(amount),
    currency: "INR",
    method: "upi",
    status: "pending",
    transactionId: transactionId?.trim() || undefined,
    proofImage: proofImage || undefined,
    proofImagePublicId: proofImagePublicId || undefined,
    addedManually: false,
  });

  return NextResponse.json({
    ok: true,
    leadId: String(lead._id),
    paymentId: String(payment._id),
    packageSlug: packageSlug || null,
  }, { status: 201 });
}
