import { connectDB } from "@/lib/db/connect";
import { Payment } from "@/models/Payment";
import { PaymentsClient } from "./_components/PaymentsClient";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  await connectDB();

  const [payments, total, statsTotal, statsPending] = await Promise.all([
    Payment.find().sort({ paidAt: -1 }).limit(50).lean(),
    Payment.countDocuments(),
    Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, sum: { $sum: "$amount" } } },
    ]),
    Payment.countDocuments({ status: "pending" }),
  ]);

  const totalRevenue = statsTotal[0]?.sum ?? 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total payments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-primary">₹{totalRevenue.toLocaleString("en-IN")}</p>
          <p className="text-xs text-gray-400 mt-0.5">Completed payments</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Payments</p>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-400 mt-0.5">All time</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-500">{statsPending}</p>
          <p className="text-xs text-gray-400 mt-0.5">Awaiting confirmation</p>
        </div>
      </div>

      <PaymentsClient payments={JSON.parse(JSON.stringify(payments))} />
    </div>
  );
}
