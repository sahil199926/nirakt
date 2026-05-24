import mongoose, { Schema, Document } from "mongoose";

export type GstRate = 0 | 5 | 8 | 18;

export interface IPackage extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  currency: string;
  gst: GstRate;
  duration: string;
  durationDays?: number;
  images: string[];
  coverImage: string;
  isInternational: boolean;
  destinations: string[];
  categories: string[];
  categorySlugs: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  highlights: string[];
  badge?: string;
  lockInAmount?: number;
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  isFeatured: boolean;
  isSpecial: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItineraryDaySchema: Schema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const PackageSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    duration: { type: String, required: true },
    durationDays: { type: Number },
    images: { type: [String], default: [] },
    coverImage: { type: String, required: true },
    isInternational: { type: Boolean, default: false },
    gst: { type: Number, enum: [0, 5, 8, 18], default: 0 },
    destinations: { type: [String], default: [] },
    categories: { type: [String], default: [] },
    categorySlugs: { type: [String], default: [], index: true },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    itinerary: { type: [ItineraryDaySchema], default: [] },
    highlights: { type: [String], default: [] },
    badge: { type: String },
    lockInAmount: { type: Number },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isSpecial: { type: Boolean, default: false },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

export const Package =
  mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);
