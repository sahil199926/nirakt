import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Lead } from "@/models/Lead";
import { AdminSidebar } from "@/app/admin/_components/AdminSidebar";
import { AdminTopbar } from "@/app/admin/_components/AdminTopbar";
import { Toaster } from "sonner";

export default async function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  await connectDB();
  const newLeadCount = await Lead.countDocuments({ status: "new" });

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar newLeadCount={newLeadCount} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
