"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/app/components/SectionHeading";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { SERVICE_CARDS } from "@/app/lib/constants";
import { ChevronDown, ArrowUpRight } from "lucide-react";

export function ServicesSection() {
  const [showAll, setShowAll] = useState(false);
  const visibleCards = showAll ? SERVICE_CARDS : SERVICE_CARDS.slice(0, 4);

  return (
    <section id="services" className="py-14 md:py-18 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Our Services"
          title="Something For Every Kind of Traveler"
          subtitle="From spiritual pilgrimages to luxury beach escapes — discover your perfect journey."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 lg:mt-12">
          <AnimatePresence>
            {visibleCards.map((card, index) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.06 }} layout>
                <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="group block bg-white rounded-2xl overflow-hidden border border-sand hover:shadow-card-hover hover:-tranprimary-y-1 transition-all duration-300 h-full"
                >
                  <div className="relative h-36 overflow-hidden">
                    <Image src={card.image} alt={card.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center">
                      <card.icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-primary mb-1">{card.title}</h3>
                        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{card.description}</p>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-sand flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors mt-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="text-center mt-8">
          <button onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-sand border border-text-muted text-text-muted text-sm font-medium rounded-full hover:border-primary hover:text-primary transition-all"
          >
            {showAll ? "Show Less" : "View All Services"}
            <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </section>
  );
}
