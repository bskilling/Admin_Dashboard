// lib/types.ts

export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | BlogCategory;
  isActive: boolean;
  imageFile?: string;
  color?: string;
  icon?: string;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  _id: string;
  name: string;
  email?: string;
  bio?: string;
  shortBio?: string;
  profilePicture?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    instagram?: string;
    youtube?: string;
  };
  role?: string;
  expertise?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export interface TableOfContentsEntry {
  id: string;
  text: string;
  level: number;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  contentBlocks?: ContentBlock[];
  author?: string | Author;
  adminUser?: string;
  coAuthors?: (string | Author)[];
  categories: (string | BlogCategory)[];
  tags: (string | Tag)[];
  featuredImage?: string;
  galleryImages?: string[];
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  visibility: 'public' | 'private' | 'password_protected';
  password?: string;
  publishedAt?: string;
  scheduledFor?: string;
  isTopPick: boolean;
  isFeatured: boolean;
  isPinned: boolean;
  relatedBlogs?: (string | Blog)[];
  relatedCourses?: string[];
  series?: {
    seriesId: string;
    order: number;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage?: string;
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
  };
  viewCount: number;
  uniqueViewCount: number;
  likeCount: number;
  shareCount: number;
  readTime: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  translations?: Array<{
    language: string;
    blogId: string;
  }>;
  fileAttachments?: string[];
  lastUpdatedAt?: string;
  tableOfContents?: TableOfContentsEntry[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Series {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  totalBlogs?: number;
  totalCategories?: number;
  totalTags?: number;
  totalAuthors?: number;
  totalSeries?: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BlogListResponse {
  blogs: Blog[];
  pagination: PaginationData;
}

export interface BlogCategoryListResponse {
  categories: BlogCategory[];
  pagination: PaginationData;
}

export interface TagListResponse {
  tags: Tag[];
  pagination: PaginationData;
}

export interface AuthorListResponse {
  authors: Author[];
  pagination: PaginationData;
}

export interface SeriesListResponse {
  series: Series[];
  pagination: PaginationData;
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  author?: string;
  adminUser?: string;
  status?: 'draft' | 'published' | 'archived' | 'scheduled';
  isFeatured?: boolean;
  isTopPick?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sort?: 'title' | 'oldest' | 'popular' | 'trending' | 'updated';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface BlogFormData {
  title: string;
  slug?: string;
  summary: string;
  content: string;
  contentBlocks?: ContentBlock[];
  author?: string;
  adminUser?: string;
  categories: string[];
  tags: string[];
  featuredImage?: string;
  galleryImages?: string[];
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  visibility: 'public' | 'private' | 'password_protected';
  password?: string;
  scheduledFor?: string;
  isTopPick?: boolean;
  isFeatured?: boolean;
  isPinned?: boolean;
  relatedBlogs?: string[];
  relatedCourses?: string[];
  series?: {
    seriesId: string;
    order: number;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage?: string;
    canonicalUrl?: string;
    focusKeyword?: string;
    robots?: string;
    twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
    twitterCreator?: string;
    ogType?: 'article' | 'website' | 'profile';
    ogLocale?: string;
  };
  readTime?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  fileAttachments?: string[];
}
