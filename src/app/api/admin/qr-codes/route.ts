import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { QRCode } from "@/models/QRCode";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const codes = await QRCode.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
  return NextResponse.json(codes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.label?.trim()) return NextResponse.json({ error: "Label is required" }, { status: 400 });
  if (!body.image) return NextResponse.json({ error: "Image is required" }, { status: 400 });

  await connectDB();
  const maxOrder = await QRCode.countDocuments();
  const code = await QRCode.create({ ...body, sortOrder: maxOrder });
  return NextResponse.json(code, { status: 201 });
}
