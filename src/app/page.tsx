import { connectDB } from "@/lib/db/connect";
import { Location } from "@/models/Location";
import { Package } from "@/models/Package";
import { Navbar } from "@/app/components/Navbar";
import { FloatingCTA } from "@/app/components/FloatingCTA";
import { HeroSection } from "@/app/sections/HeroSection";
import { TrendingDestinations, type TrendingDest } from "@/app/sections/TrendingDestinations";
import { SpecialsSection, type SpecialPackage } from "@/app/sections/SpecialsSection";
import { ServicesSection } from "@/app/sections/ServicesSection";
import { FeaturedTripsSection, type FeaturedPackage } from "@/app/sections/FeaturedTripsSection";
import { WhyChooseSection } from "@/app/sections/WhyChooseSection";
// import { ProcessSection } from "@/app/sections/ProcessSection";
import { StatsSection } from "@/app/sections/StatsSection";
import { TestimonialsSection } from "@/app/sections/TestimonialsSection";
// import { NewsletterSection } from "@/app/sections/NewsletterSection";
import { CTABannerSection } from "@/app/sections/CTABannerSection";
import { ContactSection } from "@/app/sections/ContactSection";
import { FooterSection } from "@/app/sections/FooterSection";

export const revalidate = 3600;

async function getHomeData() {
  try {
    await connectDB();

    const [trendingLocations, featuredPackages, specialPackages] = await Promise.all([
      Location.find({ isTrending: true, isActive: true }).sort({ name: 1 }).lean(),
      Package.find({ isFeatured: true, isActive: true })
        .sort({ createdAt: -1 })
        .limit(8)
        .select("title slug duration shortDescription price badge rating reviewCount coverImage")
        .lean(),
      Package.find({ isSpecial: true, isActive: true })
        .sort({ createdAt: -1 })
        .limit(4)
        .select("title slug shortDescription price coverImage")
        .lean(),
    ]);

    return { trendingLocations, featuredPackages, specialPackages };
  } catch {
    return { trendingLocations: [], featuredPackages: [], specialPackages: [] };
  }
}

export default async function Home() {
  const { trendingLocations, featuredPackages, specialPackages } = await getHomeData();

  const domestic: TrendingDest[] = trendingLocations
    .filter((l) => !l.isInternational && l.image)
    .map((l) => ({ name: l.name, image: l.image as string }));

  const international: TrendingDest[] = trendingLocations
    .filter((l) => l.isInternational && l.image)
    .map((l) => ({ name: l.name, image: l.image as string }));

  const featured: FeaturedPackage[] = featuredPackages.map((p) => ({
    _id: p._id.toString(),
    slug: p.slug,
    title: p.title,
    duration: p.duration,
    shortDescription: p.shortDescription,
    price: p.price,
    badge: p.badge,
    rating: p.rating,
    reviewCount: p.reviewCount,
    coverImage: p.coverImage,
  }));

  const specials: SpecialPackage[] = specialPackages.map((p) => ({
    _id: p._id.toString(),
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription,
    price: p.price,
    coverImage: p.coverImage,
  }));

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrendingDestinations domestic={domestic} international={international} />
        <SpecialsSection packages={specials} />
        <ServicesSection />
        <FeaturedTripsSection packages={featured} />
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
