import type { Metadata } from "next";
import { StaticHeader } from "@/app/components/StaticHeader";
import { FooterSection } from "@/app/sections/FooterSection";
import { Shield, Lock, Award, Users, Headphones, CheckCircle, FileCheck, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Trust & Safety | Nirakt Travels",
  description:
    "Nirakt Travels is a registered travel agency committed to transparency, security, and customer satisfaction. Learn why thousands trust us with their journeys.",
};

const TRUST_PILLARS = [
  {
    icon: Shield,
    title: "Registered & Verified",
    description: "Nirakt Travels by Yantu Ventures Pvt. Ltd. is a legally registered company. We operate with full transparency and compliance with Indian travel regulations.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "All transactions are processed through PCI-DSS compliant payment gateways. Your financial data is encrypted and never stored on our servers.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "We personally inspect and verify every hotel, transport provider, and activity partner before including them in our packages.",
  },
  {
    icon: Users,
    title: "Experienced Team",
    description: "Our travel experts have 7+ years of experience crafting seamless itineraries across India and 15+ international destinations.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Real humans, not bots. Our dedicated support team is available round the clock to assist you before, during, and after your trip.",
  },
  {
    icon: FileCheck,
    title: "Transparent Pricing",
    description: "No hidden charges, no last-minute surprises. What you see is what you pay. All inclusions and exclusions are clearly listed upfront.",
  },
];

const COMMITMENTS = [
  "Handpicked, verified accommodations at every destination",
  "Licensed and insured transport operators only",
  "Local guides with deep knowledge and professional training",
  "Real-time trip updates and itinerary sharing",
  "Emergency assistance hotline active 24/7",
  "Customer feedback loop to continuously improve services",
  "Data privacy protection under strict company policies",
  "Fair cancellation and refund policies with clear timelines",
];

export default function TrustPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <StaticHeader />
      <main className="flex-1">
        <section className="relative bg-primary py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <Shield className="w-12 h-12 text-white/80 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Trust & Safety</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Your trust is the foundation of our journey together. Here&apos;s how we ensure every trip with Nirakt Travels is safe, secure, and worry-free.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-sand">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Happy Travelers", value: "5000+" },
                { label: "Successful Trips", value: "1200+" },
                { label: "Years of Trust", value: "7+" },
                { label: "Destinations", value: "100+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Pillars */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-12 text-center">Why Travelers Trust Us</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TRUST_PILLARS.map((pillar) => (
                <div key={pillar.title} className="p-6 bg-sand/50 rounded-2xl hover:bg-sand transition-colors">
                  <pillar.icon className="w-10 h-10 text-secondary mb-4" />
                  <h3 className="text-lg font-semibold text-primary mb-2">{pillar.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commitments */}
        <section className="py-16 md:py-24 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">Our Commitments to You</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {COMMITMENTS.map((item) => (
                <div key={item} className="flex items-start gap-3 p-4 bg-white/10 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-tertiary mt-0.5 shrink-0" />
                  <p className="text-white/90 text-sm md:text-base">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">Company Information</h2>
            <div className="bg-sand/50 rounded-2xl p-8 space-y-4">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-secondary mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-primary">Legal Name</p>
                  <p className="text-text-muted">Nirakt Travels by Yantu Ventures Pvt. Ltd.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-secondary mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-primary">Registration</p>
                  <p className="text-text-muted">Registered under the Companies Act, 2013</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-secondary mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-primary">Industry Memberships</p>
                  <p className="text-text-muted">Member of recognized Indian travel trade associations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Headphones className="w-5 h-5 text-secondary mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-primary">Support</p>
                  <p className="text-text-muted">
                    Phone: <a href="tel:01171069431" className="text-secondary hover:underline">011 7106 9431</a> / <a href="tel:+919319053504" className="text-secondary hover:underline">+91 9319053504</a><br />
                    Email: <a href="mailto:info@nirakt.com" className="text-secondary hover:underline">info@nirakt.com</a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-secondary mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-primary">Office Address</p>
                  <p className="text-text-muted">
                    1/9, Ground Floor, Indira Vikas, Opposite Nirankari School,<br />
                    Dr. Mukherjee Nagar, Delhi — 110009
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
