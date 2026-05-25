import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, Phone, ArrowRight, Sparkles, ShieldCheck, HeartHandshake } from "lucide-react";
import { StaticHeader } from "@/app/components/StaticHeader";
import { FooterSection } from "@/app/sections/FooterSection";
import { SERVICE_CARDS, BRAND } from "@/app/lib/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Services | Nirakt Travels",
  description:
    "Explore Nirakt's full range of travel services — couple getaways, corporate trips, proposal planning, international holidays, and destination weddings. Handcrafted experiences across India and beyond.",
  alternates: {
    canonical: "https://www.nirakt.com/services",
  },
  openGraph: {
    title: "Our Services | Nirakt Travels",
    description:
      "From romantic honeymoons to grand destination weddings, discover travel experiences crafted for every kind of traveler.",
    images: ["/images/hero-bg.jpg"],
  },
};

const VALUE_PROPS = [
  {
    icon: Sparkles,
    title: "Handcrafted Itineraries",
    description:
      "Every trip is designed around you — your pace, your interests, your budget. No cookie-cutter tours.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Partners",
    description:
      "Vetted hotels, verified guides, and 24×7 on-trip support so you can travel worry-free.",
  },
  {
    icon: HeartHandshake,
    title: "End-to-End Planning",
    description:
      "From visas and flights to surprise moments and last-mile transfers — we handle everything.",
  },
];

export default function ServicesIndexPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <StaticHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative h-[44vh] min-h-[300px] max-h-[440px] flex items-end overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-bg.jpg"
              alt="Nirakt Travel Services"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
          </div>
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <nav
              className="flex items-center gap-2 text-xs text-white/60 mb-4"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-white/80">Services</span>
            </nav>
            <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold rounded-full uppercase tracking-widest mb-3">
              Our Services
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-2xl">
              Something For Every Kind of Traveler
            </h1>
            <p className="mt-3 text-white/75 max-w-2xl text-base leading-relaxed">
              From quiet couple escapes and corporate retreats to grand destination weddings — explore the experiences we love to plan.
            </p>
          </div>
        </section>

        {/* Intro / Value props */}
        <section className="py-12 md:py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">
                Why travel with Nirakt
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
                Travel planned with care, executed with precision
              </h2>
              <p className="mt-3 text-sm text-text-muted leading-relaxed">
                We blend local insight with hospitality experience to design trips that feel effortless from the moment you call us to the moment you come home.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {VALUE_PROPS.map((item) => (
                <div
                  key={item.title}
                  className="bg-sand/40 border border-sand rounded-2xl p-5 text-center md:text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 mx-auto md:mx-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-primary mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 md:py-16 bg-sand/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10 md:mb-12">
              <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">
                Explore
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
                Browse all our services
              </h2>
              <p className="mt-3 text-sm text-text-muted leading-relaxed">
                Tap any service to see curated packages, popular destinations and bespoke planning options.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {SERVICE_CARDS.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group block bg-white rounded-2xl overflow-hidden border border-sand hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 h-full"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <card.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-primary mb-1.5 leading-snug">
                          {card.title}
                        </h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-sand flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors mt-0.5">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:text-secondary transition-colors">
                      Explore service <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Not sure where to start?
            </h2>
            <p className="text-white/75 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
              Tell us a little about your trip and we&apos;ll put together ideas in a few hours — free consultation, no obligation.
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
  );
}
