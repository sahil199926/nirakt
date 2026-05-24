import mongoose, { Schema, Document } from "mongoose";

export interface ILocation extends Document {
  name: string;
  slug: string;
  image?: string;
  imagePublicId?: string;
  isInternational: boolean;
  isTrending: boolean;
  showOnDestinationPage: boolean;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    imagePublicId: { type: String },
    isInternational: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false, index: true },
    showOnDestinationPage: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

export const Location =
  mongoose.models.Location || mongoose.model<ILocation>("Location", LocationSchema);
