"use client";

import { useState, useMemo } from "react";
import { PackageCard, PackageCardData } from "./PackageCard";
import { CategorySidebar, Category } from "./CategorySidebar";
import { SlidersHorizontal, X, MapPin, ChevronDown } from "lucide-react";

interface PackageListClientProps {
  packages: PackageCardData[];
  categories: Category[];
  popularDestinations: string[];
  hiddenGems?: string[];
}

export function PackageListClient({
  packages,
  categories,
  popularDestinations,
  hiddenGems,
}: PackageListClientProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [destinationFilter, setDestinationFilter] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const allDestinations = useMemo(() => {
    const set = new Set<string>();
    packages.forEach((pkg) => pkg.destinations?.forEach((d) => set.add(d)));
    return Array.from(set).sort();
  }, [packages]);

  const filtered = useMemo(() => {
    let result = packages;
    if (selectedSlugs.length > 0) {
      result = result.filter((pkg) =>
        pkg.categorySlugs?.some((s: string) => selectedSlugs.includes(s))
      );
    }
    if (destinationFilter) {
      result = result.filter((pkg) =>
        pkg.destinations?.some((d) => d.toLowerCase() === destinationFilter.toLowerCase())
      );
    }
    return result;
  }, [packages, selectedSlugs, destinationFilter]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-8">
      {/* Mobile filter toggle */}
      <div className="lg:hidden flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-sand rounded-full text-sm font-medium text-primary"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter{selectedSlugs.length > 0 ? ` (${selectedSlugs.length})` : ""}
        </button>
        {allDestinations.length > 0 && (
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white border border-sand rounded-full text-sm text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="">All Destinations</option>
              {allDestinations.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        )}
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex lg:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <div className="ml-auto w-72 h-full bg-white overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-primary">Filters</h3>
              <button onClick={() => setMobileSidebarOpen(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <CategorySidebar
              categories={categories}
              selectedSlugs={selectedSlugs}
              onSelectionChange={setSelectedSlugs}
              popularDestinations={popularDestinations}
              hiddenGems={hiddenGems}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <CategorySidebar
          categories={categories}
          selectedSlugs={selectedSlugs}
          onSelectionChange={setSelectedSlugs}
          popularDestinations={popularDestinations}
          hiddenGems={hiddenGems}
        />
      </div>

      {/* Package grid */}
      <div className="flex-1">
        {/* Desktop destination filter */}
        {allDestinations.length > 0 && (
          <div className="hidden lg:flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-text-muted" />
            <span className="text-sm text-text-muted">Filter by destination:</span>
            <div className="relative">
              <select
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="pl-3 pr-8 py-1.5 bg-sand border border-sand rounded-full text-sm text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">All</option>
                {allDestinations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            </div>
            {destinationFilter && (
              <button onClick={() => setDestinationFilter("")} className="text-xs text-primary hover:underline flex items-center gap-1">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        )}

        {/* Active filters */}
        {(selectedSlugs.length > 0 || destinationFilter) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSlugs.map((slug) => (
              <span
                key={slug}
                className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
              >
                {slug.replace(/-/g, " ")}
                <button onClick={() => setSelectedSlugs(selectedSlugs.filter((s) => s !== slug))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {destinationFilter && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary text-xs rounded-full font-medium">
                <MapPin className="w-3 h-3" /> {destinationFilter}
                <button onClick={() => setDestinationFilter("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-sand/30 rounded-2xl">
            <p className="text-text-muted text-base mb-2 font-medium">No packages found</p>
            <p className="text-text-muted text-sm">Try adjusting your filters or check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
