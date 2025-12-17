/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// types/entities.ts

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: ZodValidationError[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export interface ZodValidationError {
  path: (string | number)[];
  message: string;
  code: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Blog Category Entity
export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: BlogCategory | string;
  isActive: boolean;
  imageFile?: {
    _id: string;
    url: string;
    alt?: string;
  };
  color?: string;
  icon?: string;
  displayOrder?: number;
  childCategories?: BlogCategory[];
  blogCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Tag Entity
export interface Tag {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  color?: string;
  blogCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Series Entity
export interface Series {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: {
    _id: string;
    url: string;
    alt?: string;
  };
  isActive: boolean;
  blogs?: Blog[];
  blogCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Author Entity (keeping for future use)
export interface Author {
  _id: string;
  name: string;
  email?: string;
  bio?: string;
  shortBio?: string;
  profilePicture?: {
    _id: string;
    url: string;
    alt?: string;
  };
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    instagram?: string;
    youtube?: string;
    [key: string]: string | undefined;
  };
  role?: string;
  expertise?: string[];
  isActive: boolean;
  blogCount?: number;
  recentBlogs?: Blog[];
  createdAt: string;
  updatedAt: string;
}

// Content Block for structured content
export interface ContentBlock {
  type:
    | 'paragraph'
    | 'heading'
    | 'list'
    | 'quote'
    | 'image'
    | 'video'
    | 'code'
    | 'table'
    | 'callout'
    | 'custom';
  data: any;
  order: number;
}

// SEO Information
export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: {
    _id: string;
    url: string;
    alt?: string;
  };
  canonicalUrl?: string;
  focusKeyword?: string;
  robots?: string;
  structuredData?: any;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterCreator?: string;
  ogType?: 'article' | 'website' | 'profile';
  ogLocale?: string;
  schema?: {
    type: string;
    data: any;
  };
}

// Table of Contents Item
export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

// Translation Information
export interface Translation {
  language: string;
  blogId: string;
}

// Series Information in Blog
export interface BlogSeries {
  seriesId: Series | string;
  order: number;
}

// Blog Entity
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  contentBlocks?: ContentBlock[];
  author?: Author | string;
  adminUser?: string;
  coAuthors?: (Author | string)[];
  categories: (BlogCategory | string)[];
  tags: (Tag | string)[];
  featuredImage?: {
    _id: string;
    url: string;
    alt?: string;
  };
  galleryImages?: {
    _id: string;
    url: string;
    alt?: string;
  }[];
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  visibility: 'public' | 'private' | 'password_protected';
  password?: string;
  passwordProtected?: boolean; // For frontend use
  publishedAt?: string;
  scheduledFor?: string;
  isTopPick: boolean;
  isFeatured: boolean;
  isPinned: boolean;
  relatedBlogs?: (Blog | string)[];
  relatedCourses?: string[];
  series?: BlogSeries;
  seo: SEOData;
  viewCount: number;
  uniqueViewCount: number;
  likeCount: number;
  shareCount: number;
  readTime: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  translations?: Translation[];
  fileAttachments?: {
    _id: string;
    url: string;
    name: string;
    size: number;
  }[];
  lastUpdatedAt?: string;
  tableOfContents?: TOCItem[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// File/Image types for uploads
export interface FileUpload {
  _id: string;
  url: string;
  alt?: string;
  name: string;
  size: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// Common Status Types
export type BlogStatus = 'draft' | 'published' | 'archived' | 'scheduled';
export type BlogVisibility = 'public' | 'private' | 'password_protected';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type SortOrder = 'asc' | 'desc';

// Filter Options
export interface BlogFilters {
  search?: string;
  status?: BlogStatus;
  visibility?: BlogVisibility;
  category?: string;
  tag?: string;
  author?: string;
  featured?: boolean;
  topPick?: boolean;
  difficulty?: DifficultyLevel;
  language?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Sort Options
export interface SortOptions {
  field: 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount' | 'title' | 'readTime';
  order: SortOrder;
}

// Pagination Options
export interface PaginationOptions {
  page: number;
  limit: number;
}

// Complete Query Parameters
export interface QueryParams extends BlogFilters, SortOptions, PaginationOptions {}

// API Request/Response wrappers
export interface ListResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

export interface SingleResponse<T> extends ApiResponse<T> {}

// Statistics/Analytics Types
export interface BlogStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  archivedBlogs: number;
  scheduledBlogs: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  avgReadTime: number;
  topCategories: Array<{
    category: BlogCategory;
    count: number;
  }>;
  topTags: Array<{
    tag: Tag;
    count: number;
  }>;
  recentActivity: Array<{
    type: 'created' | 'updated' | 'published';
    blog: Blog;
    timestamp: string;
  }>;
}
