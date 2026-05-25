import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Service } from "@/models/Service";
import { MAX_FEATURED_HOME_SERVICES } from "@/lib/limits";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const count = await Service.countDocuments({ isFeaturedHome: true });

  return NextResponse.json({ count, max: MAX_FEATURED_HOME_SERVICES });
}
