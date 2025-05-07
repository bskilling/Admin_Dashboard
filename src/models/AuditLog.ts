// src/models/AuditLog.ts
import { Schema, model, models } from "mongoose";

// dbConnect().catch(console.error);

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

export interface IAuditLog {
  action: AuditAction;
  entity: string;
  entityId: string;
  userId: string;
  userEmail: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, enum: Object.values(AuditAction), required: true },
    entity: { type: String, required: true },
    entityId: { type: String, required: true },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export default models.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);
