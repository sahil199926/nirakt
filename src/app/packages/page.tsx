import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Phone, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { connectDB } from "@/lib/db/connect";
import { Package } from "@/models/Package";
import { StaticHeader } from "@/app/components/StaticHeader";
import { FooterSection } from "@/app/sections/FooterSection";
import { PackagesFilterClient } from "@/components/packages/PackagesFilterClient";
import type { PackageCardData } from "@/components/services/PackageCard";
import { BRAND, SERVICE_CARDS } from "@/app/lib/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Travel Packages | Nirakt Travels — Find Your Perfect Trip",
  description:
    "Browse our handcrafted travel packages — couple tours, corporate trips, destination weddings, leisure holidays & more. Customized itineraries across India & abroad.",
  keywords:
    "travel packages India, honeymoon packages, corporate travel, destination wedding packages, Bali package, Kerala holiday, Nirakt Travels",
  openGraph: {
    title: "Travel Packages | Nirakt Travels",
    description: "Explore curated travel packages across India & abroad. Find your perfect trip.",
    images: ["/images/hero-bg.jpg"],
  },
  alternates: {
    canonical: "https://www.nirakt.com/packages",
  },
};

async function getAllPackages() {
  try {
    await connectDB();
    const packages = await Package.find(
      { isActive: true },
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
      .lean();
    return packages;
  } catch {
    return [];
  }
}

export default async function PackagesPage() {
  const packages = await getAllPackages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Nirakt Travels — Travel Packages",
    description: "Curated travel packages across India and abroad",
    url: "https://www.nirakt.com/packages",
    numberOfItems: packages.length,
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
          <section className="bg-primary py-16 md:py-20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary rounded-full blur-3xl" />
            </div>
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-medium mb-5">
                <Sparkles className="w-3 h-3" />
                Handcrafted Travel Experiences
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Find Your Perfect<br className="hidden sm:block" /> Travel Package
              </h1>
              <p className="text-white/70 text-base max-w-2xl mx-auto leading-relaxed mb-8">
                From romantic honeymoons to corporate retreats and destination weddings — browse our curated packages across India and the world.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${BRAND.mobile.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-full hover:brightness-110 transition-all shadow-button"
                >
                  <MessageCircle className="w-4 h-4" /> Get a Custom Package
                </a>
                <a
                  href={`tel:${BRAND.mobile.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-all border border-white/20"
                >
                  <Phone className="w-4 h-4" /> {BRAND.mobile}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-all"
                >
                  Free Consultation <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Service Quick Links */}
          <section className="bg-white border-b border-sand py-5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1" style={{ scrollbarWidth: "none" }}>
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider shrink-0">Browse by:</span>
                {SERVICE_CARDS.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-sand rounded-full text-xs font-medium text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <s.icon className="w-3.5 h-3.5" />
                    {s.title.split("&")[0].trim()}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Packages listing */}
          <section className="py-12 md:py-16 bg-sand/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Suspense fallback={<div className="py-12 text-center text-text-muted text-sm">Loading packages…</div>}>
                <PackagesFilterClient packages={packages as unknown as PackageCardData[]} />
              </Suspense>

              {packages.length === 0 && (
                <div className="mt-8 bg-white rounded-2xl p-10 text-center border border-sand">
                  <Sparkles className="w-14 h-14 text-secondary mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-primary mb-2">Packages Being Curated</h2>
                  <p className="text-text-muted text-sm mb-8 max-w-md mx-auto">
                    Our travel experts are crafting amazing packages. Meanwhile, reach out for a bespoke itinerary built just for you.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${BRAND.mobile.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-full hover:brightness-110 transition-all shadow-button"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp Us
                    </a>
                    <a
                      href={`tel:${BRAND.mobile.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-full hover:brightness-110 transition-all"
                    >
                      <Phone className="w-4 h-4" /> Call Now
                    </a>
                    <Link
                      href="/#contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-full border border-sand hover:bg-sand transition-all"
                    >
                      Contact Form <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-secondary">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Can&apos;t Find What You&apos;re Looking For?
              </h2>
              <p className="text-white/70 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
                We specialize in custom-built itineraries. Tell us your dream trip and we&apos;ll craft the perfect package within 24 hours.
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
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-all"
                >
                  Get Free Quote <ArrowRight className="w-4 h-4" />
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
