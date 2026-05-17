import type { LucideIcon } from "lucide-react";

export interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface DestinationCardProps {
  image: string;
  title: string;
  duration: string;
  description: string;
  price: string;
  badge: string;
  rating: number;
  reviewCount: number;
}

export interface TestimonialProps {
  quote: string;
  name: string;
  location: string;
  tripType: string;
  rating: number;
}

export interface ProcessStepProps {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ContactInfoProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

export interface LeadFormData {
  name: string;
  phone: string;
  email?: string;
  destinationType: string;
  preferredDestination?: string;
  travelDate: string;
  travelers?: number;
  budget?: string;
  message?: string;
}

export interface StatProps {
  number: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
}

export interface NavLinkProps {
  label: string;
  href: string;
}
