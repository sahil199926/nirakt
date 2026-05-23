import type { Metadata } from "next";
import { StaticHeader } from "@/app/components/StaticHeader";
import { FooterSection } from "@/app/sections/FooterSection";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | Nirakt Travels",
  description:
    "Understand Nirakt Travels' cancellation and refund policies. Know your options before you book your next journey with us.",
};

export default function CancellationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <StaticHeader />
      <main className="flex-1">
        <section className="relative bg-primary py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Cancellation & Refund Policy</h1>
            <p className="text-white/70">Last updated: May 2025</p>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">1. Cancellation by Traveler</h2>
              <p className="text-text-muted leading-relaxed mb-4">
                We understand that plans can change. If you need to cancel your booking, please notify us as soon as possible. Cancellation requests must be submitted in writing via email to <a href="mailto:info@nirakt.com" className="text-secondary hover:underline">info@nirakt.com</a>.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-sand">
                      <th className="p-3 text-sm font-semibold text-primary rounded-tl-lg">Cancellation Timeframe</th>
                      <th className="p-3 text-sm font-semibold text-primary rounded-tr-lg">Refund Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-text-muted text-sm">
                    <tr className="border-b border-sand">
                      <td className="p-3">More than 30 days before departure</td>
                      <td className="p-3 font-medium text-primary">90% of total package cost</td>
                    </tr>
                    <tr className="border-b border-sand">
                      <td className="p-3">15–30 days before departure</td>
                      <td className="p-3 font-medium text-primary">75% of total package cost</td>
                    </tr>
                    <tr className="border-b border-sand">
                      <td className="p-3">7–14 days before departure</td>
                      <td className="p-3 font-medium text-primary">50% of total package cost</td>
                    </tr>
                    <tr className="border-b border-sand">
                      <td className="p-3">3–6 days before departure</td>
                      <td className="p-3 font-medium text-primary">25% of total package cost</td>
                    </tr>
                    <tr>
                      <td className="p-3 rounded-bl-lg">Less than 3 days before departure</td>
                      <td className="p-3 font-medium text-red-500 rounded-br-lg">No refund</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-text-muted text-sm mt-3">
                * A processing fee of 5% or INR 2,000 (whichever is higher) is deducted from all refunds to cover administrative and payment gateway charges.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">2. Non-Refundable Components</h2>
              <p className="text-text-muted leading-relaxed mb-3">
                Certain components of your booking are non-refundable regardless of cancellation timing:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-muted">
                <li>Flight/train tickets (subject to airline/railway policies)</li>
                <li>Visa fees and processing charges</li>
                <li>Travel insurance premiums</li>
                <li>Special event or festival surcharges</li>
                <li>Peak season surcharges</li>
                <li>Any third-party service explicitly marked as non-refundable</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">3. No-Show Policy</h2>
              <p className="text-text-muted leading-relaxed">
                If a traveler fails to arrive for the trip without prior cancellation notice (&quot;no-show&quot;), no refund will be provided. We recommend informing us immediately if you anticipate delays so we can explore rescheduling options where possible.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">4. Rescheduling</h2>
              <p className="text-text-muted leading-relaxed">
                Rescheduling requests are treated on a case-by-case basis. If approved, a rescheduling fee of INR 3,000 per person or 10% of the package cost (whichever is higher) will apply, plus any difference in seasonal pricing. Rescheduling must be requested at least 7 days before the original departure date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">5. Cancellation by Nirakt Travels</h2>
              <p className="text-text-muted leading-relaxed">
                In rare circumstances, we may need to cancel a trip due to insufficient participation, force majeure, natural disasters, political unrest, or operational issues beyond our control. In such cases, you will receive a <strong>full refund</strong> or the option to reschedule at no additional cost. We are not liable for any incidental expenses you may have incurred (e.g., personal travel arrangements, visa fees).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">6. Partial Cancellations</h2>
              <p className="text-text-muted leading-relaxed">
                If a group booking has partial cancellations (some members cancel while others travel), refunds will be calculated based on the revised group size and applicable pricing tiers. Single-occupancy supplements may apply if room sharing arrangements change.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">7. Refund Processing</h2>
              <p className="text-text-muted leading-relaxed">
                Approved refunds will be processed within 10–15 business days to the original payment method. Depending on your bank or payment provider, it may take an additional 5–10 business days for the funds to reflect in your account.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">8. Special Packages & Custom Tours</h2>
              <p className="text-text-muted leading-relaxed">
                Customized tours, destination weddings, corporate events, and large group bookings may have different cancellation terms, which will be communicated clearly at the time of quotation and booking confirmation.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-primary mb-3">9. Contact for Cancellations</h2>
              <p className="text-text-muted leading-relaxed">
                To request a cancellation or rescheduling, please contact us at <a href="mailto:info@nirakt.com" className="text-secondary hover:underline">info@nirakt.com</a> or call <a href="tel:+919319053504" className="text-secondary hover:underline">+91 9319053504</a>. Please include your booking reference number for faster processing.
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
