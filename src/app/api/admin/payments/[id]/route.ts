import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/models/Payment";
import { Lead } from "@/models/Lead";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  const payment = await Payment.findById(id).select("-proofImagePublicId").lean();
  if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let lead = null;
  if (payment.leadId) {
    lead = await Lead.findById(payment.leadId).select("-lockIn -notes -__v").lean();
  }

  return NextResponse.json({ payment, lead });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  await connectDB();

  const payment = await Payment.findByIdAndUpdate(id, body, { new: true });
  if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(payment);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  await Payment.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
