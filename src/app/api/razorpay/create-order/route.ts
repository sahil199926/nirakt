import Razorpay   from "razorpay";
import { connectDB } from "@/lib/db/connect";
import { Package }   from "@/models/Package";
import { NextRequest, NextResponse } from "next/server";

const rzp = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { packageSlug } = await req.json();
    if (!packageSlug) return NextResponse.json({ error: "packageSlug required" }, { status: 400 });

    await connectDB();
    const pkg = await Package.findOne(
      { slug: packageSlug, isActive: true },
      { lockInAmount: 1, title: 1 }
    ).lean();

    if (!pkg?.lockInAmount) {
      return NextResponse.json({ error: "Package not found or no lock-in amount set" }, { status: 404 });
    }

    const order = await rzp.orders.create({
      amount:   pkg.lockInAmount * 100, // paise
      currency: "INR",
      receipt:  `lock_${String(pkg._id)}_${Date.now()}`,
      notes:    { packageTitle: pkg.title },
    });

    return NextResponse.json({
      orderId:  order.id,
      amount:   pkg.lockInAmount,
      currency: "INR",
      keyId:    process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
