import { auth }     from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Lead }      from "@/models/Lead";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const sp      = req.nextUrl.searchParams;
  const page    = Math.max(1, Number(sp.get("page")  ?? 1));
  const limit   = Math.min(100, Number(sp.get("limit") ?? 30));
  const source  = sp.get("source")  ?? "";
  const status  = sp.get("status")  ?? "";
  const isLockIn = sp.get("isLockIn");
  const search  = sp.get("search")  ?? "";
  const from    = sp.get("from")    ?? "";
  const to      = sp.get("to")      ?? "";

  const filter: Record<string, unknown> = {};
  if (source)           filter.source   = source;
  if (status)           filter.status   = status;
  if (isLockIn === "true")  filter.isLockIn = true;
  if (isLockIn === "false") filter.isLockIn = false;
  if (from || to) {
    filter.createdAt = {
      ...(from ? { $gte: new Date(from) } : {}),
      ...(to   ? { $lte: new Date(to)   } : {}),
    };
  }
  if (search) {
    filter.$or = [
      { name:  { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [leads, total, statsNew, statsLockIn, statsConverted] = await Promise.all([
    Lead.find(filter)
      .sort({ isLockIn: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("packageId", "title slug")
      .lean(),
    Lead.countDocuments(filter),
    Lead.countDocuments({ status: "new" }),
    Lead.countDocuments({ isLockIn: true }),
    Lead.countDocuments({ status: "converted" }),
  ]);

  return NextResponse.json({
    leads,
    total,
    page,
    pages: Math.ceil(total / limit),
    stats: { new: statsNew, lockIn: statsLockIn, converted: statsConverted },
  });
}
