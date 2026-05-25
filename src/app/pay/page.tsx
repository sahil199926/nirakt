import type { Metadata } from "next";
import { StaticHeader } from "@/app/components/StaticHeader";
import { FooterSection } from "@/app/sections/FooterSection";
import { PayClient } from "./_components/PayClient";

export const metadata: Metadata = {
  title: "Pay & Book | Nirakt Travels",
  description:
    "Confirm your booking by scanning the QR code and completing your payment.",
};

export default function PayPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <StaticHeader />
      <main className="flex-1 bg-sand/30">
        <PayClient />
      </main>
      <FooterSection />
    </div>
  );
}
