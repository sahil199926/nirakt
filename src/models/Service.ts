import mongoose, { Schema, Document } from "mongoose";

export interface IServiceCategory {
  name: string;
  slug: string;
  children?: IServiceCategory[];
}

export interface IService extends Document {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  categories: IServiceCategory[];
  popularDestinations: string[];
  hiddenGems?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    children: { type: [Schema.Types.Mixed], default: [] },
  },
  { _id: false }
);

const ServiceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    categories: { type: [ServiceCategorySchema], default: [] },
    popularDestinations: { type: [String], default: [] },
    hiddenGems: { type: [String], default: [] },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

export const Service =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
