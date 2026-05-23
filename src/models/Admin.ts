import mongoose, { Schema, Document } from "mongoose";

export type AdminRole = "super_admin" | "editor";

export interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name:         { type: String, required: true },
    email:        { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: ["super_admin", "editor"], default: "editor" },
    isActive:     { type: Boolean, default: true },
    lastLoginAt:  { type: Date },
  },
  { timestamps: true }
);

export const Admin =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
