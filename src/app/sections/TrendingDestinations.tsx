"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TRENDING_DESTINATIONS } from "@/app/lib/constants";
import { cn } from "@/lib/utils";

export function TrendingDestinations() {
  const [activeTab, setActiveTab] = useState<"domestic" | "international">("domestic");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const destinations = TRENDING_DESTINATIONS[activeTab];

  return (
    <section id="destinations" className="py-14 md:py-18 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-primary">Trending Destinations</h2>
          <div className="flex items-center gap-1 bg-sand p-1 rounded-full">
            <button
              onClick={() => setActiveTab("domestic")}
              className={cn(
                "px-5 py-2 text-sm font-medium rounded-full transition-all",
                activeTab === "domestic"
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-muted hover:text-primary"
              )}
            >
              Domestic
            </button>
            <button
              onClick={() => setActiveTab("international")}
              className={cn(
                "px-5 py-2 text-sm font-medium rounded-full transition-all",
                activeTab === "international"
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-muted hover:text-primary"
              )}
            >
              International
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -tranprimary-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all border border-sand"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-12 snap-x snap-mandatory pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {destinations.map((dest, index) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex-shrink-0 snap-center"
              >
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group block w-[160px] md:w-[180px]"
                >
                  <div className="relative h-[220px] md:h-[260px] rounded-[40px] overflow-hidden shadow-card group-hover:shadow-card-hover transition-all duration-300">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="180px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <span className="text-white font-semibold text-sm md:text-base drop-shadow-lg">
                        {dest.name}
                      </span>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -tranprimary-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all border border-sand"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
