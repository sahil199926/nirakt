"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Category {
  name: string;
  slug: string;
  children?: Category[];
}

interface CategorySidebarProps {
  categories: Category[];
  selectedSlugs: string[];
  onSelectionChange: (slugs: string[]) => void;
  popularDestinations: string[];
  hiddenGems?: string[];
}

function CategoryItem({
  category,
  selectedSlugs,
  onToggle,
}: {
  category: Category;
  selectedSlugs: string[];
  onToggle: (slug: string) => void;
}) {
  const hasChildren = category.children && category.children.length > 0;
  const isParentSelected = selectedSlugs.includes(category.slug);
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mb-1">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggle(category.slug)}
          className={cn(
            "flex-1 text-left text-sm font-semibold py-2 px-3 rounded-lg transition-colors",
            isParentSelected
              ? "bg-primary text-white"
              : "text-primary hover:bg-sand"
          )}
        >
          {category.name}
        </button>
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-md text-text-muted hover:bg-sand transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform", expanded && "rotate-180")} />
          </button>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="ml-3 mt-1 border-l-2 border-sand pl-3 space-y-0.5">
          {category.children!.map((child) => {
            const isChildSelected = selectedSlugs.includes(child.slug);
            return (
              <button
                key={child.slug}
                onClick={() => onToggle(child.slug)}
                className={cn(
                  "w-full text-left text-xs py-1.5 px-2.5 rounded-md transition-colors",
                  isChildSelected
                    ? "bg-secondary/20 text-primary font-semibold"
                    : "text-text-muted hover:bg-sand hover:text-primary"
                )}
              >
                {child.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CategorySidebar({
  categories,
  selectedSlugs,
  onSelectionChange,
  popularDestinations,
  hiddenGems,
}: CategorySidebarProps) {
  const handleToggle = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      onSelectionChange(selectedSlugs.filter((s) => s !== slug));
    } else {
      onSelectionChange([...selectedSlugs, slug]);
    }
  };

  const clearAll = () => onSelectionChange([]);

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white border border-sand rounded-2xl p-5 sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Filter by Category</h3>
          {selectedSlugs.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        <div className="space-y-1">
          {categories.map((cat) => (
            <CategoryItem
              key={cat.slug}
              category={cat}
              selectedSlugs={selectedSlugs}
              onToggle={handleToggle}
            />
          ))}
        </div>

        {popularDestinations.length > 0 && (
          <div className="mt-6 pt-5 border-t border-sand">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Popular Destinations</h4>
            <div className="flex flex-wrap gap-1.5">
              {popularDestinations.map((dest) => (
                <span
                  key={dest}
                  className="px-2.5 py-1 bg-sand text-text-muted text-xs rounded-full"
                >
                  {dest}
                </span>
              ))}
            </div>
          </div>
        )}

        {hiddenGems && hiddenGems.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">Hidden Gems</h4>
            <div className="flex flex-wrap gap-1.5">
              {hiddenGems.map((gem) => (
                <span
                  key={gem}
                  className="px-2.5 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
                >
                  {gem}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
