"use client";

import { SectionHeading } from "@/app/components/SectionHeading";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { WHY_CHOOSE_CARDS } from "@/app/lib/constants";

export function WhyChooseSection() {
  return (
    <section id="about" className="py-14 md:py-18 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Why Choose Nirakt"
          title="Crafted With Care, Delivered With Love"
          subtitle="We're not just travel planners — we're memory makers."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-10 lg:mt-12">
          {WHY_CHOOSE_CARDS.map((card, index) => (
            <ScrollReveal key={card.title} delay={index * 0.06}>
              <div className="group bg-white rounded-2xl p-5 lg:p-6 border border-slate-100 hover:border-primary/15 hover:shadow-card-hover transition-all duration-300 h-full">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <card.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1.5">{card.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{card.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
