import type { Metadata } from "next";
import { StaticHeader } from "@/app/components/StaticHeader";
import { FooterSection } from "@/app/sections/FooterSection";

export const metadata: Metadata = {
  title: "Privacy Policy | Nirakt Travels",
  description:
    "Nirakt Travels is committed to protecting your privacy. Learn how we collect, use, and safeguard your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <StaticHeader />
      <main className="flex-1">
        <section className="relative bg-primary py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-white/70">Last updated: May 2025</p>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">1. Introduction</h2>
              <p className="text-text-muted leading-relaxed">
                Nirakt Travels by Yantu Ventures Pvt. Ltd. (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our travel services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">2. Information We Collect</h2>
              <p className="text-text-muted leading-relaxed mb-3">
                We may collect the following types of information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-muted">
                <li><strong>Personal Information:</strong> Name, email address, phone number, postal address, date of birth, and government-issued ID details required for bookings.</li>
                <li><strong>Travel Preferences:</strong> Destination interests, budget range, travel dates, dietary requirements, and special requests.</li>
                <li><strong>Payment Information:</strong> Billing address and payment method details (processed securely through PCI-DSS compliant gateways).</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies to improve your browsing experience.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">3. How We Use Your Information</h2>
              <p className="text-text-muted leading-relaxed mb-3">
                We use your information to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-muted">
                <li>Process and confirm your travel bookings</li>
                <li>Communicate with you about your trips, updates, and promotional offers</li>
                <li>Personalize your travel recommendations</li>
                <li>Improve our website, services, and customer experience</li>
                <li>Comply with legal obligations and ensure travel security</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">4. Information Sharing</h2>
              <p className="text-text-muted leading-relaxed">
                We do not sell your personal information. We may share your data with trusted partners such as airlines, hotels, transport providers, and insurance companies solely to fulfill your travel arrangements. All partners are bound by confidentiality agreements.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">5. Data Security</h2>
              <p className="text-text-muted leading-relaxed">
                We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information from unauthorized access, alteration, or destruction.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">6. Cookies</h2>
              <p className="text-text-muted leading-relaxed">
                Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">7. Your Rights</h2>
              <p className="text-text-muted leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-muted">
                <li>Access and review your personal data</li>
                <li>Request correction or deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing where applicable</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">8. Contact Us</h2>
              <p className="text-text-muted leading-relaxed">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at <a href="mailto:info@nirakt.com" className="text-secondary hover:underline">info@nirakt.com</a> or call us at <a href="tel:+919319053504" className="text-secondary hover:underline">+91 9319053504</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
