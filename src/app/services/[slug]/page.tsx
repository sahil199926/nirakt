import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, MessageCircle, ArrowRight, MapPin } from "lucide-react";
import { connectDB } from "@/lib/db/connect";
import { Service } from "@/models/Service";
import { Package } from "@/models/Package";
import { StaticHeader } from "@/app/components/StaticHeader";
import { FooterSection } from "@/app/sections/FooterSection";
import { PackageListClient } from "@/components/services/PackageListClient";
import type { PackageCardData } from "@/components/services/PackageCard";
import { BRAND } from "@/app/lib/constants";

export const revalidate = 3600;

const SERVICE_SLUGS = [
  "couples-celebration",
  "corporate-group-travel",
  "proposal-surprise-planning",
  "leisure-vacation-international",
  "destination-wedding-events",
];

const SERVICE_IMAGES: Record<string, string> = {
  "couples-celebration": "/images/services/couples-celebration.jpg",
  "corporate-group-travel": "/images/services/corporate-travel.jpg",
  "proposal-surprise-planning": "/images/services/proposal-planning.jpg",
  "leisure-vacation-international": "/images/services/leisure-vacation.jpg",
  "destination-wedding-events": "/images/services/destination-wedding.jpg",
};

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

async function getServiceData(slug: string) {
  try {
    await connectDB();
    const service = await Service.findOne({ slug }).lean();
    return service;
  } catch {
    return null;
  }
}

async function getPackagesForService(categorySlugs: string[]) {
  try {
    await connectDB();
    const packages = await Package.find(
      {
        isActive: true,
        ...(categorySlugs.length > 0
          ? { categorySlugs: { $in: categorySlugs } }
          : {}),
      },
      {
        slug: 1,
        title: 1,
        shortDescription: 1,
        description: 1,
        price: 1,
        currency: 1,
        duration: 1,
        coverImage: 1,
        destinations: 1,
        highlights: 1,
        badge: 1,
        rating: 1,
        reviewCount: 1,
        isFeatured: 1,
        categorySlugs: 1,
      }
    )
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(50)
      .lean();
    return packages;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceData(slug);

  if (!service) {
    return {
      title: "Service | Nirakt Travels",
    };
  }

  return {
    title: `${service.title} | Nirakt Travels`,
    description:
      service.metaDescription ||
      `Explore our ${service.title} packages. ${service.description}`,
    keywords: `${service.title}, travel packages, ${service.popularDestinations?.join(", ")}`,
    openGraph: {
      title: `${service.title} | Nirakt Travels`,
      description: service.description,
      images: [SERVICE_IMAGES[slug] || "/images/hero-bg.jpg"],
    },
    alternates: {
      canonical: `https://www.nirakt.com/services/${slug}`,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!SERVICE_SLUGS.includes(slug)) {
    notFound();
  }

  const service = await getServiceData(slug);

  if (!service) {
    notFound();
  }

  const allCategorySlugs = service.categories?.flatMap((cat: { slug: string; children?: { slug: string }[] }) => [
    cat.slug,
    ...(cat.children?.map((c: { slug: string }) => c.slug) ?? []),
  ]) ?? [];

  const packages = await getPackagesForService(allCategorySlugs);
  const heroImage = SERVICE_IMAGES[slug] || "/images/hero-bg.jpg";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "TravelAgency",
      name: "Nirakt Travels",
      url: "https://www.nirakt.com",
    },
    areaServed: service.popularDestinations,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen flex flex-col">
        <StaticHeader />
        <main className="flex-1">
          {/* Hero */}
          <section className="relative h-[50vh] min-h-[320px] max-h-[480px] flex items-end overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src={heroImage}
                alt={service.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            </div>
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs text-white/60 mb-4" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span className="text-white/80">{service.title}</span>
              </nav>
              <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold rounded-full uppercase tracking-widest mb-3">
                {service.tagline}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-2xl">
                {service.title}
              </h1>
              <p className="mt-3 text-white/75 max-w-xl text-base leading-relaxed">
                {service.description}
              </p>
            </div>
          </section>

          {/* CTA Bar */}
          <section className="bg-primary py-4 px-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-white/80 text-sm">
                Speak to a travel expert — free consultation, no obligation.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/${BRAND.mobile.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-accent text-white text-sm font-semibold rounded-full hover:brightness-110 transition-all shadow-button"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
                <a
                  href={`tel:${BRAND.mobile.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 text-white text-sm font-medium rounded-full hover:bg-white/20 transition-all border border-white/20"
                >
                  <Phone className="w-4 h-4" /> Call Now
                </a>
              </div>
            </div>
          </section>

          {/* Packages Listing */}
          <section className="py-12 md:py-16 bg-sand/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-primary">
                    {packages.length > 0
                      ? `${packages.length} Package${packages.length > 1 ? "s" : ""} Available`
                      : "Packages Coming Soon"}
                  </h2>
                  <p className="text-sm text-text-muted mt-1">
                    Filter by category or browse all available itineraries
                  </p>
                </div>
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-secondary transition-colors"
                >
                  All Packages <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <PackageListClient
                packages={packages as unknown as PackageCardData[]}
                categories={service.categories ?? []}
                popularDestinations={service.popularDestinations ?? []}
                hiddenGems={service.hiddenGems ?? []}
              />

              {packages.length === 0 && (
                <div className="mt-8 bg-white rounded-2xl p-8 text-center border border-sand">
                  <MapPin className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-primary mb-2">
                    Bespoke Packages Available
                  </h3>
                  <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
                    We craft custom itineraries for this service. Connect with our experts to plan your perfect trip.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${BRAND.mobile.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-full hover:brightness-110 transition-all shadow-button"
                    >
                      <MessageCircle className="w-4 h-4" /> Get a Custom Quote
                    </a>
                    <a
                      href={`tel:${BRAND.mobile.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-full hover:brightness-110 transition-all"
                    >
                      <Phone className="w-4 h-4" /> Call +91 9319053504
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-secondary">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Ready to Plan Your {service.title.split("&")[0].trim()}?
              </h2>
              <p className="text-white/70 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
                Our travel experts will craft a personalized itinerary just for you. Free consultation — no commitment required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${BRAND.mobile.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-semibold rounded-full hover:brightness-110 transition-all shadow-button"
                >
                  <MessageCircle className="w-4 h-4" /> Plan on WhatsApp
                </a>
                <a
                  href={`tel:${BRAND.mobile.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-all border border-white/20"
                >
                  <Phone className="w-4 h-4" /> {BRAND.mobile}
                </a>
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-all"
                >
                  View All Packages <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>
        <FooterSection />
      </div>
    </>
  );
}
