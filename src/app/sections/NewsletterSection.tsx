"use client";

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <section className="py-8 md:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-primary p-8 md:p-12">
          <div
            className="absolute inset-0 text-white pointer-events-none"
            style={{
              backgroundImage: "url(/images/monuments.svg)",
              backgroundPosition: "bottom right",
              backgroundRepeat: "no-repeat",
              backgroundSize: "60% auto",
              opacity: 0.6,
            }}
          />

          <div className="relative z-10 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Stay in the Loop!
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Be the first to know about exclusive travel deals, exciting destinations, and special offers!
            </p>

            {submitted ? (
              <div className="flex items-center gap-2 text-accent font-medium">
                <Mail className="w-5 h-5" />
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3.5 top-1/2 -tranprimary-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-accent text-white font-semibold text-sm rounded-full hover:brightness-110 transition-all shadow-button flex items-center gap-2 shrink-0"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
