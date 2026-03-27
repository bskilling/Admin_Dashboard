// validators/course.validators.ts
'use client';
import { z } from 'zod';

export const baseOverviewSchema = z.object({
  title: z.string(),
  description: z.string(),
  keyFeatures: z.array(z.string()).optional(),
  skillsCovered: z.array(z.string()).optional(),
  trainingOption: z.string().optional(),
});

export const baseCurriculumSchema = z.object({
  eligibility: z.array(z.string()),
  prerequisites: z.array(z.string()),
  chapters: z
    .array(
      z.object({
        title: z.string(),
        lessons: z.array(
          z.object({
            title: z.string().optional(),
            content: z.string().optional(),
          })
        ),
      })
    )
    .optional(),
  projects: z.array(
    z
      .object({
        title: z.string(),
        content: z.array(z.string()),
      })
      .optional()
  ),
});

// ── Reusable sub-schemas ──────────────────────────────────────────────────────

export const gstSchema = z
  .object({
    percentage: z.coerce.number().min(0).max(100).default(18),
    isInclusive: z.boolean().default(false),
  })
  .optional();

export const offerSchema = z.object({
  type: z.enum(['coupon', 'discount', 'referral', 'flash']),
  discountType: z.enum(['flat', 'percentage']).default('percentage'),
  value: z.coerce.number().min(0),
  code: z.string().optional(),
  description: z.string().optional(),
  maxDiscountAmount: z.coerce.number().optional(),
  minOrderAmount: z.coerce.number().optional(),
  validFrom: z.preprocess(
    arg => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
    z.date().optional()
  ),
  validUntil: z.preprocess(
    arg => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
    z.date().optional()
  ),
  usageLimit: z.coerce.number().optional(),
  usedCount: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export const installmentSchema = z.object({
  installmentNumber: z.coerce.number(),
  amount: z.coerce.number().min(1),
  dueDate: z.preprocess(
    arg => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
    z.date()
  ),
  label: z.string().optional(),
});

export const partialPaymentSchema = z
  .object({
    isAllowed: z.boolean().default(false),
    installments: z.array(installmentSchema).default([]),
  })
  .optional();

// ── Draft course validator: all fields optional ───────────────────────────────

export const draftCourseSchema = z.object({
  title: z.string().optional(),
  type: z.enum(['b2i', 'b2b', 'b2c', 'b2g']),
  slug: z.string().optional(),
  variant: z.number().optional(),
  price: z
    .object({
      amount: z.coerce.number().optional(),
      currency: z.enum(['INR', 'USD', 'EUR', 'GBP']).optional(),
    })
    .optional(),

  // ── NEW ──
  gst: gstSchema,
  offers: z.array(offerSchema).optional().default([]),
  partialPayment: partialPaymentSchema,
  // ────────

  whyJoin: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  description: z.string().optional(),
  durationHours: z.coerce.number().optional(),
  startTime: z.preprocess(
    arg => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
    z.date().optional()
  ),
  endTime: z.preprocess(
    arg => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
    z.date().optional()
  ),
  certification: z
    .object({
      title: z.string().optional(),
    })
    .optional(),
  partnerShip: z
    .object({
      title: z.string().optional(),
    })
    .optional(),
  isPaid: z.boolean().optional(),
  appliedCount: z.number().optional(),
  trainedCount: z.number().optional(),
  highlights: z.array(z.string()).optional(),
  outcomes: z.array(z.string()).optional(),
  banner: z.string().optional(),
  broucher: z.string().optional(),
  previewImage: z.string().optional(),
  logoUrl: z.string().optional(),
  category: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  overview: baseOverviewSchema.optional(),
  curriculum: baseCurriculumSchema.optional(),
  images: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  faqs: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional(),
});

// ── Published course validator: strict ───────────────────────────────────────

export const publishedCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.enum(['b2i', 'b2b', 'b2c', 'b2g']),
  durationHours: z.number(),
  startTime: z.preprocess(
    arg => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
    z.date()
  ),
  endTime: z.preprocess(
    arg => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
    z.date()
  ),

  // ── NEW ──
  gst: gstSchema,
  offers: z.array(offerSchema).optional().default([]),
  partialPayment: partialPaymentSchema,
  // ────────

  isPaid: z.boolean(),
  appliedCount: z.number().optional(),
  trainedCount: z.number().optional(),
  highlights: z.array(z.string()),
  banner: z.string(),
  previewImage: z.string(),
  logoUrl: z.string(),
  category: z.string(),
  overview: baseOverviewSchema,
  curriculum: baseCurriculumSchema,
  images: z.array(z.string()).optional(),
  isPublished: z.literal(true),
});

// ── Query validator ───────────────────────────────────────────────────────────

export const getCoursesQueryValidator = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(10).optional(),
  isPublished: z.string().optional(),
  category: z.string().optional(),
});
