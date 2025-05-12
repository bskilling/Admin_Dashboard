// lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Blog API endpoints
export const blogApi = {
  getAll: (params?: Record<string, any>) => api.get('/blogs', { params }),

  getById: (id: string) => api.get(`/blogs/${id}`),

  getBySlug: (slug: string) => api.get(`/blogs/${slug}`),

  create: (data: any) => api.post('/blogs', data),

  update: (id: string, data: any) => api.put(`/blogs/${id}`, data),

  delete: (id: string) => api.delete(`/blogs/${id}`),

  like: (id: string) => api.post(`/blogs/${id}/like`),

  share: (id: string) => api.post(`/blogs/${id}/share`),

  getRelated: (id: string) => api.get(`/blogs/${id}/related`),
};

// Category API endpoints
export const categoryApi = {
  getAll: (params?: Record<string, any>) => api.get('/blogs/categories', { params }),

  getBySlug: (slug: string) => api.get(`/blogs/categories/${slug}`),

  create: (data: any) => api.post('/blogs/categories', data),

  update: (id: string, data: any) => api.put(`/blogs/categories/${id}`, data),

  delete: (id: string) => api.delete(`/blogs/categories/${id}`),
};

// Tag API endpoints
export const tagApi = {
  getAll: (params?: Record<string, any>) => api.get('/blogs/tags', { params }),

  getBySlug: (slug: string) => api.get(`/blogs/tags/${slug}`),

  create: (data: any) => api.post('/blogs/tags', data),

  update: (id: string, data: any) => api.put(`/blogs/tags/${id}`, data),

  delete: (id: string) => api.delete(`/blogs/tags/${id}`),
};

// Author API endpoints
export const authorApi = {
  getAll: (params?: Record<string, any>) => api.get('/blogs/authors', { params }),

  getById: (id: string) => api.get(`/blogs/authors/${id}`),

  create: (data: any) => api.post('/blogs/authors', data),

  update: (id: string, data: any) => api.put(`/blogs/authors/${id}`, data),

  delete: (id: string) => api.delete(`/blogs/authors/${id}`),
};

// Series API endpoints
export const seriesApi = {
  getAll: (params?: Record<string, any>) => api.get('/blogs/series', { params }),

  getBySlug: (slug: string) => api.get(`/blogs/series/${slug}`),

  create: (data: any) => api.post('/blogs/series', data),

  update: (id: string, data: any) => api.put(`/blogs/series/${id}`, data),

  delete: (id: string) => api.delete(`/blogs/series/${id}`),
};

// Blog stats endpoint
export const statsApi = {
  getBlogStats: () => api.get('/blogs/stats'),
};
