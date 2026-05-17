"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Copy, Check } from "lucide-react";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { LeadCaptureForm } from "@/app/components/LeadCaptureForm";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/app/lib/constants";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const getIcon = (label: string) => {
    switch (label) {
      case "Phone": case "Mobile": return Phone;
      case "Email": return Mail;
      case "Address": return MapPin;
      case "WhatsApp": return MessageCircle;
      default: return Phone;
    }
  };

  return (
    <section id="contact" className="py-14 md:py-18 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-2">
            <ScrollReveal direction="left">
              <span className="text-[11px] font-bold text-primary uppercase tracking-[0.12em]">Get In Touch</span>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mt-2 mb-3">Let&apos;s Plan Your Trip</h2>
              <p className="text-sm text-text-muted mb-7 leading-relaxed">Visit us, call us, or drop a message. We&apos;re here to make your travel dreams real.</p>
            </ScrollReveal>

            <div className="space-y-1.5">
              {CONTACT_INFO.map((info, index) => {
                const Icon = getIcon(info.label);
                return (
                  <ScrollReveal key={info.label} delay={index * 0.06}>
                    <div className={cn("flex items-start gap-3 p-3 rounded-xl transition-colors", info.href ? "cursor-pointer hover:bg-sand" : "hover:bg-sand")}
                      onClick={() => { if (info.label === "Phone" || info.label === "Mobile" || info.label === "WhatsApp") handleCopy(info.value, info.label); }}>
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide">{info.label}</p>
                        {info.href ? (
                          <a href={info.href} target={info.href.startsWith("http") ? "_blank" : undefined} rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-sm text-primary hover:text-primary transition-colors font-medium" onClick={(e) => e.stopPropagation()}>
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm text-primary font-medium">{info.value}</p>
                        )}
                      </div>
                      {(info.label === "Phone" || info.label === "Mobile" || info.label === "WhatsApp") && (
                        <div className="shrink-0 mt-1">
                          {copied === info.label ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            <ScrollReveal delay={0.35}>
              <div className="flex items-center gap-2 mt-5 ml-1">
                {SOCIAL_LINKS.map((social) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-sand flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-all" aria-label={social.label}>
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-3">
            <ScrollReveal direction="right">
              <div className="bg-white rounded-2xl p-5 md:p-7 border border-sand shadow-card">
                <h3 className="text-base font-semibold text-primary mb-0.5">Send an Enquiry</h3>
                <p className="text-xs text-text-muted mb-5">Fill in the details and our expert will get back to you within 30 minutes.</p>
                <LeadCaptureForm variant="full" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
