"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, MapPin } from "lucide-react";
import Logo from "@/assets/logo.jpeg";
import { NAV_LINKS, BRAND } from "@/app/lib/constants";

// Hash anchors in NAV_LINKS (e.g. "#services") only work on the home page,
// so prefix them with "/" when used from any other page.
function resolveHref(href: string) {
  if (href.startsWith("#")) return `/${href}`;
  return href;
}

export function StaticHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sand shadow-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Image
                  src={Logo}
                  alt="Logo of Nirakt Travels"
                  height={100}
                  width={100}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[17px] font-bold text-primary leading-tight tracking-tight">NIRAKT</span>
                <span className="text-[9px] text-text-muted leading-none tracking-[0.15em] uppercase font-medium">Travels</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={resolveHref(link.href)}
                  className="px-4 py-2 text-[13px] font-medium text-text-muted hover:text-primary rounded-full hover:bg-sand transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-full hover:brightness-110 transition-all shadow-button"
              >
                Plan My Trip
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="lg:hidden p-2 rounded-lg text-text-muted hover:bg-sand transition-colors"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 px-6 lg:hidden overflow-y-auto">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={resolveHref(link.href)}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-primary py-3 px-4 rounded-xl hover:bg-sand transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex flex-col gap-3 mt-4 px-4">
              <a
                href={`tel:${BRAND.mobile.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-semibold rounded-full"
              >
                <Phone className="w-5 h-5" /> Call Now
              </a>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white font-semibold rounded-full"
              >
                <MapPin className="w-5 h-5" /> Plan My Trip
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
