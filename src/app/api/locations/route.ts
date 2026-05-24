import { connectDB } from "@/lib/db/connect";
import { Location } from "@/models/Location";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const sp = req.nextUrl.searchParams;
    const trending = sp.get("trending");

    const filter: Record<string, unknown> = { isActive: true };
    if (trending === "true") filter.isTrending = true;

    const locations = await Location.find(filter)
      .sort({ isTrending: -1, name: 1 })
      .lean();

    return NextResponse.json({ locations });
  } catch {
    return NextResponse.json({ locations: [] });
  }
}
