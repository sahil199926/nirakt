"use client";

import { useState, useMemo } from "react";
import { PackageCard, PackageCardData } from "@/components/services/PackageCard";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

const SERVICE_FILTERS = [
  { label: "All", value: "", slugPrefixes: [] },
  {
    label: "Couple & Romance",
    value: "couples-celebration",
    slugPrefixes: ["honeymoon", "anniversary", "luxury-couple", "beach-mountain", "location-scouting", "makeup", "cinematic", "props-themes"],
  },
  {
    label: "Corporate & Group",
    value: "corporate-group-travel",
    slugPrefixes: ["mice", "team-building", "incentive", "offsite", "heritage-visits", "science-tech", "wildlife", "cultural-immersion"],
  },
  {
    label: "Proposal & Surprise",
    value: "proposal-surprise-planning",
    slugPrefixes: ["private-yacht", "boat-dinner", "rooftop-dining", "poolside", "surprise-birthday", "cinematic-photo", "drone", "props-theme"],
  },
  {
    label: "Leisure & Vacation",
    value: "leisure-vacation-international",
    slugPrefixes: ["family-holidays", "beach-holidays", "honeymoon-packages", "cultural-travel", "southeast-asia", "europe", "dubai", "customized"],
  },
  {
    label: "Destination Wedding",
    value: "destination-wedding-events",
    slugPrefixes: ["venue-theme", "guest-management", "entertainment", "palace-wedding", "beach-wedding", "luxury-resort-wedding", "heritage-cultural"],
  },
];

const SORT_OPTIONS = [
  { label: "Featured First", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Highest Rated", value: "rating" },
];

interface PackagesFilterClientProps {
  packages: PackageCardData[];
}

export function PackagesFilterClient({ packages }: PackagesFilterClientProps) {
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const filtered = useMemo(() => {
    let result = packages;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(q) ||
          pkg.description.toLowerCase().includes(q) ||
          pkg.destinations.some((d) => d.toLowerCase().includes(q))
      );
    }

    if (serviceFilter) {
      const filter = SERVICE_FILTERS.find((f) => f.value === serviceFilter);
      if (filter && filter.slugPrefixes.length > 0) {
        result = result.filter((pkg) =>
          pkg.categorySlugs?.some((s: string) =>
            filter.slugPrefixes.some((prefix) => s.startsWith(prefix))
          )
        );
      }
    }

    return [...result].sort((a, b) => {
      if (sortBy === "featured") return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });
  }, [packages, search, serviceFilter, sortBy]);

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-sand p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search packages, destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-sand border border-transparent rounded-xl text-sm text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-text-muted" />
            </button>
          )}
        </div>

        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full sm:w-48 pl-10 pr-8 py-2.5 bg-sand border border-transparent rounded-xl text-sm text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          >
            {SERVICE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-44 pl-4 pr-8 py-2.5 bg-sand border border-transparent rounded-xl text-sm text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-text-muted mb-4">
        Showing <span className="font-semibold text-primary">{filtered.length}</span> package{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-sand/30 rounded-2xl">
          <p className="text-text-muted text-base mb-1 font-medium">No packages match your search</p>
          <p className="text-sm text-text-muted">Try different keywords or clear your filters</p>
          <button
            onClick={() => { setSearch(""); setServiceFilter(""); }}
            className="mt-4 px-5 py-2 text-sm font-medium text-primary bg-white border border-sand rounded-full hover:bg-sand transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
