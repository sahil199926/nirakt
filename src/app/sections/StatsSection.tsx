"use client";

import { ScrollReveal } from "@/app/components/ScrollReveal";
import { AnimatedCounter } from "@/app/components/AnimatedCounter";
import { STATS } from "@/app/lib/constants";

export function StatsSection() {
  return (
    <section className="py-10 md:py-12 bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.08}>
              <div className="flex flex-col items-center text-center">
                <stat.icon className="w-5 h-5 text-primary/50 mb-2.5" />
                <span className="text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} duration={2000} />
                </span>
                <span className="text-xs text-text-muted mt-1">{stat.label}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
