import { connectDB } from "@/lib/db/connect";
import { Package } from "@/models/Package";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PackagesTable } from "./_components/PackagesTable";

export const dynamic = "force-dynamic";

export default async function PackagesListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const page   = Number(params.page  ?? 1);
  const search = params.search ?? "";
  const limit  = 20;
  const skip   = (page - 1) * limit;

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { destinations: { $regex: search, $options: "i" } },
    ];
  }

  const [packages, total] = await Promise.all([
    Package.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Package.countDocuments(filter),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total packages</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Package
        </Link>
      </div>

      <PackagesTable
        packages={JSON.parse(JSON.stringify(packages))}
        total={total}
        page={page}
        limit={limit}
        search={search}
      />
    </div>
  );
}
