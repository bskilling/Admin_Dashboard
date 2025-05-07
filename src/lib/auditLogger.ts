// src/lib/auditLogger.ts
import AuditLog, { AuditAction } from "@/models/AuditLog";
import { getSession } from "next-auth/react";
import { NextApiRequest } from "next";

export async function logAction(
  req: NextApiRequest,
  action: AuditAction,
  entity: string,
  entityId: string,
  metadata?: Record<string, any>
) {
  const session = await getSession({ req });

  if (!session?.user) return;

  await AuditLog.create({
    action,
    entity,
    entityId,
    userId: session.user.id,
    userEmail: session.user.email,
    metadata,
  });
}

// Example usage in API route:
/*
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ... your logic ...
    await logAction(req, AuditAction.CREATE, 'AdminUser', newAdmin._id.toString());
    res.status(201).json(newAdmin);
  } catch (error) {
    // ... error handling ...
  }
}
*/
