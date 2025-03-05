"use client";
import { z } from "zod";

export interface IAllCourses {
  courses: Course[];
  pagination: Pagination;
}
interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}
interface Course {
  overview: Overview;
  curriculum: Curriculum;
  _id: string;
  title: string;
  description: string;
  isPaid: boolean;
  appliedCount: number;
  trainedCount: number;
  highlights: any[];
  images: any[];
  isPublished: boolean;
  __v: number;
  banner: Banner;
  logoUrl: Banner;
  category: string;
  previewImage: Banner;
}
interface Banner {
  _id: string;
  viewUrl: string;
}
interface Curriculum {
  eligibility: string;
  prerequisites: string;
  chapters: any[];
  whyJoin: string;
}
interface Overview {
  title: string;
  description: string;
  keyFeatures: any[];
  skillsCovered: any[];
}

export const baseOverviewSchema = z.object({
  title: z.string(),
  description: z.string(),
  keyFeatures: z.array(z.string()).optional(),
  skillsCovered: z.array(z.string()).optional(),
  trainingOption: z.string().optional(),
});

export const baseCurriculumSchema = z.object({
  eligibility: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  projects: z.array(
    z
      .object({
        title: z.string(),
        content: z.array(z.string()),
      })
      .optional()
  ),
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
  whyJoin: z.string().optional(),
});

export const publishedCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  durationHours: z.number(),
  whyJoin: z.array(z.string()),
  skills: z.array(z.string()),
  videoUrl: z.string(),
  slug: z.string(),
  price: z.object({
    amount: z.coerce.number(),
    currency: z.enum(["INR", "USD", "EUR", "GBP"]),
  }),

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
  certification: z.object({
    image: z.string().length(24),
    title: z.string(),
    content: z.string(),
  }),
  partnerShip: z
    .object({
      image: z.string().length(24).optional(),
      title: z.string().optional(),
      content: z.string().optional(),
    })
    .optional(),
  isPaid: z.boolean(),
  // appliedCount and trainedCount can still be optional since they default to 0.
  appliedCount: z.number().optional(),
  trainedCount: z.number().optional(),
  highlights: z.array(z.string()),
  banner: z.string().length(24, "Banner Required"), // required ObjectId string
  previewImage: z.string().length(24, "Preview Image Required"),
  logoUrl: z.string().length(24, "Logo Required"),
  category: z.string(),
  overview: baseOverviewSchema,
  curriculum: baseCurriculumSchema,
  images: z.array(z.string()).optional(),
  // When publishing, we enforce isPublished to be true.

  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});
