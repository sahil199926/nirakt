import type { Metadata } from "next";
import { StaticHeader } from "@/app/components/StaticHeader";
import { FooterSection } from "@/app/sections/FooterSection";
import { Compass, MapPin, HeartHandshake, Headphones, Sparkles, Globe, Shield, Award, Users, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Nirakt Travels — Your Journey, Our Promise",
  description:
    "Discover Nirakt Travels — India's trusted travel companion since 2018. We craft spiritual yatras, romantic getaways, domestic & international tours with personalized care.",
};

const VALUES = [
  {
    icon: Compass,
    title: "Personalized Journeys",
    description: "Every traveler is unique. We design tailor-made packages that fit your budget, style, and dreams.",
  },
  {
    icon: MapPin,
    title: "Hidden Gems & Iconic Destinations",
    description: "From world-famous landmarks to secret, unexplored spots — we bring you experiences that others miss.",
  },
  {
    icon: HeartHandshake,
    title: "Comfort & Care",
    description: "Handpicked stays, seamless transfers, and packages that usually include meals. Travel stress-free.",
  },
  {
    icon: Headphones,
    title: "24/7 Trusted Support",
    description: "With round-the-clock support and an experienced team, we don't just plan trips — we walk with you on the journey.",
  },
  {
    icon: Sparkles,
    title: "Special Touches",
    description: "Surprise arrangements for honeymoons, anniversaries, pre-wedding trips, and couple getaways that make moments unforgettable.",
  },
  {
    icon: Globe,
    title: "Diverse Expertise",
    description: "Religious yatras, luxury escapes, corporate tours, trekking adventures, destination weddings — all under one roof.",
  },
];

const STATS = [
  { icon: Users, value: "5000+", label: "Happy Travelers" },
  { icon: MapPin, value: "100+", label: "Destinations Covered" },
  { icon: Clock, value: "7+", label: "Years of Experience" },
  { icon: Shield, value: "24/7", label: "Customer Support" },
  { icon: Award, value: "4.9", label: "Average Rating" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <StaticHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">About Nirakt Travels</h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              We are not just a travel agency — we are dream makers. Every journey is a story waiting to be written, and we are here to make it unforgettable.
            </p>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">Who We Are</h2>
            <div className="space-y-6 text-text-muted leading-relaxed">
              <p className="text-base md:text-lg">
                At <strong className="text-primary">Nirakt Travels</strong>, we believe every journey is a story waiting to be written. Founded with a passion for exploration and a commitment to excellence, we have grown into one of India&apos;s most trusted travel companions for spiritual journeys, romantic getaways, and handcrafted adventures.
              </p>
              <p>
                With a team of passionate travel experts, Nirakt Travels curates handcrafted experiences across India and abroad — whether it&apos;s the thrill of adventure in the Himalayas, a romantic escape on tropical beaches, a spiritual journey to sacred shrines, or a luxury holiday abroad.
              </p>
              <p>
                Our mission is simple: to make travel effortless, affordable, and extraordinary. From the moment you connect with us till you return home with memories, we ensure your journey is filled with comfort, discovery, and joy.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-sand">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-8 h-8 text-secondary mx-auto mb-3" />
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">What We Offer</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Domestic Escapes — Himachal, Uttarakhand, Rajasthan, Kerala, North East India & more",
                "International Holidays — Bali, Thailand, Dubai, Maldives, Singapore & beyond",
                "Couple Journeys — Honeymoon specials, Pre-wedding trips, Romantic surprises",
                "Spiritual Yatras — Chardham Yatra, Dham Yatra, Pilgrimage circuits across India",
                "Corporate & Educational Tours — Team outings, Group travel, Student trips",
                "Customized Packages — Tailor-made experiences designed around you",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 p-4 rounded-xl bg-sand/50">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                  <p className="text-text-muted text-sm md:text-base">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-sand">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-12 text-center">Why Choose Nirakt Travels?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {VALUES.map((value) => (
                <div key={value.title} className="p-6 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
                  <value.icon className="w-8 h-8 text-secondary mb-4" />
                  <h3 className="text-lg font-semibold text-primary mb-2">{value.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">Our Vision</h2>
            <p className="text-base md:text-lg text-text-muted leading-relaxed mb-8">
              At Nirakt Travels, our vision is to redefine the way people experience travel. We believe a journey is more than just moving from one place to another — it is about discovering cultures, creating memories, and finding joy in every moment.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                "Affordable yet premium experiences for every traveler",
                "Seamless journeys that blend comfort with adventure",
                "Unique itineraries featuring both hidden gems and iconic destinations",
                "Memorable stories that stay with you long after the trip ends",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 p-4 rounded-xl bg-sand/50">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                  <p className="text-text-muted text-sm md:text-base">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-text-muted leading-relaxed mt-8">
              Our ultimate dream is to make travel accessible, enriching, and extraordinary — so every traveler returns home with a heart full of happiness and a story worth sharing.
            </p>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
