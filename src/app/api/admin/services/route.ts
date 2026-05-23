import { auth }     from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Service }   from "@/models/Service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const services = await Service.find().sort({ title: 1 }).lean();
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body    = await req.json();
  await connectDB();
  const service = await Service.create(body);
  return NextResponse.json(service, { status: 201 });
}
