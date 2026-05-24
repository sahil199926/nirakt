import { getStorage } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

// Public endpoint — no auth. Only accepts images up to 5 MB.
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "JPG/PNG/WebP only" }, { status: 422 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Max 5 MB" }, { status: 422 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await getStorage().upload(buffer, file.type, { folder: "payment-proofs" });
  return NextResponse.json(result);
}
