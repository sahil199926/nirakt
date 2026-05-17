import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nirakt Travels | Your Journey, Our Promise — India's Trusted Travel Agency",
  description:
    "Plan your dream trip with Nirakt Travels. Spiritual yatras, honeymoon packages, domestic & international tours, trekking, corporate trips & destination weddings. Free consultation!",
  keywords:
    "travel agency Delhi, Nirakt Travels, spiritual yatra, Chardham Yatra, honeymoon packages, Kerala tour, Bali package, trekking India, destination wedding, corporate travel",
  openGraph: {
    title: "Nirakt Travels | Your Journey, Our Promise",
    description:
      "India's trusted travel companion. Handcrafted spiritual journeys, romantic getaways & adventures across India & beyond.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://www.nirakt.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Nirakt Travels",
  description: "India's trusted travel companion for spiritual journeys, romantic getaways, and handcrafted adventures.",
  url: "https://www.nirakt.com",
  telephone: ["011 7106 9431", "+91 9319053504"],
  email: "info@nirakt.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1/9, Ground Floor, Indira Vikas, Opposite Nirankari School, Dr. Mukherjee Nagar",
    addressLocality: "Delhi",
    postalCode: "110009",
    addressCountry: "IN",
  },
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
