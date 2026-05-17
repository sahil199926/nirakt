"use client";

import Image from "next/image";
import { Clock, Star, ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/app/components/SectionHeading";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { FEATURED_TRIPS } from "@/app/lib/constants";

export function FeaturedTripsSection() {
  return (
    <section className="py-14 md:py-18 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="text-left">
            <SectionHeading
              label="Featured Journeys"
              title="Explore Hotel Stays"
              subtitle="Popular packages crafted by our travel experts. Limited slots available!"
              className="text-left !mx-0"
            />
          </div>
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-secondary transition-colors shrink-0 mb-1"
          >
            View All Packages <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_TRIPS.map((trip, index) => (
            <ScrollReveal key={trip.title} delay={index * 0.08}>
              <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="group block bg-white rounded-2xl overflow-hidden border border-sand hover:shadow-card-hover transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image src={trip.image} alt={trip.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-accent text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                    {trip.badge}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <span className="text-white font-semibold text-sm drop-shadow">{trip.title.split(" ")[0]}</span>
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-text-muted text-[11px] font-medium mb-1.5">
                    <Clock className="w-3 h-3" /> {trip.duration}
                  </div>
                  <h3 className="text-sm font-semibold text-primary mb-1">{trip.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-3">{trip.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-sand">
                    <div>
                      <span className="text-[10px] text-text-muted">From</span>
                      <p className="text-base font-bold text-primary">{trip.price}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold text-primary">{trip.rating}</span>
                      <span className="text-[10px] text-text-muted">({trip.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
