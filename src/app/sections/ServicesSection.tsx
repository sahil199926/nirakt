import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Heart, Building2, Gift, Plane, Gem, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/app/components/SectionHeading";
import { ScrollReveal } from "@/app/components/ScrollReveal";

export interface FeaturedService {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
}

interface ServicesSectionProps {
  services: FeaturedService[];
}

// Map known service slugs to a decorative icon; fall back to MapPin
const SERVICE_ICONS: Record<string, LucideIcon> = {
  "couples-celebration": Heart,
  "corporate-group-travel": Building2,
  "proposal-surprise-planning": Gift,
  "leisure-vacation-international": Plane,
  "destination-wedding-events": Gem,
};

export function ServicesSection({ services }: ServicesSectionProps) {
  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="py-14 md:py-18 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Our Services"
          title="Something For Every Kind of Traveler"
          subtitle="From romantic couple getaways to grand destination weddings — discover the perfect journey crafted just for you."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 lg:mt-12">
          {services.map((service, index) => {
            const Icon = SERVICE_ICONS[service.slug] ?? MapPin;
            const description = service.tagline || service.description;
            return (
              <ScrollReveal key={service.slug} delay={index * 0.06}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-sand hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 h-full"
                >
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-primary mb-1 line-clamp-1">{service.title}</h3>
                        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{description}</p>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-sand flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors mt-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="text-center mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-sand border border-text-muted text-text-muted text-sm font-medium rounded-full hover:border-primary hover:text-primary transition-all"
          >
            View All Services <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:brightness-110 transition-all shadow-button"
          >
            Browse All Packages <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
