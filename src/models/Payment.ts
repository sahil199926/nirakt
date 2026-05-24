import mongoose, { Schema, Document, Types } from "mongoose";

export type PaymentMethod = "razorpay" | "upi" | "cash" | "bank_transfer" | "other";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface IPayment extends Document {
  leadId?: Types.ObjectId;
  leadName?: string;
  leadPhone?: string;
  packageId?: Types.ObjectId;
  packageTitle?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  notes?: string;
  proofImage?: string;
  proofImagePublicId?: string;
  paidAt: Date;
  addedManually: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", index: true },
    leadName: { type: String },
    leadPhone: { type: String },
    packageId: { type: Schema.Types.ObjectId, ref: "Package", index: true },
    packageTitle: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    method: {
      type: String,
      enum: ["razorpay", "upi", "cash", "bank_transfer", "other"] satisfies PaymentMethod[],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"] satisfies PaymentStatus[],
      default: "completed",
    },
    transactionId: { type: String },
    notes: { type: String },
    proofImage: { type: String },
    proofImagePublicId: { type: String },
    paidAt: { type: Date, default: Date.now },
    addedManually: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Payment =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
