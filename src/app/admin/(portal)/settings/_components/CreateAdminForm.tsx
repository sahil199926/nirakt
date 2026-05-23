"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface FormValues {
  name: string;
  email: string;
  password: string;
  role: "editor" | "super_admin";
}

const inputCls = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

export function CreateAdminForm() {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { role: "editor" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res  = await fetch("/api/admin/settings/admins", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to create admin");
      toast.success("Admin user created");
      reset();
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to create admin");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Name *</label>
          <input
            {...register("name", { required: true })}
            className={inputCls}
            placeholder="Full name"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email *</label>
          <input
            {...register("email", { required: true })}
            type="email"
            className={inputCls}
            placeholder="admin@nirakt.com"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password *</label>
          <input
            {...register("password", { required: true, minLength: { value: 8, message: "Min 8 characters" } })}
            type="password"
            className={inputCls}
            placeholder="Min 8 characters"
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Role *</label>
          <select
            {...register("role")}
            className={`${inputCls} bg-white`}
          >
            <option value="editor">Editor</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Creating…" : "Create Admin"}
        </button>
      </div>
    </form>
  );
}
