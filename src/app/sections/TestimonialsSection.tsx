"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHeading } from "@/app/components/SectionHeading";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { TESTIMONIALS } from "@/app/lib/constants";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <section className="py-14 md:py-18 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading label="Traveler Stories" title="What Our Guests Say" subtitle="Real experiences from real travelers who trusted Nirakt with their journeys." />

        <ScrollReveal className="mt-8 lg:mt-10">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.name} className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(33.333%-11px)] min-w-0">
                  <div className="bg-white rounded-2xl p-5 lg:p-6 h-full flex flex-col relative border border-slate-100">
                    <Quote className="w-6 h-6 text-primary/10 mb-2" />
                    <p className="text-sm text-slate-600 leading-relaxed flex-1">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-[11px] shrink-0">
                        {testimonial.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{testimonial.name}</p>
                        <p className="text-xs text-text-muted">{testimonial.location}</p>
                      </div>
                      <div className="flex gap-0.5 shrink-0">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => emblaApi?.scrollPrev()} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors" aria-label="Previous">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5">
            {TESTIMONIALS.map((_, index) => (
              <button key={index} onClick={() => emblaApi?.scrollTo(index)}
                className={cn("h-1.5 rounded-full transition-all", selectedIndex === index ? "bg-primary w-5" : "bg-slate-200 w-1.5 hover:bg-slate-300")}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <button onClick={() => emblaApi?.scrollNext()} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors" aria-label="Next">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
