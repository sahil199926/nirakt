import mongoose, { Schema, Document, Types } from "mongoose";

export type LeadSource = "contact_form" | "cta_banner" | "hero_form" | "package_enquiry" | "lock_in" | "qr_payment";
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

export interface ILead extends Document {
  // Contact
  name: string;
  phone: string;
  email?: string;

  // Source
  source: LeadSource;
  isLockIn: boolean;

  // Trip intent
  destinationType?: string;
  preferredDestination?: string;
  travelDate?: string;
  travelers?: number;
  budget?: string;
  message?: string;

  // Package link (present for lock_in and package_enquiry sources)
  packageId?: Types.ObjectId;
  packageTitle?: string;

  // Lock-in payment (only when source === "lock_in")
  lockIn?: {
    amountPaid: number;
    transactionId?: string;
    paidAt: Date;
    verified: boolean;
  };

  // CRM
  status: LeadStatus;
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const LockInSchema: Schema = new Schema(
  {
    amountPaid: { type: Number, required: true },
    transactionId: { type: String },
    paidAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const LeadSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true },

    source: {
      type: String,
      enum: ["contact_form", "cta_banner", "hero_form", "package_enquiry", "lock_in", "qr_payment"] satisfies LeadSource[],
      required: true,
      index: true,
    },
    // Quick flag so lock-in leads can be filtered instantly without checking source
    isLockIn: { type: Boolean, default: false, index: true },

    destinationType: { type: String },
    preferredDestination: { type: String },
    travelDate: { type: String },
    travelers: { type: Number },
    budget: { type: String },
    message: { type: String },

    packageId: { type: Schema.Types.ObjectId, ref: "Package", index: true },
    packageTitle: { type: String },

    lockIn: { type: LockInSchema },

    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "lost"] satisfies LeadStatus[],
      default: "new",
      index: true,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

// Compound index — most common CRM query: all new/lock-in leads sorted by date
LeadSchema.index({ isLockIn: 1, status: 1, createdAt: -1 });

export const Lead = mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
