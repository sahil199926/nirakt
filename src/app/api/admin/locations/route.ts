import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Location } from "@/models/Location";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const sp = req.nextUrl.searchParams;
  const trending = sp.get("trending");
  const active = sp.get("active");

  const filter: Record<string, unknown> = {};
  if (trending === "true") filter.isTrending = true;
  if (active === "true") filter.isActive = true;
  if (active === "false") filter.isActive = false;

  const locations = await Location.find(filter)
    .sort({ isTrending: -1, name: 1 })
    .lean();

  return NextResponse.json({ locations });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await connectDB();

  if (!body.slug && body.name) {
    body.slug = slugify(body.name, { lower: true, strict: true });
  }

  const existing = await Location.findOne({ slug: body.slug });
  if (existing) return NextResponse.json({ error: "A location with this slug already exists" }, { status: 400 });

  const location = await Location.create(body);
  return NextResponse.json(location, { status: 201 });
}
