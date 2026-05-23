import { auth }     from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Lead }      from "@/models/Lead";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const lead = await Lead.findById(id).populate("packageId", "title slug price").lean();
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id }  = await params;
  const body    = await req.json();

  // Only allow updating CRM fields — never overwrite contact data
  const allowed: Record<string, unknown> = {};
  if (body.status              !== undefined) allowed.status              = body.status;
  if (body.notes               !== undefined) allowed.notes               = body.notes;
  if (body["lockIn.verified"]  !== undefined) allowed["lockIn.verified"]  = body["lockIn.verified"];

  await connectDB();
  const lead = await Lead.findByIdAndUpdate(id, { $set: allowed }, { new: true });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();
  await Lead.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
