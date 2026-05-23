import { connectDB } from "@/lib/db/connect";
import { Lead } from "@/models/Lead";
import { LeadsTable } from "./_components/LeadsTable";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params   = await searchParams;
  const page     = Number(params.page   ?? 1);
  const status   = params.status   ?? "";
  const source   = params.source   ?? "";
  const isLockIn = params.isLockIn  ?? "";
  const search   = params.search   ?? "";
  const limit    = 25;
  const skip     = (page - 1) * limit;

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (status)         filter.status   = status;
  if (source)         filter.source   = source;
  if (isLockIn === "true")  filter.isLockIn = true;
  if (isLockIn === "false") filter.isLockIn = false;
  if (search) {
    filter.$or = [
      { name:  { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [leads, total, stats] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Lead.countDocuments(filter),
    Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const statusCounts = Object.fromEntries(
    stats.map((s: { _id: string; count: number }) => [s._id, s.count])
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} leads matching filter</p>
        </div>
        <a
          href="/api/admin/leads/export"
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Export CSV
        </a>
      </div>

      <LeadsTable
        leads={JSON.parse(JSON.stringify(leads))}
        total={total}
        page={page}
        limit={limit}
        filters={{ status, source, isLockIn, search }}
        statusCounts={statusCounts}
      />
    </div>
  );
}
