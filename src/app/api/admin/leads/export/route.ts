import { auth }     from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Lead }      from "@/models/Lead";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const sp      = req.nextUrl.searchParams;
  const source  = sp.get("source") ?? "";
  const status  = sp.get("status") ?? "";
  const isLockIn = sp.get("isLockIn");

  const filter: Record<string, unknown> = {};
  if (source)              filter.source   = source;
  if (status)              filter.status   = status;
  if (isLockIn === "true") filter.isLockIn = true;

  const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();

  const header = "Name,Phone,Email,Source,Status,LockIn,PackageTitle,DestType,TravelDate,Travelers,Budget,Message,CreatedAt\n";
  const rows   = leads.map((l) => [
    `"${l.name}"`,
    l.phone,
    l.email ?? "",
    l.source,
    l.status,
    l.isLockIn ? "YES" : "NO",
    `"${l.packageTitle ?? ""}"`,
    l.destinationType ?? "",
    l.travelDate ?? "",
    l.travelers  ?? "",
    `"${l.budget ?? ""}"`,
    `"${(l.message ?? "").replace(/"/g, "'")}"`,
    format(new Date(l.createdAt), "dd MMM yyyy HH:mm"),
  ].join(",")).join("\n");

  const csv = header + rows;

  return new NextResponse(csv, {
    headers: {
      "Content-Type":        "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${format(new Date(), "yyyy-MM-dd")}.csv"`,
    },
  });
}
