import crypto     from "crypto";
import { connectDB } from "@/lib/db/connect";
import { Lead }      from "@/models/Lead";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      name,
      phone,
      email,
      packageId,
      packageTitle,
      destinationType,
      travelDate,
      travelers,
    } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    // Verify HMAC-SHA256 signature
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expected !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await connectDB();
    const lead = await Lead.create({
      name,
      phone,
      email:         email || undefined,
      source:        "lock_in",
      isLockIn:      true,
      packageId:     packageId  || undefined,
      packageTitle:  packageTitle || undefined,
      destinationType,
      travelDate,
      travelers,
      status:        "new",
      lockIn: {
        amountPaid:    0,
        transactionId: razorpayPaymentId,
        paidAt:        new Date(),
        verified:      true,
      },
    });

    return NextResponse.json({ success: true, leadId: lead._id });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
