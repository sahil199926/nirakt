import Image from "next/image";
import Link from "next/link";
import { Clock, Star, ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/app/components/SectionHeading";
import { ScrollReveal } from "@/app/components/ScrollReveal";

export interface FeaturedPackage {
  _id: string;
  slug: string;
  title: string;
  duration: string;
  shortDescription?: string;
  price: number;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  coverImage: string;
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

export function FeaturedTripsSection({ packages }: { packages: FeaturedPackage[] }) {
  if (packages.length === 0) return null;

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
          <Link
            href="/packages"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-secondary transition-colors shrink-0 mb-1"
          >
            View All Packages <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg, index) => (
            <ScrollReveal key={pkg._id} delay={index * 0.08}>
              <Link
                href={`/packages/${pkg.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-sand hover:shadow-card-hover transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image src={pkg.coverImage} alt={pkg.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {pkg.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-accent text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                      {pkg.badge}
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <span className="text-white font-semibold text-sm drop-shadow">{pkg.title.split(" ")[0]}</span>
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-text-muted text-[11px] font-medium mb-1.5">
                    <Clock className="w-3 h-3" /> {pkg.duration}
                  </div>
                  <h3 className="text-sm font-semibold text-primary mb-1">{pkg.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-3">{pkg.shortDescription}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-sand">
                    <div>
                      <span className="text-[10px] text-text-muted">From</span>
                      <p className="text-base font-bold text-primary">{formatPrice(pkg.price)}</p>
                    </div>
                    {pkg.rating != null && pkg.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-primary">{pkg.rating}</span>
                        {pkg.reviewCount != null && pkg.reviewCount > 0 && (
                          <span className="text-[10px] text-text-muted">({pkg.reviewCount})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
