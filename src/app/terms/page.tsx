import type { Metadata } from "next";
import { StaticHeader } from "@/app/components/StaticHeader";
import { FooterSection } from "@/app/sections/FooterSection";

export const metadata: Metadata = {
  title: "Terms & Conditions | Nirakt Travels",
  description:
    "Read the terms and conditions for booking travel services with Nirakt Travels. Understand your rights and responsibilities before you travel.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <StaticHeader />
      <main className="flex-1">
        <section className="relative bg-primary py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
            <p className="text-white/70">Last updated: May 2025</p>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">1. Acceptance of Terms</h2>
              <p className="text-text-muted leading-relaxed">
                By accessing our website, making a booking, or using any services provided by Nirakt Travels by Yantu Ventures Pvt. Ltd., you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">2. Booking & Payments</h2>
              <ul className="list-disc list-inside space-y-2 text-text-muted">
                <li>All bookings are subject to availability and confirmation.</li>
                <li>A deposit or full payment may be required to confirm your reservation, depending on the package.</li>
                <li>Prices are quoted in Indian Rupees (INR) unless otherwise stated and are inclusive of applicable taxes unless noted.</li>
                <li>Payment can be made via bank transfer, UPI, credit/debit card, or other methods as communicated during booking.</li>
                <li>Failure to make payment by the due date may result in cancellation of your booking.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">3. Pricing & Inclusions</h2>
              <p className="text-text-muted leading-relaxed mb-3">
                Our packages typically include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-muted">
                <li>Accommodation as per itinerary</li>
                <li>Meals (breakfast and/or dinner) where specified</li>
                <li>Airport/station transfers and local transport</li>
                <li>Sightseeing and activities as mentioned</li>
              </ul>
              <p className="text-text-muted leading-relaxed mt-3">
                Unless explicitly stated, packages do not include airfare, travel insurance, personal expenses, optional activities, tips, or meals not mentioned in the itinerary.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">4. Travel Documents</h2>
              <p className="text-text-muted leading-relaxed">
                It is the traveler&apos;s responsibility to possess valid identification, passports, visas, and any required health certificates. Nirakt Travels can assist with documentation guidance but is not liable for denial of entry due to incomplete or invalid documents.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">5. Travel Insurance</h2>
              <p className="text-text-muted leading-relaxed">
                We strongly recommend purchasing comprehensive travel insurance covering trip cancellation, medical emergencies, baggage loss, and personal accidents. Nirakt Travels is not responsible for any losses not covered by insurance.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">6. Liability</h2>
              <p className="text-text-muted leading-relaxed">
                Nirakt Travels acts as an intermediary between travelers and service providers (hotels, airlines, transport operators). While we take utmost care in selecting partners, we are not liable for any injury, loss, damage, delay, or irregularity caused by third-party service providers, natural disasters, political unrest, or events beyond our control.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">7. Code of Conduct</h2>
              <p className="text-text-muted leading-relaxed">
                Travelers are expected to behave responsibly and respect local customs, laws, and fellow travelers. Nirakt Travels reserves the right to terminate services for any traveler whose behavior is disruptive, illegal, or endangers others, without refund.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">8. Changes by Nirakt Travels</h2>
              <p className="text-text-muted leading-relaxed">
                We reserve the right to modify itineraries, accommodations, or services due to unforeseen circumstances such as weather, operational issues, or force majeure. In such cases, we will offer suitable alternatives of comparable value.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">9. Governing Law</h2>
              <p className="text-text-muted leading-relaxed">
                These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Delhi, India.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">10. Contact</h2>
              <p className="text-text-muted leading-relaxed">
                For questions about these terms, please contact us at <a href="mailto:info@nirakt.com" className="text-secondary hover:underline">info@nirakt.com</a> or <a href="tel:+919319053504" className="text-secondary hover:underline">+91 9319053504</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
