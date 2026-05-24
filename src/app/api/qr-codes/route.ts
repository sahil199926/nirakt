import { connectDB } from "@/lib/db/connect";
import { QRCode } from "@/models/QRCode";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    await connectDB();
    const codes = await QRCode.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .limit(2)
      .select("label upiId image")
      .lean();
    return NextResponse.json(codes);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
