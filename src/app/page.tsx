import { Navbar } from "@/app/components/Navbar";
import { FloatingCTA } from "@/app/components/FloatingCTA";
import { HeroSection } from "@/app/sections/HeroSection";
import { TrendingDestinations } from "@/app/sections/TrendingDestinations";
import { SpecialsSection } from "@/app/sections/SpecialsSection";
import { ServicesSection } from "@/app/sections/ServicesSection";
import { FeaturedTripsSection } from "@/app/sections/FeaturedTripsSection";
import { WhyChooseSection } from "@/app/sections/WhyChooseSection";
import { ProcessSection } from "@/app/sections/ProcessSection";
import { StatsSection } from "@/app/sections/StatsSection";
import { TestimonialsSection } from "@/app/sections/TestimonialsSection";
import { NewsletterSection } from "@/app/sections/NewsletterSection";
import { CTABannerSection } from "@/app/sections/CTABannerSection";
import { ContactSection } from "@/app/sections/ContactSection";
import { FooterSection } from "@/app/sections/FooterSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrendingDestinations />
        <SpecialsSection />
        <ServicesSection />
        <FeaturedTripsSection />
        <WhyChooseSection />
        {/* <ProcessSection /> */}
        <StatsSection />
        <TestimonialsSection />
        {/* <NewsletterSection /> */}
        <CTABannerSection />
        <ContactSection />
      </main>
      <FooterSection />
      <FloatingCTA />
    </>
  );
}
