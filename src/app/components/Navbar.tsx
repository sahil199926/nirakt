"use client";

import { useState } from "react";
import { useScrollPosition } from "@/app/hooks/useScrollPosition";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import Link from "next/link";
import { Phone, Menu, X, MapPin } from "lucide-react";
import { NAV_LINKS, BRAND } from "@/app/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Logo from "@/assets/logo.jpeg";

export function Navbar() {
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 20;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-sand shadow-nav"
            : "bg-white border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">
            <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick("#home"); }} className="flex items-center gap-2.5 shrink-0">
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
            </a>

            {isDesktop && (
              <div className="flex items-center gap-0.5">
                {NAV_LINKS.map((link) =>
                  link.href.startsWith("/") ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-4 py-2 text-[13px] font-medium text-text-muted hover:text-primary rounded-full hover:bg-sand transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                      className="px-4 py-2 text-[13px] font-medium text-text-muted hover:text-primary rounded-full hover:bg-sand transition-colors"
                    >
                      {link.label}
                    </a>
                  )
                )}
              </div>
            )}

            <div className="flex items-center gap-3">
              <a href={`tel:${BRAND.mobile.replace(/\s/g, "")}`} className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-secondary transition-colors">
                <Phone className="w-4 h-4" />
                {BRAND.mobile}
              </a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }} className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-full hover:brightness-110 transition-all shadow-button">
                <MapPin className="w-4 h-4" />
                Plan My Trip
              </a>
              {!isDesktop && (
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg text-text-muted hover:bg-sand transition-colors" aria-label="Toggle menu">
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && !isDesktop && (
        <div className="fixed inset-0 z-40 bg-white pt-20 px-6">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) =>
              link.href.startsWith("/") ? (
                <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-primary py-3 px-4 rounded-xl hover:bg-sand transition-colors">
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }} className="text-base font-medium text-primary py-3 px-4 rounded-xl hover:bg-sand transition-colors">
                  {link.label}
                </a>
              )
            )}
            <div className="flex flex-col gap-3 mt-4 px-4">
              <a href={`tel:${BRAND.mobile.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-semibold rounded-full">
                <Phone className="w-5 h-5" /> Call Now
              </a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }} className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white font-semibold rounded-full">
                <MapPin className="w-5 h-5" /> Plan My Trip
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
