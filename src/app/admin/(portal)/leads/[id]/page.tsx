import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { connectDB } from "@/lib/db/connect";
import { Lead } from "@/models/Lead";
import { Payment } from "@/models/Payment";
import { auth } from "@/auth";
import { LeadActions } from "./_components/LeadActions";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  new:        { label: "New",        cls: "bg-green-100 text-green-700"   },
  contacted:  { label: "Contacted",  cls: "bg-blue-100 text-blue-700"     },
  qualified:  { label: "Qualified",  cls: "bg-purple-100 text-purple-700" },
  converted:  { label: "Converted",  cls: "bg-emerald-100 text-emerald-700" },
  lost:       { label: "Lost",       cls: "bg-gray-100 text-gray-500"     },
};

const SOURCE_LABELS: Record<string, string> = {
  contact_form:    "Contact Form",
  cta_banner:      "CTA Banner",
  hero_form:       "Hero Form",
  package_enquiry: "Package Enquiry",
  lock_in:         "Lock-In Payment",
  qr_payment:      "QR Payment",
};

function Row({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="w-36 text-xs font-semibold text-gray-500 shrink-0">{label}</span>
      <span className="text-sm text-gray-800">{String(value)}</span>
    </div>
  );
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }  = await params;
  const session = await auth();

  await connectDB();
  const lead = await Lead.findById(id).lean();
  if (!lead) notFound();

  const linkedPayment = await Payment.findOne({ leadId: lead._id })
    .select("amount method status transactionId proofImage paidAt")
    .lean();

  const isSuperAdmin = session?.user?.role === "super_admin";

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/leads" className="p-2 text-gray-500 hover:text-primary rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 truncate">{lead.name}</h1>
            {lead.isLockIn && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full shrink-0">PAID</span>
            )}
            <span className={`px-2 py-0.5 text-xs font-bold rounded-full capitalize shrink-0 ${STATUS_LABELS[lead.status]?.cls ?? "bg-gray-100 text-gray-600"}`}>
              {STATUS_LABELS[lead.status]?.label ?? lead.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {SOURCE_LABELS[lead.source] ?? lead.source} · {format(new Date(lead.createdAt), "dd MMM yyyy, HH:mm")}
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact</p>
        <Row label="Name"  value={lead.name} />
        <Row label="Phone" value={lead.phone} />
        <Row label="Email" value={lead.email} />
      </div>

      {/* Trip Intent */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Trip Intent</p>
        <Row label="Destination Type"     value={lead.destinationType} />
        <Row label="Preferred Destination" value={lead.preferredDestination} />
        <Row label="Travel Date"           value={lead.travelDate} />
        <Row label="Travelers"             value={lead.travelers} />
        <Row label="Budget"                value={lead.budget} />
        <Row label="Package"               value={lead.packageTitle} />
        <Row label="Message"               value={lead.message} />
      </div>

      {/* Lock-In Payment */}
      {lead.lockIn && (
        <div className="bg-purple-50 rounded-2xl border border-purple-200 p-5">
          <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">Lock-In Payment</p>
          <Row label="Amount Paid"    value={`₹${lead.lockIn.amountPaid.toLocaleString("en-IN")}`} />
          <Row label="Transaction ID" value={lead.lockIn.transactionId} />
          <Row label="Paid At"        value={format(new Date(lead.lockIn.paidAt), "dd MMM yyyy, HH:mm")} />
          <Row label="Verified"       value={lead.lockIn.verified ? "Yes" : "No"} />
        </div>
      )}

      {/* QR Payment */}
      {linkedPayment && (
        <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-5">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">QR Payment</p>
          <Row label="Amount"         value={`₹${Number(linkedPayment.amount).toLocaleString("en-IN")}`} />
          <Row label="Method"         value={String(linkedPayment.method).toUpperCase()} />
          <Row label="Status"         value={String(linkedPayment.status)} />
          <Row label="Transaction ID" value={linkedPayment.transactionId} />
          <Row label="Paid At"        value={format(new Date(linkedPayment.paidAt), "dd MMM yyyy, HH:mm")} />
          {linkedPayment.proofImage && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-500 mb-2">Payment Screenshot</p>
              <a href={linkedPayment.proofImage} target="_blank" rel="noopener noreferrer" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={linkedPayment.proofImage}
                  alt="Payment proof"
                  className="max-h-64 w-auto rounded-xl border border-indigo-200 hover:opacity-90 transition-opacity"
                />
              </a>
              <a href={linkedPayment.proofImage} target="_blank" rel="noopener noreferrer"
                className="text-xs text-indigo-600 hover:underline mt-1 inline-block"
              >
                Open full size ↗
              </a>
            </div>
          )}
        </div>
      )}

      {/* CRM Actions */}
      <LeadActions
        leadId={String(lead._id)}
        currentStatus={lead.status}
        currentNotes={lead.notes ?? ""}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
}
