import { auth }       from "@/auth";
import { getStorage }  from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES      = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file     = formData.get("file") as File | null;
  const folder   = (formData.get("folder") as string) ?? "general";

  if (!file)                        return NextResponse.json({ error: "No file"              }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Invalid file type" }, { status: 422 });
  if (file.size > MAX_BYTES)        return NextResponse.json({ error: "Max 5 MB"              }, { status: 422 });

  const buffer  = Buffer.from(await file.arrayBuffer());
  const storage = getStorage();
  const result  = await storage.upload(buffer, file.type, { folder });

  return NextResponse.json(result);
}
