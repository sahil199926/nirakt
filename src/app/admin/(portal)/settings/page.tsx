import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Admin } from "@/models/Admin";
import { format } from "date-fns";
import { CreateAdminForm } from "./_components/CreateAdminForm";
import { ToggleAdminStatus } from "./_components/ToggleAdminStatus";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();

  if (session?.user?.role !== "super_admin") {
    redirect("/admin/dashboard");
  }

  await connectDB();
  const admins = await Admin.find().sort({ createdAt: 1 }).lean();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage admin users</p>
      </div>

      {/* Admin list */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-800">Admin Users</p>
        </div>
        <div className="divide-y divide-gray-50">
          {admins.map((admin) => (
            <div key={String(admin._id)} className="flex items-center gap-4 px-5 py-3.5">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                {admin.name[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{admin.name}</p>
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                    admin.role === "super_admin" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"
                  }`}>
                    {admin.role === "super_admin" ? "Super Admin" : "Editor"}
                  </span>
                  {!admin.isActive && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-600">Inactive</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{admin.email}</p>
                {admin.lastLoginAt && (
                  <p className="text-[10px] text-gray-300">Last login: {format(new Date(admin.lastLoginAt), "dd MMM yyyy")}</p>
                )}
              </div>
              {String(admin._id) !== session?.user?.id && (
                <ToggleAdminStatus
                  adminId={String(admin._id)}
                  isActive={admin.isActive}
                  name={admin.name}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create admin */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-sm font-bold text-gray-800 mb-4">Create Admin User</p>
        <CreateAdminForm />
      </div>
    </div>
  );
}
