import mongoose, { Schema, Document } from "mongoose";

export interface IQRCode extends Document {
  label: string;
  upiId?: string;
  image: string;
  imagePublicId: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const QRCodeSchema: Schema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    upiId: { type: String, trim: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: "" },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const QRCode =
  mongoose.models.QRCode || mongoose.model<IQRCode>("QRCode", QRCodeSchema);
