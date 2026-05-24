"use client";

import { useState, useRef } from "react";
import { useAnimationFrame } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrendingDest {
  name: string;
  image: string;
}

interface TrendingDestinationsProps {
  domestic: TrendingDest[];
  international: TrendingDest[];
}

// Fixed pixel values — must match the inline styles on the track items below.
const CARD_W = 164; // px
const GAP = 16;     // px (= gap-4)
const SPEED = 52;   // px / second

function MarqueeTrack({ destinations }: { destinations: TrendingDest[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const pausedRef = useRef(false);

  // Distance that equals exactly one full copy of the list (gap included between each card).
  const loopWidth = destinations.length * (CARD_W + GAP);

  useAnimationFrame((_, deltaMs) => {
    if (pausedRef.current) return;
    xRef.current -= (deltaMs / 1000) * SPEED;
    if (xRef.current <= -loopWidth) xRef.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${xRef.current}px)`;
    }
  });

  // Triplicate so the strip never runs out of cards even at wide viewports.
  const items = [...destinations, ...destinations, ...destinations];

  return (
    <div
      className="overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div
        ref={trackRef}
        className="flex"
        style={{ gap: `${GAP}px`, paddingBottom: "8px" /* room for hover shadow */ }}
      >
        {items.map((dest, i) => (
          <Link
            key={`${dest.name}-${i}`}
            href={`/packages?destination=${encodeURIComponent(dest.name)}`}
            draggable={false}
            className="group block flex-shrink-0 select-none"
            style={{ width: `${CARD_W}px` }}
          >
            <div className="relative rounded-[28px] overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl shadow-sm"
              style={{ height: "240px" }}
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                draggable={false}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="164px"
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              {/* Name */}
              <div className="absolute inset-x-0 bottom-0 p-3.5 text-center">
                <span className="text-white font-semibold text-sm drop-shadow-sm leading-tight block">
                  {dest.name}
                </span>
              </div>
              {/* Hover pill */}
              <div className="absolute inset-x-0 bottom-10 flex justify-center pointer-events-none">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium rounded-full border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-1 group-hover:translate-y-0">
                  View packages
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function TrendingDestinations({ domestic, international }: TrendingDestinationsProps) {
  const [activeTab, setActiveTab] = useState<"domestic" | "international">(
    domestic.length > 0 ? "domestic" : "international"
  );

  if (domestic.length === 0 && international.length === 0) return null;

  const destinations = activeTab === "domestic" ? domestic : international;

  return (
    <section id="destinations" className="py-14 md:py-20 bg-white">

      {/* Header — constrained to max-w-7xl */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1.5">
              Top picks
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
              Trending Destinations
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Tab toggle */}
            <div className="flex gap-0.5 bg-sand p-1 rounded-full">
              <button
                onClick={() => setActiveTab("domestic")}
                disabled={domestic.length === 0}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full transition-all disabled:opacity-40 disabled:pointer-events-none",
                  activeTab === "domestic"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-muted hover:text-primary"
                )}
              >
                <MapPin className="w-3 h-3" /> India
              </button>
              <button
                onClick={() => setActiveTab("international")}
                disabled={international.length === 0}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full transition-all disabled:opacity-40 disabled:pointer-events-none",
                  activeTab === "international"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-muted hover:text-primary"
                )}
              >
                <Globe className="w-3 h-3" /> International
              </button>
            </div>

            <Link
              href="/destinations"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary transition-colors"
            >
              All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Full-width marquee strip */}
      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="pl-4">
          {/* key resets x position when tab changes */}
          {destinations.length > 0 ? (
            <MarqueeTrack key={activeTab} destinations={destinations} />
          ) : (
            <p className="py-16 text-center text-sm text-text-muted">
              No trending destinations yet — check back soon!
            </p>
          )}
        </div>
      </div>

      {/* Mobile "View All" */}
      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-secondary transition-colors"
        >
          View All Destinations <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
