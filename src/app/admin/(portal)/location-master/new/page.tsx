import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { LocationForm } from "../_components/LocationForm";

export default function NewLocationPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/location-master"
          className="p-2 text-gray-500 hover:text-primary rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Location</h1>
          <p className="text-sm text-gray-500 mt-0.5">Add a new location to the master list</p>
        </div>
      </div>
      <LocationForm />
    </div>
  );
}
