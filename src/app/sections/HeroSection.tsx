"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search, Calendar, Users, MapPin, ChevronDown } from "lucide-react";
import { DESTINATION_TYPES } from "@/app/lib/constants";

export function HeroSection() {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [travelers, setTravelers] = useState("2");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-[88vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/hero-bg.jpg" alt="Beautiful beach destination" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/10" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-32">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-xs font-medium mb-5"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            India&apos;s Most Trusted Travel Companion
          </motion.span>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4"
          >
            Smart Planning.<br />
            <span className="text-accent">Seamless Travel.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="text-base text-white/75 max-w-lg mx-auto leading-relaxed"
          >
            From spiritual yatras to romantic getaways, handcrafted journeys across India & beyond.
          </motion.p>
        </div>

        {/* Search Box - Centered at bottom like Thomas Cook */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-4 sm:p-5 max-w-3xl mx-auto"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 ml-1">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -tranprimary-y-1/2 w-4 h-4 text-text-muted" />
                <select value={destination} onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-sand border border-text-muted rounded-xl text-sm text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                >
                  <option value="">Where do you want to go?</option>
                  {DESTINATION_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -tranprimary-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 relative">
              <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 ml-1">Travel Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -tranprimary-y-1/2 w-4 h-4 text-text-muted" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-10 pr-3 py-2.5 bg-sand border border-text-muted rounded-xl text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="sm:w-36">
              <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 ml-1">Travelers</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -tranprimary-y-1/2 w-4 h-4 text-text-muted" />
                <select value={travelers} onChange={(e) => setTravelers(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-sand border border-text-muted rounded-xl text-sm text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                >
                  {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n} {n===1?"Person":"People"}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -tranprimary-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>

            <div className="sm:w-auto flex items-end">
              <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-accent text-white font-semibold rounded-xl hover:brightness-110 transition-all shadow-button flex items-center justify-center gap-2 h-[42px]">
                <Search className="w-4 h-4" />
                <span className="sm:hidden">Search</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
