import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PackageForm } from "../_components/PackageForm";

export default function NewPackagePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/packages"
          className="p-2 text-gray-500 hover:text-primary rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Package</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to create a new travel package</p>
        </div>
      </div>

      <PackageForm />
    </div>
  );
}
