import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { StaticHeader } from "@/app/components/StaticHeader";
import { FooterSection } from "@/app/sections/FooterSection";
import { LeadCaptureForm } from "@/app/components/LeadCaptureForm";
import { BRAND, CONTACT_INFO, SOCIAL_LINKS } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us | Nirakt Travels — Plan Your Perfect Trip",
  description:
    "Get in touch with Nirakt Travels for free travel consultation, package bookings, and custom itineraries. Call, WhatsApp, or fill in our enquiry form.",
  alternates: { canonical: "https://www.nirakt.com/contact" },
};

function ContactIcon({ label }: { label: string }) {
  switch (label) {
    case "Phone": case "Mobile": return <Phone className="w-5 h-5 text-primary" />;
    case "Email": return <Mail className="w-5 h-5 text-primary" />;
    case "WhatsApp": return <MessageCircle className="w-5 h-5 text-primary" />;
    default: return <MapPin className="w-5 h-5 text-primary" />;
  }
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <StaticHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-medium mb-5">
              <Sparkles className="w-3 h-3" />
              Free Travel Consultation
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Let&apos;s Plan Your<br className="hidden sm:block" /> Perfect Trip
            </h1>
            <p className="text-white/70 text-base max-w-xl mx-auto leading-relaxed">
              Reach out to our travel experts for a free consultation — no commitment required.
            </p>
          </div>
        </section>

        {/* Contact content */}
        <section className="py-12 md:py-16 bg-sand/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* Contact info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-primary mb-1">Get In Touch</h2>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Visit us, call us, or drop a message. We&apos;re here to make your travel dreams real.
                  </p>
                </div>

                <div className="space-y-3">
                  {CONTACT_INFO.map((info) => (
                    <div key={info.label} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-sand hover:border-primary/20 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ContactIcon label={info.label} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide mb-0.5">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            target={info.href.startsWith("http") ? "_blank" : undefined}
                            rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-sm font-medium text-primary hover:text-secondary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-primary">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social links */}
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Follow Us</p>
                  <div className="flex items-center gap-2">
                    {SOCIAL_LINKS.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="w-9 h-9 rounded-lg bg-white border border-sand flex items-center justify-center text-text-muted hover:bg-primary hover:text-white hover:border-primary transition-all"
                      >
                        <social.icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="space-y-2">
                  <a
                    href={`https://wa.me/${BRAND.mobile.replace(/\D/g, "")}?text=Hi, I'd like to plan a trip with Nirakt Travels`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-accent text-white font-semibold rounded-xl hover:brightness-110 transition-all shadow-button text-sm"
                  >
                    <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                  </a>
                  <a
                    href={`tel:${BRAND.mobile.replace(/\s/g, "")}`}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:brightness-110 transition-all text-sm"
                  >
                    <Phone className="w-4 h-4" /> Call Us Now
                  </a>
                </div>
              </div>

              {/* Enquiry form */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-sand shadow-card">
                  <h3 className="text-lg font-bold text-primary mb-1">Send an Enquiry</h3>
                  <p className="text-xs text-text-muted mb-6">Fill in the details and our expert will get back within 30 minutes.</p>
                  <LeadCaptureForm variant="full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map placeholder / Office info */}
        <section className="py-10 bg-white border-t border-sand">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-sand/40 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-primary mb-0.5">Our Office</p>
                <p className="text-sm text-text-muted">{BRAND.address}</p>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(BRAND.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-white border border-sand rounded-full text-sm font-medium text-primary hover:bg-sand transition-colors"
              >
                Get Directions <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
