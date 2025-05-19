import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(20)
    .transform(val => val.toUpperCase()),
  type: z.enum(['percentage', 'fixed']),
  discount: z.coerce.number().positive(), // <-- coerce from string to number
  expiresAt: z.coerce.date().optional(), // <-- coerce from string to Date
  isActive: z.coerce.boolean().optional().default(true), // <-- for checkbox/select
  usageLimit: z.coerce.number().int().positive().optional(), // <-- optional int
  minPurchaseAmount: z.coerce.number().nonnegative().optional(), // <-- optional number
});

export const updateCouponSchema = createCouponSchema.partial();

export const getCouponsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  type: z.enum(['percentage', 'fixed']).optional(),
  active: z.coerce.boolean().optional(),
});
