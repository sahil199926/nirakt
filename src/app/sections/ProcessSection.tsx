"use client";

import { SectionHeading } from "@/app/components/SectionHeading";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { PROCESS_STEPS } from "@/app/lib/constants";
import { ArrowRight } from "lucide-react";

export function ProcessSection() {
  return (
    <section className="py-14 md:py-18 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="How It Works" title="Your Dream Trip, 3 Simple Steps" subtitle="We handle the details. You enjoy the journey." light />

        <div className="relative mt-10 lg:mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {PROCESS_STEPS.map((step, index) => (
              <ScrollReveal key={step.number} delay={index * 0.1}>
                <div className="relative text-center">
                  {index < PROCESS_STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t border-dashed border-white/15" />
                  )}
                  <div className="relative w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-[10px] font-bold text-white/25 tracking-[0.15em] uppercase mb-1.5 block">Step {step.number}</span>
                  <h3 className="text-base font-semibold text-white mb-1.5">{step.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-semibold rounded-full shadow-button hover:brightness-110 transition-all"
          >
            Start Your Journey <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
