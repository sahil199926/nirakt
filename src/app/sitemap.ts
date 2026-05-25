import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db/connect";
import { Package } from "@/models/Package";

const BASE_URL = "https://nirakt.vercel.app";

const SERVICE_SLUGS = [
  "couples-celebration",
  "corporate-group-travel",
  "proposal-surprise-planning",
  "leisure-vacation-international",
  "destination-wedding-events",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/packages`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/destinations`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/trust`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/cancellation`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  let packageRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const packages = await Package.find({ isActive: true }, { slug: 1, updatedAt: 1 }).lean();
    packageRoutes = packages.map((pkg) => ({
      url: `${BASE_URL}/packages/${pkg.slug}`,
      lastModified: pkg.updatedAt ? new Date(pkg.updatedAt as string) : new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));
  } catch {
    // DB unavailable at build time — package URLs omitted
  }

  return [...staticRoutes, ...serviceRoutes, ...packageRoutes];
}
