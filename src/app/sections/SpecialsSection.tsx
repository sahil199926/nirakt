import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/app/components/ScrollReveal";

export interface SpecialPackage {
  _id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  price: number;
  coverImage: string;
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

export function SpecialsSection({ packages }: { packages: SpecialPackage[] }) {
  if (packages.length === 0) return null;

  const [p0, p1, p2, p3] = packages;

  return (
    <section className="py-14 md:py-18 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-8">
            Nirakt Travels Specials
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {p0 && (
            <ScrollReveal className="md:row-span-2">
              <SpecialCard pkg={p0} className="h-full min-h-[340px] md:min-h-full" />
            </ScrollReveal>
          )}

          {p1 && (
            <ScrollReveal delay={0.1} className="md:col-span-2">
              <SpecialCard pkg={p1} className="min-h-[200px]" />
            </ScrollReveal>
          )}

          {p2 && (
            <ScrollReveal delay={0.15}>
              <SpecialCard pkg={p2} className="min-h-[200px]" />
            </ScrollReveal>
          )}
          {p3 && (
            <ScrollReveal delay={0.2}>
              <SpecialCard pkg={p3} className="min-h-[200px]" />
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}

function SpecialCard({ pkg, className = "" }: { pkg: SpecialPackage; className?: string }) {
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className={`group relative block rounded-3xl overflow-hidden ${className}`}
    >
      <Image
        src={pkg.coverImage}
        alt={pkg.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-white font-bold text-lg md:text-xl leading-tight mb-1 drop-shadow-lg">
            {pkg.title}
          </h3>
          {pkg.shortDescription && (
            <p className="text-white/80 text-sm drop-shadow">{pkg.shortDescription}</p>
          )}
          <p className="text-white/90 text-xs mt-2">
            Starting at <span className="font-bold text-accent">{formatPrice(pkg.price)}</span>
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-primary text-xs font-semibold rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
            View Package
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
