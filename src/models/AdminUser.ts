// models/AdminUser.ts
import mongoose, { Document, Schema } from "mongoose";

export enum AdminRole {
  SUPER_ADMIN = "superadmin",
  ADMIN = "admin",
}

export interface IAdminUser extends Document {
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: Object.values(AdminRole),
      default: AdminRole.ADMIN,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AdminUser ||
  mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);
