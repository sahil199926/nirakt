"use client";

import { Plane } from "lucide-react";
import { SOCIAL_LINKS, BRAND, NAV_LINKS, FOOTER_TAGS, SERVICE_CARDS } from "@/app/lib/constants";

export function FooterSection() {
  const quickLinks = [...NAV_LINKS, { label: "Blog", href: "#" }];
  const serviceLinks = SERVICE_CARDS.slice(0, 7);

  return (
    <footer className="relative bg-footer-bg pt-14 md:pt-16 pb-8 overflow-hidden">
      {/* World map background */}
      <div className="absolute inset-0 text-white pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "url(/images/world-map.svg)", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "90% auto" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tag pills */}
        <div className="mb-10 pb-10 border-b border-white/10">
          <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Trending Tour Packages</h4>
          <div className="flex flex-wrap gap-2">
            {FOOTER_TAGS.map((tag) => (
              <a key={tag} href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-10 border-b border-white/10">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#home" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-base font-bold text-white leading-tight">NIRAKT</span>
                <span className="text-[9px] text-white/50 ml-1 uppercase tracking-wider">Travels</span>
              </div>
            </a>
            <p className="text-xs text-white/40 leading-relaxed">India&apos;s trusted travel companion for spiritual journeys, romantic getaways, and handcrafted adventures since 2018.</p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-white/45 hover:text-white transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((service) => (
                <li key={service.title}>
                  <a href="#services" className="text-sm text-white/45 hover:text-white transition-colors">{service.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/45">
              <li><a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">{BRAND.phone}</a></li>
              <li><a href={`tel:${BRAND.mobile.replace(/\s/g, "")}`} className="hover:text-white transition-colors">{BRAND.mobile}</a></li>
              <li><a href={`mailto:${BRAND.email}`} className="hover:text-white transition-colors">{BRAND.email}</a></li>
              <li className="text-white/30 text-xs leading-relaxed mt-1">{BRAND.address}</li>
            </ul>
            <div className="flex items-center gap-2 mt-4">
              {SOCIAL_LINKS.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all" aria-label={social.label}>
                  <social.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/25 text-center sm:text-left">&copy; 2025 Nirakt Travels by Yantu Ventures Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px] text-white/25">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy Policy</a>
            <span className="text-white/10">|</span>
            <a href="#" className="hover:text-white/50 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
