import Image from "next/image";
import Link from "next/link";
import { Clock, Star, MapPin, ArrowUpRight } from "lucide-react";

export interface PackageCardData {
  _id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  coverImage: string;
  destinations: string[];
  highlights: string[];
  badge?: string;
  rating?: number;
  reviewCount?: number;
  isFeatured: boolean;
  categorySlugs?: string[];
}

function formatPrice(price: number, currency: string) {
  return `${currency === "INR" ? "₹" : currency}${price.toLocaleString("en-IN")}`;
}

export function PackageCard({ pkg }: { pkg: PackageCardData }) {
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-sand hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={pkg.coverImage}
          alt={pkg.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {pkg.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-accent text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
            {pkg.badge}
          </span>
        )}
        {pkg.isFeatured && !pkg.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-secondary text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
            Featured
          </span>
        )}
        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 text-[11px] text-text-muted mb-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {pkg.duration}
          </span>
          {pkg.destinations.length > 0 && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {pkg.destinations[0]}
            </span>
          )}
        </div>

        <h3 className="text-sm font-semibold text-primary mb-1 line-clamp-2">{pkg.title}</h3>
        <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-3">
          {pkg.shortDescription || pkg.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-sand">
          <div>
            <span className="text-[10px] text-text-muted block">Starting from</span>
            <p className="text-base font-bold text-primary">{formatPrice(pkg.price, pkg.currency)}</p>
          </div>
          {pkg.rating != null && pkg.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-primary">{pkg.rating}</span>
              {pkg.reviewCount != null && pkg.reviewCount > 0 && (
                <span className="text-[10px] text-text-muted">({pkg.reviewCount})</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
