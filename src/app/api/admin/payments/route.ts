import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/models/Payment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const limit = 25;
  const skip = (page - 1) * limit;
  const status = sp.get("status") ?? "";
  const search = sp.get("search") ?? "";

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { leadName: { $regex: search, $options: "i" } },
      { leadPhone: { $regex: search, $options: "i" } },
      { transactionId: { $regex: search, $options: "i" } },
    ];
  }

  const [payments, total] = await Promise.all([
    Payment.find(filter).sort({ paidAt: -1 }).skip(skip).limit(limit).lean(),
    Payment.countDocuments(filter),
  ]);

  return NextResponse.json({ payments, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await connectDB();

  const payment = await Payment.create({ ...body, addedManually: true });
  return NextResponse.json(payment, { status: 201 });
}
