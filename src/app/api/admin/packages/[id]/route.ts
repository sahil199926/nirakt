import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Package } from "@/models/Package";
import { getStorage } from "@/lib/storage";
import { revalidatePaths } from "@/lib/revalidate";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const pkg = await Package.findById(id).lean();
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(pkg);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id }  = await params;
  const body    = await req.json();
  await connectDB();

  const pkg = await Package.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true, runValidators: true }
  );
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await revalidatePaths(["/packages", `/packages/${pkg.slug}`]);
  return NextResponse.json(pkg);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const pkg = await Package.findByIdAndDelete(id);
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Clean up Cloudinary images best-effort
  const storage  = getStorage();
  const toDelete = [pkg.coverImage, ...pkg.images].filter(Boolean);
  await Promise.allSettled(toDelete.map((pid) => storage.delete(pid)));

  await revalidatePaths(["/packages", `/packages/${pkg.slug}`]);
  return NextResponse.json({ ok: true });
}
