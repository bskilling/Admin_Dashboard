/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/blog-api.ts
import axios from 'axios';
import {
  CreateBlogInput,
  UpdateBlogInput,
  CreateBlogCategoryInput,
  UpdateBlogCategoryInput,
  CreateTagInput,
  UpdateTagInput,
  CreateSeriesInput,
  UpdateSeriesInput,
  BlogQueryInput,
  CategoryQueryInput,
  TagQueryInput,
} from '@/types/blog';
import { ApiResponse, Blog, BlogCategory, Series, Tag } from '@/types/entities';
import env from '../env';

const api = axios.create({
  baseURL: env.BACKEND_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Blog API functions
export const blogApi = {
  // Get all blogs with filters
  getBlogs: async (params?: BlogQueryInput): Promise<ApiResponse<Blog[]>> => {
    const { data } = await api.get('/admin/blogs', { params });
    return data;
  },

  // Get blog by ID
  getBlogById: async (id: string): Promise<ApiResponse<Blog>> => {
    const { data } = await api.get(`/admin/blogs/${id}`);
    return data;
  },

  // Get blog by slug
  getBlogBySlug: async (slug: string, password?: string): Promise<ApiResponse<Blog>> => {
    const { data } = await api.get(`/admin/blogs/slug/${slug}`, {
      params: password ? { password } : undefined,
    });
    return data;
  },

  // Create blog
  createBlog: async (blogData: CreateBlogInput): Promise<ApiResponse<Blog>> => {
    const { data } = await api.post('/admin/blogs', blogData);
    return data;
  },

  // Update blog
  updateBlog: async (
    id: string,
    blogData: Partial<UpdateBlogInput>
  ): Promise<ApiResponse<Blog>> => {
    const { data } = await api.put(`/admin/blogs/${id}`, blogData);
    return data;
  },

  // Delete blog
  deleteBlog: async (id: string): Promise<ApiResponse> => {
    const { data } = await api.delete(`/admin/blogs/${id}`);
    return data;
  },
};

// Category API functions
export const categoryApi = {
  // Get all categories
  getCategories: async (params?: CategoryQueryInput): Promise<ApiResponse<BlogCategory[]>> => {
    const { data } = await api.get('/admin/blogs/categories', { params });
    return data;
  },

  // Get category by ID
  getCategoryById: async (id: string): Promise<ApiResponse<BlogCategory>> => {
    const { data } = await api.get(`/admin/blogs/categories/${id}`);
    return data;
  },

  // Create category
  createCategory: async (
    categoryData: CreateBlogCategoryInput
  ): Promise<ApiResponse<BlogCategory>> => {
    const { data } = await api.post('/admin/blogs/categories', categoryData);
    return data;
  },

  // Update category
  updateCategory: async (
    id: string,
    categoryData: Partial<UpdateBlogCategoryInput>
  ): Promise<ApiResponse<BlogCategory>> => {
    const { data } = await api.put(`/admin/blogs/categories/${id}`, categoryData);
    return data;
  },

  // Delete category
  deleteCategory: async (id: string): Promise<ApiResponse> => {
    const { data } = await api.delete(`/admin/blogs/categories/${id}`);
    return data;
  },
};

// Tag API functions
export const tagApi = {
  // Get all tags
  getTags: async (params?: TagQueryInput): Promise<ApiResponse<Tag[]>> => {
    const { data } = await api.get('/admin/blogs/tags', { params });
    return data;
  },

  // Get tag by ID
  getTagById: async (id: string): Promise<ApiResponse<Tag>> => {
    const { data } = await api.get(`/admin/blogs/tags/${id}`);
    return data;
  },

  // Create tag
  createTag: async (tagData: CreateTagInput): Promise<ApiResponse<Tag>> => {
    const { data } = await api.post('/admin/blogs/tags', tagData);
    return data;
  },

  // Update tag
  updateTag: async (id: string, tagData: Partial<UpdateTagInput>): Promise<ApiResponse<Tag>> => {
    const { data } = await api.put(`/admin/blogs/tags/${id}`, tagData);
    return data;
  },

  // Delete tag
  deleteTag: async (id: string): Promise<ApiResponse> => {
    const { data } = await api.delete(`/admin/blogs/tags/${id}`);
    return data;
  },
};

// Series API functions
export const seriesApi = {
  // Get all series
  getSeries: async (params?: any): Promise<ApiResponse<Series[]>> => {
    const { data } = await api.get('/admin/blogs/series', { params });
    return data;
  },

  // Get series by ID
  getSeriesById: async (id: string): Promise<ApiResponse<Series>> => {
    const { data } = await api.get(`/admin/blogs/series/${id}`);
    return data;
  },

  // Create series
  createSeries: async (seriesData: CreateSeriesInput): Promise<ApiResponse<Series>> => {
    const { data } = await api.post('/admin/blogs/series', seriesData);
    return data;
  },

  // Update series
  updateSeries: async (
    id: string,
    seriesData: Partial<UpdateSeriesInput>
  ): Promise<ApiResponse<Series>> => {
    const { data } = await api.put(`/admin/blogs/series/${id}`, seriesData);
    return data;
  },

  // Delete series
  deleteSeries: async (id: string): Promise<ApiResponse> => {
    const { data } = await api.delete(`/admin/blogs/series/${id}`);
    return data;
  },
};
