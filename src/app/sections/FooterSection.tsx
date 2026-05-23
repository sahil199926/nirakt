import Link from "next/link";
import { SOCIAL_LINKS, BRAND, FOOTER_TAGS, SERVICE_CARDS } from "@/app/lib/constants";
import Image from "next/image";
import Logo from "@/assets/logo.jpeg";

export function FooterSection() {
  const serviceLinks = SERVICE_CARDS.slice(0, 7);

  return (
    <footer className="relative bg-footer-bg pt-14 md:pt-16 pb-8 overflow-hidden">
      <div className="absolute inset-0 text-white pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "url(/images/world-map.svg)", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "90% auto" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tag pills */}
        <div className="mb-10 pb-10 border-b border-white/10">
          <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Trending Tour Packages</h4>
          <div className="flex flex-wrap gap-2">
            {FOOTER_TAGS.map((tag) => (
              <a key={tag} href="#contact"
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Image
                  src={Logo}
                  alt="Logo of Nirakt Travels"
                  height={100}
                  width={100}
                  className="rounded-lg"
                />
              </div>
              <div>
                <span className="text-base font-bold text-white leading-tight">NIRAKT</span>
                <span className="text-[9px] text-white/50 ml-1 uppercase tracking-wider">Travels</span>
              </div>
            </Link>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              India&apos;s trusted travel companion for spiritual journeys, romantic getaways, and handcrafted adventures since 2018.
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all" aria-label={social.label}>
                  <social.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-white/45 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#destinations" className="text-sm text-white/45 hover:text-white transition-colors">Destinations</Link></li>
              <li><Link href="/#services" className="text-sm text-white/45 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/packages" className="text-sm text-white/45 hover:text-white transition-colors">All Packages</Link></li>
              <li><Link href="/#contact" className="text-sm text-white/45 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/about" className="text-sm text-white/45 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((service) => (
                <li key={service.title}>
                  <Link href={service.href} className="text-sm text-white/45 hover:text-white transition-colors">{service.title}</Link>
                </li>
              ))}
              <li>
                <Link href="/packages" className="text-sm text-white/45 hover:text-white transition-colors">Browse All Packages</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sm text-white/45 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/trust" className="text-sm text-white/45 hover:text-white transition-colors">Trust & Safety</a></li>
              <li><a href="/about#stats" className="text-sm text-white/45 hover:text-white transition-colors">Our Impact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-sm text-white/45 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-sm text-white/45 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/cancellation" className="text-sm text-white/45 hover:text-white transition-colors">Cancellation & Refunds</a></li>
            </ul>
          </div>
        </div>

        {/* Contact bar */}
        <div className="py-6 border-b border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/45">
              <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">{BRAND.phone}</a>
              <a href={`tel:${BRAND.mobile.replace(/\s/g, "")}`} className="hover:text-white transition-colors">{BRAND.mobile}</a>
              <a href={`mailto:${BRAND.email}`} className="hover:text-white transition-colors">{BRAND.email}</a>
            </div>
            <p className="text-white/30 text-xs leading-relaxed max-w-md md:text-right">{BRAND.address}</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/25 text-center sm:text-left">&copy; 2025 Nirakt Travels by Yantu Ventures Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1 text-[11px] text-white/25">
            <a href="/privacy" className="hover:text-white/50 transition-colors">Privacy Policy</a>
            <span className="text-white/10">|</span>
            <a href="/terms" className="hover:text-white/50 transition-colors">Terms of Service</a>
            <span className="text-white/10">|</span>
            <a href="/cancellation" className="hover:text-white/50 transition-colors">Cancellation & Refunds</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
