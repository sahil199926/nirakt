"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrendingDest {
  name: string;
  image: string;
}

interface TrendingDestinationsProps {
  domestic: TrendingDest[];
  international: TrendingDest[];
}

export function TrendingDestinations({ domestic, international }: TrendingDestinationsProps) {
  const [activeTab, setActiveTab] = useState<"domestic" | "international">("domestic");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const destinations = activeTab === "domestic" ? domestic : international;

  if (domestic.length === 0 && international.length === 0) return null;

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
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all border border-sand"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div key={activeTab} className="overflow-hidden px-12" ref={emblaRef}>
            <div className="flex gap-4">
              {destinations.map((dest) => (
                <div key={dest.name} className="flex-[0_0_160px] md:flex-[0_0_180px] min-w-0">
                  <Link
                    href={`/packages?destination=${encodeURIComponent(dest.name)}`}
                    className="group block"
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
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all border border-sand"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
