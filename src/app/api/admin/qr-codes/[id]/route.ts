import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { QRCode } from "@/models/QRCode";
import { getStorage } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  await connectDB();
  const code = await QRCode.findByIdAndUpdate(id, { $set: body }, { new: true });
  if (!code) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(code);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const code = await QRCode.findByIdAndDelete(id);
  if (!code) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (code.imagePublicId) {
    await getStorage().delete(code.imagePublicId).catch(() => null);
  }
  return NextResponse.json({ ok: true });
}
