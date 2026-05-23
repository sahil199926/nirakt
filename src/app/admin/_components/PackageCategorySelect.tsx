"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Category {
  label:        string;
  slug:         string;
  serviceSlug:  string;
  serviceTitle: string;
}

interface PackageCategorySelectProps {
  value:    string[];
  onChange: (slugs: string[]) => void;
}

export function PackageCategorySelect({ value, onChange }: PackageCategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    fetch("/api/admin/services/categories")
      .then((r) => r.json())
      .then((data) => { setCategories(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggle = (slug: string) => {
    onChange(value.includes(slug) ? value.filter((s) => s !== slug) : [...value, slug]);
  };

  if (loading) return <p className="text-sm text-gray-400">Loading categories…</p>;

  // Group by service
  const grouped = categories.reduce<Record<string, Category[]>>((acc, cat) => {
    if (!acc[cat.serviceTitle]) acc[cat.serviceTitle] = [];
    acc[cat.serviceTitle].push(cat);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([serviceTitle, cats]) => (
        <div key={serviceTitle}>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{serviceTitle}</p>
          <div className="flex flex-wrap gap-2">
            {cats.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => toggle(cat.slug)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  value.includes(cat.slug)
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary/50"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
