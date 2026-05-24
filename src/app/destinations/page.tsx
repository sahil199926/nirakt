import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Globe, ArrowRight, Sparkles, Phone, MessageCircle } from "lucide-react";
import { connectDB } from "@/lib/db/connect";
import { Location } from "@/models/Location";
import { StaticHeader } from "@/app/components/StaticHeader";
import { FooterSection } from "@/app/sections/FooterSection";
import { BRAND } from "@/app/lib/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Destinations | Nirakt Travels — Explore India & the World",
  description:
    "Explore our curated travel destinations across India and internationally. Find your dream holiday destination and browse tailored packages.",
  alternates: { canonical: "https://www.nirakt.com/destinations" },
};

async function getLocations() {
  try {
    await connectDB();
    const locations = await Location.find({ isActive: true })
      .sort({ isTrending: -1, name: 1 })
      .lean();
    return locations;
  } catch {
    return [];
  }
}

export default async function DestinationsPage() {
  const locations = await getLocations();
  const domestic = locations.filter((l) => !l.isInternational);
  const international = locations.filter((l) => l.isInternational);

  return (
    <>
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
                Explore the World with Nirakt
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Where Do You Want<br className="hidden sm:block" /> to Go?
              </h1>
              <p className="text-white/70 text-base max-w-2xl mx-auto leading-relaxed mb-8">
                Handpicked destinations across India and internationally — each with curated packages tailored for your journey.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${BRAND.mobile.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-full hover:brightness-110 transition-all shadow-button"
                >
                  <MessageCircle className="w-4 h-4" /> Plan My Trip
                </a>
                <a
                  href={`tel:${BRAND.mobile.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-all border border-white/20"
                >
                  <Phone className="w-4 h-4" /> {BRAND.mobile}
                </a>
              </div>
            </div>
          </section>

          {/* Destination grid */}
          {locations.length === 0 ? (
            <section className="py-20 bg-sand/30">
              <div className="max-w-xl mx-auto px-4 text-center">
                <MapPin className="w-14 h-14 text-secondary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-primary mb-2">Destinations Coming Soon</h2>
                <p className="text-text-muted text-sm mb-6">
                  Our team is curating amazing destinations. Reach out to plan your bespoke trip.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-full hover:brightness-110 transition-all">
                  Contact Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          ) : (
            <section className="py-12 md:py-16 bg-sand/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Domestic */}
                {domestic.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-bold text-primary">Destinations in India</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {domestic.map((loc) => (
                        <DestinationCard key={loc._id.toString()} loc={loc} />
                      ))}
                    </div>
                  </div>
                )}

                {/* International */}
                {international.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Globe className="w-5 h-5 text-secondary" />
                      <h2 className="text-xl font-bold text-primary">International Destinations</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {international.map((loc) => (
                        <DestinationCard key={loc._id.toString()} loc={loc} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-secondary">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Can&apos;t Find Your Dream Destination?
              </h2>
              <p className="text-white/70 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
                We craft fully custom itineraries to any destination in the world. Just tell us where you want to go.
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
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-all"
                >
                  Browse All Packages <ArrowRight className="w-4 h-4" />
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

function DestinationCard({ loc }: { loc: { _id: unknown; name: string; slug: string; image?: string; isTrending?: boolean; isInternational?: boolean } }) {
  const href = `/packages?destination=${encodeURIComponent(loc.name)}`;

  return (
    <Link href={href} className="group relative flex flex-col overflow-hidden rounded-2xl border border-sand bg-white hover:shadow-card transition-all hover:-translate-y-0.5">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        {loc.image ? (
          <Image
            src={loc.image}
            alt={loc.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-sand">
            <MapPin className="w-8 h-8 text-text-muted" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {loc.isTrending && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-white text-[9px] font-bold rounded-full uppercase tracking-wide">
            Trending
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-bold text-sm leading-tight">{loc.name}</p>
          <p className="text-white/70 text-[10px] flex items-center gap-1 mt-0.5">
            {loc.isInternational ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
            {loc.isInternational ? "International" : "India"}
          </p>
        </div>
      </div>
    </Link>
  );
}
