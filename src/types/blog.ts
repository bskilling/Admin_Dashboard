// lib/validations/blog.ts
import { z } from 'zod';

// MongoDB ObjectId validation
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

// Blog Category Schemas
export const createBlogCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  // parent: objectIdSchema.optional(),
  isActive: z.boolean().default(true),
  // imageFile: objectIdSchema.optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional(),
  icon: z.string().max(50, 'Icon must be less than 50 characters').optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateBlogCategorySchema = createBlogCategorySchema.partial();

// Tag Schemas
export const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().max(300, 'Description must be less than 300 characters').optional(),
  isActive: z.boolean().default(true),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional(),
});

export const updateTagSchema = createTagSchema.partial();

// Author Schemas
export const createAuthorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format').optional(),
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
  shortBio: z.string().max(160, 'Short bio must be less than 160 characters').optional(),
  profilePicture: objectIdSchema.optional(),
  socialLinks: z
    .object({
      twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
      linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
      github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
      website: z.string().url('Invalid website URL').optional().or(z.literal('')),
      instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
      youtube: z.string().url('Invalid YouTube URL').optional().or(z.literal('')),
    })
    .optional(),
  role: z.string().max(100, 'Role must be less than 100 characters').optional(),
  expertise: z
    .array(z.string().max(50, 'Expertise item must be less than 50 characters'))
    .optional(),
  isActive: z.boolean().default(true),
});

export const updateAuthorSchema = createAuthorSchema.partial();

// Content Block Schema
export const contentBlockSchema = z.object({
  type: z.enum([
    'paragraph',
    'heading',
    'list',
    'quote',
    'image',
    'video',
    'code',
    'table',
    'callout',
    'custom',
  ]),
  data: z.any(),
  order: z.number().int().min(0),
});

// SEO Schema
export const seoSchema = z.object({
  metaTitle: z.string().min(1, 'Meta title is required'),
  // .max(60, "Meta title should be less than 60 characters"),
  metaDescription: z.string().min(1, 'Meta description is required'),
  keywords: z.array(z.string().max(100, 'Keyword must be less than 50 characters')).default([]),
  ogImage: objectIdSchema.optional(),
  canonicalUrl: z.string().url('Invalid canonical URL').optional(),
  focusKeyword: z.string().max(100, 'Focus keyword must be less than 100 characters').optional(),
  robots: z
    .string()
    .max(100, 'Robots directive must be less than 100 characters')
    .default('index, follow'),
  structuredData: z.any().optional(),
  twitterCard: z
    .enum(['summary', 'summary_large_image', 'app', 'player'])
    .default('summary_large_image'),
  twitterCreator: z.string().max(50, 'Twitter creator must be less than 50 characters').optional(),
  ogType: z.enum(['article', 'website', 'profile']).default('article'),
  ogLocale: z.string().max(10, 'OG locale must be less than 10 characters').default('en_US'),
  schema: z
    .object({
      type: z
        .string()
        .max(50, 'Schema type must be less than 50 characters')
        .default('BlogPosting'),
      data: z.any().optional(),
    })
    .optional(),
});

// Series Schema
export const seriesSchema = z.object({
  seriesId: objectIdSchema,
  order: z.number().int().min(1, 'Series order must be at least 1'),
});

// Table of Contents Schema
export const tableOfContentsSchema = z.object({
  id: z.string().min(1, 'TOC ID is required').max(100, 'TOC ID must be less than 100 characters'),
  text: z
    .string()
    .min(1, 'TOC text is required')
    .max(200, 'TOC text must be less than 200 characters'),
  level: z.number().int().min(1).max(6, 'TOC level must be between 1 and 6'),
});

// Translation Schema
export const translationSchema = z.object({
  language: z
    .string()
    .length(2, 'Language code must be 2 characters')
    .regex(/^[a-z]{2}$/, 'Language code must be lowercase letters'),
  blogId: objectIdSchema,
});

// Blog Schemas
export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(350, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  banner: z.string().url('Invalid banner URL').optional(),
  series: z.string().length(24),
  summary: z
    .string()
    .min(1, 'Summary is required')
    .max(1000, 'Summary must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  contentBlocks: z.array(contentBlockSchema).optional(),
  author: objectIdSchema.optional(),
  adminUser: objectIdSchema.optional(),
  coAuthors: z.array(objectIdSchema).optional(),
  categories: z.array(objectIdSchema).min(1, 'At least one category is required'),
  tags: z.array(objectIdSchema).default([]),
  featuredImage: objectIdSchema.optional(),
  galleryImages: z.array(objectIdSchema).optional(),
  status: z.enum(['draft', 'published', 'archived', 'scheduled']).default('draft'),
  visibility: z.enum(['public', 'private', 'password_protected']).default('public'),

  publishedAt: z.date().optional(),
  isTopPick: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  relatedBlogs: z.array(objectIdSchema).optional(),
  relatedCourses: z.array(objectIdSchema).optional(),
  // series: seriesSchema.optional(),
  seo: seoSchema,
  readTime: z.number().int().min(0, 'Read time must be non-negative').default(0),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  language: z
    .string()
    .length(2, 'Language code must be 2 characters')
    .regex(/^[a-z]{2}$/, 'Language code must be lowercase letters')
    .default('en'),
  translations: z.array(translationSchema).optional(),
  fileAttachments: z.array(objectIdSchema).optional(),
  tableOfContents: z.array(tableOfContentsSchema).optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateBlogSchema = createBlogSchema.partial().extend({
  id: objectIdSchema,
});

// Series Schemas
export const createSeriesSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  coverImage: z.string().url().optional(),
  isActive: z.boolean().default(true),
});

export const updateSeriesSchema = createSeriesSchema.partial();

// Query Schemas
export const blogQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  status: z.enum(['draft', 'published', 'archived', 'scheduled']).optional(),
  category: objectIdSchema.optional(),
  tag: objectIdSchema.optional(),
  author: objectIdSchema.optional(),
  search: z.string().max(100, 'Search query must be less than 100 characters').optional(),
  sort: z
    .enum(['createdAt', 'updatedAt', 'publishedAt', 'viewCount', 'title'])
    .default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  featured: z.enum(['true', 'false']).optional(),
  topPick: z.enum(['true', 'false']).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  language: z
    .string()
    .length(2)
    .regex(/^[a-z]{2}$/)
    .optional(),
});

export const categoryQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  parent: objectIdSchema.optional(),
  isActive: z.enum(['true', 'false']).optional(),
  search: z.string().max(100, 'Search query must be less than 100 characters').optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'name', 'displayOrder']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const tagQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  isActive: z.enum(['true', 'false']).optional(),
  search: z.string().max(100, 'Search query must be less than 100 characters').optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'name']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const authorQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  isActive: z.enum(['true', 'false']).optional(),
  search: z.string().max(100, 'Search query must be less than 100 characters').optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'name']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports
export type CreateBlogCategoryInput = z.infer<typeof createBlogCategorySchema>;
export type UpdateBlogCategoryInput = z.infer<typeof updateBlogCategorySchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type CreateAuthorInput = z.infer<typeof createAuthorSchema>;
export type UpdateAuthorInput = z.infer<typeof updateAuthorSchema>;
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type CreateSeriesInput = z.infer<typeof createSeriesSchema>;
export type UpdateSeriesInput = z.infer<typeof updateSeriesSchema>;
export type BlogQueryInput = z.infer<typeof blogQuerySchema>;
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;
export type TagQueryInput = z.infer<typeof tagQuerySchema>;
export type AuthorQueryInput = z.infer<typeof authorQuerySchema>;
