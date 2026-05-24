import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  Phone,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Receipt,
} from "lucide-react";
import { connectDB } from "@/lib/db/connect";
import { Package } from "@/models/Package";
import { StaticHeader } from "@/app/components/StaticHeader";
import { FooterSection } from "@/app/sections/FooterSection";
import { ItineraryAccordion } from "@/components/packages/ItineraryAccordion";
import { PackageEnquiryCTA, PackageEnquiryCTABar } from "@/components/packages/PackageEnquiryCTA";
import { BRAND } from "@/app/lib/constants";

export const revalidate = 3600;

async function getPackage(slug: string) {
  try {
    await connectDB();
    const pkg = await Package.findOne({ slug, isActive: true }).lean();
    return pkg;
  } catch {
    return null;
  }
}

async function getFeaturedPackages(excludeSlug: string) {
  try {
    await connectDB();
    const packages = await Package.find(
      { isActive: true, slug: { $ne: excludeSlug } },
      { slug: 1, title: 1, price: 1, currency: 1, duration: 1, coverImage: 1, badge: 1 }
    )
      .sort({ isFeatured: -1 })
      .limit(3)
      .lean();
    return packages;
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const packages = await Package.find({ isActive: true }, { slug: 1 }).lean();
    return packages.map((pkg) => ({ slug: pkg.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) {
    return { title: "Package Not Found | Nirakt Travels" };
  }

  return {
    title: `${pkg.title} | Nirakt Travels`,
    description:
      pkg.metaDescription ||
      pkg.shortDescription ||
      `${pkg.title} — ${pkg.duration} package starting from ₹${pkg.price.toLocaleString("en-IN")}. ${pkg.description.slice(0, 120)}`,
    keywords: `${pkg.title}, ${pkg.destinations.join(", ")}, travel package, Nirakt Travels`,
    openGraph: {
      title: `${pkg.title} | Nirakt Travels`,
      description: pkg.shortDescription || pkg.description,
      images: [pkg.coverImage],
    },
    alternates: {
      canonical: `https://www.nirakt.com/packages/${slug}`,
    },
  };
}

function formatPrice(price: number, currency: string) {
  return `${currency === "INR" ? "₹" : currency}${price.toLocaleString("en-IN")}`;
}

function priceWithGst(price: number, gst: number) {
  if (!gst) return null;
  const gstAmount = Math.round((price * gst) / 100);
  return { total: price + gstAmount, gstAmount, rate: gst };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) {
    notFound();
  }

  const related = await getFeaturedPackages(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.title,
    description: pkg.description,
    image: pkg.images?.[0] || pkg.coverImage,
    touristType: pkg.categories,
    itinerary: pkg.itinerary?.map((day: { day: number; title: string; description: string }) => ({
      "@type": "TouristAttraction",
      name: `Day ${day.day}: ${day.title}`,
      description: day.description,
    })),
    offers: {
      "@type": "Offer",
      price: pkg.price,
      priceCurrency: pkg.currency || "INR",
    },
    provider: {
      "@type": "TravelAgency",
      name: "Nirakt Travels",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen flex flex-col">
        <StaticHeader />
        <main className="flex-1">
          {/* Hero Image */}
          <section className="relative h-[55vh] min-h-[360px] max-h-[520px] overflow-hidden">
            <Image
              src={pkg.coverImage || "/images/hero-bg.jpg"}
              alt={pkg.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 max-w-7xl mx-auto">
              <nav className="flex items-center gap-2 text-xs text-white/60 mb-3" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/packages" className="hover:text-white transition-colors">Packages</Link>
                <span>/</span>
                <span className="text-white/80 line-clamp-1">{pkg.title}</span>
              </nav>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {pkg.badge && (
                  <span className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-full uppercase tracking-wide">
                    {pkg.badge}
                  </span>
                )}
                {pkg.destinations.slice(0, 3).map((dest: string) => (
                  <span key={dest} className="flex items-center gap-1 px-2.5 py-1 bg-white/15 backdrop-blur-sm text-white text-xs rounded-full border border-white/20">
                    <MapPin className="w-3 h-3" /> {dest}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
                {pkg.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-white/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {pkg.duration}
                </span>
                {pkg.rating != null && pkg.rating > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {pkg.rating} {pkg.reviewCount != null && pkg.reviewCount > 0 && `(${pkg.reviewCount} reviews)`}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Sticky top CTA bar */}
          <div className="sticky top-16 z-30 bg-white border-b border-sand shadow-nav">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 py-3">
              <div>
                <span className="text-xs text-text-muted">Starting from</span>
                <p className="text-xl font-bold text-primary leading-tight">
                  {formatPrice(pkg.price, pkg.currency || "INR")}
                  <span className="text-xs font-normal text-text-muted ml-1">per person</span>
                </p>
                {pkg.gst > 0 && (
                  <p className="text-[10px] text-text-muted">+{pkg.gst}% GST applicable</p>
                )}
              </div>
              <PackageEnquiryCTABar
                packageTitle={pkg.title}
                packageSlug={pkg.slug}
                packageId={String(pkg._id)}
              />
            </div>
          </div>

          {/* Main Content */}
          <section className="py-10 md:py-14 bg-sand/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Details */}
                <div className="flex-1 min-w-0">
                  {/* Description */}
                  <div className="bg-white rounded-2xl p-6 border border-sand mb-6">
                    <h2 className="text-lg font-bold text-primary mb-3">About This Package</h2>
                    {/* <p className="text-text-muted leading-relaxed text-sm">{pkg.description}</p> */}
                    <div className="text-text-muted leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: pkg.description }}></div>
                  </div>

                  {/* Highlights */}
                  {pkg.highlights && pkg.highlights.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-sand mb-6">
                      <h2 className="text-lg font-bold text-primary mb-4">Trip Highlights</h2>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {pkg.highlights.map((h: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-text-muted">
                            <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Inclusions / Exclusions */}
                  {((pkg.inclusions && pkg.inclusions.length > 0) || (pkg.exclusions && pkg.exclusions.length > 0)) && (
                    <div className="bg-white rounded-2xl p-6 border border-sand mb-6">
                      <h2 className="text-lg font-bold text-primary mb-4">What&apos;s Included</h2>
                      <div className="grid sm:grid-cols-2 gap-6">
                        {pkg.inclusions && pkg.inclusions.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500" /> Inclusions
                            </h3>
                            <ul className="space-y-2">
                              {pkg.inclusions.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0 mt-2" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {pkg.exclusions && pkg.exclusions.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-red-400" /> Exclusions
                            </h3>
                            <ul className="space-y-2">
                              {pkg.exclusions.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-300 shrink-0 mt-2" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Itinerary */}
                  {pkg.itinerary && pkg.itinerary.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-sand mb-6">
                      <h2 className="text-lg font-bold text-primary mb-4">
                        Day-by-Day Itinerary
                      </h2>
                      <ItineraryAccordion itinerary={pkg.itinerary} />
                    </div>
                  )}
                </div>

                {/* Right: Booking sidebar */}
                <div className="w-full lg:w-80 shrink-0">
                  <div className="sticky top-36 space-y-4">
                    {/* Price card */}
                    <div className="bg-white rounded-2xl p-6 border border-sand shadow-card">
                      <div className="mb-4">
                        <span className="text-xs text-text-muted">Starting from</span>
                        <p className="text-3xl font-bold text-primary">
                          {formatPrice(pkg.price, pkg.currency || "INR")}
                        </p>
                        <span className="text-xs text-text-muted">per person</span>
                        {(() => {
                          const gstInfo = priceWithGst(pkg.price, pkg.gst ?? 0);
                          return gstInfo ? (
                            <div className="mt-2 p-2.5 bg-sand/60 rounded-lg border border-sand">
                              <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                                <Receipt className="w-3.5 h-3.5 text-secondary" />
                                <span>GST Breakdown ({gstInfo.rate}%)</span>
                              </div>
                              <div className="flex justify-between text-xs text-text-muted">
                                <span>Base price</span>
                                <span>{formatPrice(pkg.price, pkg.currency || "INR")}</span>
                              </div>
                              <div className="flex justify-between text-xs text-text-muted">
                                <span>GST ({gstInfo.rate}%)</span>
                                <span>+{formatPrice(gstInfo.gstAmount, pkg.currency || "INR")}</span>
                              </div>
                              <div className="flex justify-between text-sm font-bold text-primary border-t border-sand mt-1 pt-1">
                                <span>Total</span>
                                <span>{formatPrice(gstInfo.total, pkg.currency || "INR")}</span>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>

                      <div className="flex flex-col gap-2 text-sm text-text-muted mb-5 border-t border-sand pt-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-secondary" />
                          <span>{pkg.duration}</span>
                        </div>
                        {pkg.destinations.length > 0 && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-secondary" />
                            <span>{pkg.destinations.join(", ")}</span>
                          </div>
                        )}
                        {pkg.durationDays && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-secondary" />
                            <span>{pkg.durationDays} Days / {pkg.durationDays - 1} Nights</span>
                          </div>
                        )}
                      </div>

                      <PackageEnquiryCTA
                        packageTitle={pkg.title}
                        packageSlug={pkg.slug}
                        packageId={String(pkg._id)}
                        destinations={pkg.destinations}
                      />
                    </div>

                    {/* Trust badges */}
                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                      <p className="text-xs font-semibold text-primary mb-3">Why Book With Us</p>
                      <ul className="space-y-2">
                        {[
                          "Free cancellation up to 15 days",
                          "No hidden charges",
                          "24/7 on-trip support",
                          "Expert local guides",
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-2 text-xs text-text-muted">
                            <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related packages */}
          {related.length > 0 && (
            <section className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-primary">You May Also Like</h2>
                  <Link href="/packages" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-secondary transition-colors">
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/packages/${rel.slug}`}
                      className="group flex items-center gap-3 bg-sand/40 rounded-xl p-3 hover:bg-sand transition-colors"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <Image src={rel.coverImage || "/images/hero-bg.jpg"} alt={rel.title} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary line-clamp-2 mb-1">{rel.title}</p>
                        <p className="text-xs text-text-muted">{rel.duration}</p>
                        <p className="text-sm font-bold text-accent">
                          {formatPrice(rel.price, rel.currency || "INR")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-secondary">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Ready to Book {pkg.title}?
              </h2>
              <p className="text-white/70 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
                Reach out to our travel experts to customize this package for your dates, group size, and preferences. Fast response guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${BRAND.mobile.replace(/\D/g, "")}?text=Hi, I want to book: ${encodeURIComponent(pkg.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-semibold rounded-full hover:brightness-110 transition-all shadow-button"
                >
                  <MessageCircle className="w-4 h-4" /> Book on WhatsApp
                </a>
                <a
                  href={`tel:${BRAND.mobile.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-all border border-white/20"
                >
                  <Phone className="w-4 h-4" /> {BRAND.mobile}
                </a>
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> More Packages
                </Link>
              </div>
            </div>
          </section>

          {/* Bottom CTA enquiry note */}
          <div className="sr-only">Package enquiry CTAs handled via modal</div>
        </main>
        <FooterSection />
      </div>
    </>
  );
}
