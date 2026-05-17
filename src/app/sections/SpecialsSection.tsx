"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SPECIALS } from "@/app/lib/constants";
import { ScrollReveal } from "@/app/components/ScrollReveal";

export function SpecialsSection() {
  return (
    <section className="py-14 md:py-18 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-8">
            Nirakt Travels Specials
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {/* Tall card - left */}
          <ScrollReveal className="md:row-span-2">
            <SpecialCard {...SPECIALS[0]} className="h-full min-h-[340px] md:min-h-full" />
          </ScrollReveal>

          {/* Wide card - top right */}
          <ScrollReveal delay={0.1} className="md:col-span-2">
            <SpecialCard {...SPECIALS[1]} className="min-h-[200px]" />
          </ScrollReveal>

          {/* Two normal cards - bottom right */}
          <ScrollReveal delay={0.15}>
            <SpecialCard {...SPECIALS[2]} className="min-h-[200px]" />
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <SpecialCard {...SPECIALS[3]} className="min-h-[200px]" />
          </ScrollReveal>

          {/* Wide bottom card */}
          <ScrollReveal delay={0.25} className="md:col-span-3">
            <SpecialCard {...SPECIALS[4]} className="min-h-[200px]" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function SpecialCard({
  title,
  subtitle,
  price,
  cta,
  image,
  className = "",
}: {
  title: string;
  subtitle: string;
  price?: string;
  cta?: string;
  image: string;
  className?: string;
}) {
  return (
    <a
      href="#contact"
      onClick={(e) => {
        e.preventDefault();
        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
      }}
      className={`group relative block rounded-3xl overflow-hidden ${className}`}
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-white font-bold text-lg md:text-xl leading-tight mb-1 drop-shadow-lg">
            {title}
          </h3>
          <p className="text-white/80 text-sm drop-shadow">{subtitle}</p>
          {price && (
            <p className="text-white/90 text-xs mt-2">
              Starting at <span className="font-bold text-accent">{price}</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-primary text-xs font-semibold rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
            {cta || "View More"}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
}
