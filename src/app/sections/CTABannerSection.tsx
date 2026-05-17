"use client";

import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/app/components/ScrollReveal";

export function CTABannerSection() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to Start Your Journey?</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-sm text-white/60 mb-7 max-w-md mx-auto">Speak to a travel expert today. Free consultation, no obligation. We&apos;ll call you back within 30 minutes.</p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-semibold rounded-full hover:brightness-110 transition-all shadow-button"
            >
              Get Free Quote <ArrowRight className="w-4 h-4" />
            </a>
            <a href="tel:+919319053504" className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-all border border-white/20">
              Call +91 9319053504
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
