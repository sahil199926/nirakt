import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { Location } from "@/models/Location";
import { LocationsTableClient } from "./_components/LocationsTableClient";

export const dynamic = "force-dynamic";

export default async function LocationMasterPage() {
  await connectDB();
  const locations = await Location.find().sort({ isTrending: -1, name: 1 }).lean();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Location Master</h1>
          <p className="text-sm text-gray-500 mt-0.5">{locations.length} locations total</p>
        </div>
        <Link
          href="/admin/location-master/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          + Add Location
        </Link>
      </div>

      <LocationsTableClient locations={JSON.parse(JSON.stringify(locations))} />
    </div>
  );
}
