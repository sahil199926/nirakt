"use client";

import { useState } from "react";
import { PackageCard, PackageCardData } from "./PackageCard";
import { CategorySidebar, Category } from "./CategorySidebar";
import { SlidersHorizontal, X } from "lucide-react";

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const filtered =
    selectedSlugs.length === 0
      ? packages
      : packages.filter((pkg) =>
          pkg.categorySlugs?.some((s: string) => selectedSlugs.includes(s))
        );

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-8">
      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-sand rounded-full text-sm font-medium text-primary"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter{selectedSlugs.length > 0 ? ` (${selectedSlugs.length})` : ""}
        </button>
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
        {selectedSlugs.length > 0 && (
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
