// validators/course.validators.ts
"use client";
import { z } from "zod";

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
            title: z.string(),
            content: z.string(),
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
  whyJoin: z.string(),
});

// Draft course validator: all fields are optional.
export const draftCourseSchema = z.object({
  title: z.string().optional(),
  variant: z.coerce.number().optional(),
  slug: z.string().optional(),
  skills: z.array(z.string().length(24, "Skill is required")).optional(),
  tools: z.array(z.string().length(24, "Tool is required")).optional(),
  videoUrl: z.string().optional(),
  whyJoin: z.array(z.string()).optional(),
  price: z.object({
    amount: z.coerce.number().optional(),
    currency: z.enum(["INR", "USD"]).optional(),
  }),
  description: z.string().optional(),
  durationHours: z.coerce.number().optional(),
  startTime: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date().optional()
  ),
  endTime: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date().optional()
  ),
  certification: z
    .object({
      image: z.string().length(24).optional(),
      title: z.string().optional(),
      content: z.string().optional(),
    })
    .optional(),
  partnerShip: z
    .object({
      image: z.string().length(24).optional(),
      title: z.string().optional(),
      content: z.string().optional(),
    })
    .optional(),
  isPaid: z.boolean().optional(),
  appliedCount: z.number().optional(),
  trainedCount: z.number().optional(),
  highlights: z.array(z.string()).optional(),
  banner: z.string().optional(), // expect an ObjectId string
  previewImage: z.string().optional(),
  logoUrl: z.string().optional(),
  category: z.string().optional(),
  overview: baseOverviewSchema.optional(),
  curriculum: baseCurriculumSchema.optional(),
  images: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

// Published course validator: all fields are required.
export const publishedCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  durationHours: z.number(),
  startTime: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date()
  ),
  endTime: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date()
  ),
  isPaid: z.boolean(),
  // appliedCount and trainedCount can still be optional since they default to 0.
  appliedCount: z.number().optional(),
  trainedCount: z.number().optional(),
  highlights: z.array(z.string()),
  banner: z.string(), // required ObjectId string
  previewImage: z.string(),
  logoUrl: z.string(),
  category: z.string(),
  overview: baseOverviewSchema,
  curriculum: baseCurriculumSchema,
  images: z.array(z.string()).optional(),
  // When publishing, we enforce isPublished to be true.
  isPublished: z.literal(true),
});

export const getCoursesQueryValidator = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(10).optional(),
  isPublished: z.string().optional(), // e.g., "draft" or "published"
  category: z.string().optional(),
});
