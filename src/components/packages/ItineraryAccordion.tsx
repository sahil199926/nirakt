"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export function ItineraryAccordion({ itinerary }: { itinerary: ItineraryDay[] }) {
  const [openDay, setOpenDay] = useState<number | null>(1);

  return (
    <div className="space-y-2">
      {itinerary.map((day) => (
        <div
          key={day.day}
          className="border border-sand rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-sand/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                {day.day}
              </span>
              <span className="text-sm font-semibold text-primary">{day.title}</span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-text-muted transition-transform shrink-0",
                openDay === day.day && "rotate-180"
              )}
            />
          </button>
          {openDay === day.day && (
            <div className="px-4 pb-4 pt-1 text-sm text-text-muted leading-relaxed bg-sand/20">
              {day.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
