/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/use-blog-queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { blogApi, categoryApi, tagApi, seriesApi } from '@/lib/api/blog-api';
import {
  BlogQueryInput,
  CategoryQueryInput,
  TagQueryInput,
  CreateBlogInput,
  UpdateBlogInput,
  CreateBlogCategoryInput,
  UpdateBlogCategoryInput,
  CreateTagInput,
  UpdateTagInput,
  CreateSeriesInput,
  UpdateSeriesInput,
} from '@/types/blog';

// Query Keys
export const blogQueryKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogQueryKeys.all, 'list'] as const,
  list: (params?: BlogQueryInput) => [...blogQueryKeys.lists(), params] as const,
  details: () => [...blogQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...blogQueryKeys.details(), id] as const,
  slug: (slug: string) => [...blogQueryKeys.all, 'slug', slug] as const,
};

export const categoryQueryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryQueryKeys.all, 'list'] as const,
  list: (params?: CategoryQueryInput) => [...categoryQueryKeys.lists(), params] as const,
  details: () => [...categoryQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryQueryKeys.details(), id] as const,
};

export const tagQueryKeys = {
  all: ['tags'] as const,
  lists: () => [...tagQueryKeys.all, 'list'] as const,
  list: (params?: TagQueryInput) => [...tagQueryKeys.lists(), params] as const,
  details: () => [...tagQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagQueryKeys.details(), id] as const,
};

export const seriesQueryKeys = {
  all: ['series'] as const,
  lists: () => [...seriesQueryKeys.all, 'list'] as const,
  list: (params?: any) => [...seriesQueryKeys.lists(), params] as const,
  details: () => [...seriesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...seriesQueryKeys.details(), id] as const,
};

// Blog Query Hooks
export const useBlogsQuery = (params?: BlogQueryInput) => {
  return useQuery({
    queryKey: blogQueryKeys.list(params),
    queryFn: () => blogApi.getBlogs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBlogQuery = (id: string) => {
  return useQuery({
    queryKey: blogQueryKeys.detail(id),
    queryFn: () => blogApi.getBlogById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id,
  });
};

export const useBlogBySlugQuery = (slug: string, password?: string) => {
  return useQuery({
    queryKey: blogQueryKeys.slug(slug),
    queryFn: () => blogApi.getBlogBySlug(slug, password),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
  });
};

// Blog Mutation Hooks
export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlogInput) => blogApi.createBlog(data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() });
      toast.success(response.message || 'Blog created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create blog';
      toast.error(message);
    },
  });
};

export const useUpdateBlogMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UpdateBlogInput>) => blogApi.updateBlog(id, data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(id) });
      toast.success(response.message || 'Blog updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update blog';
      toast.error(message);
    },
  });
};

export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogApi.deleteBlog(id),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() });
      toast.success(response.message || 'Blog deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete blog';
      toast.error(message);
    },
  });
};

// Category Query Hooks
export const useCategoriesQuery = (params?: CategoryQueryInput) => {
  return useQuery({
    queryKey: categoryQueryKeys.list(params),
    queryFn: () => categoryApi.getCategories(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCategoryQuery = (id: string) => {
  return useQuery({
    queryKey: categoryQueryKeys.detail(id),
    queryFn: () => categoryApi.getCategoryById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id,
  });
};

// Category Mutation Hooks
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlogCategoryInput) => categoryApi.createCategory(data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.lists() });
      toast.success(response.message || 'Category created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create category';
      toast.error(message);
    },
  });
};

export const useUpdateCategoryMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UpdateBlogCategoryInput>) => categoryApi.updateCategory(id, data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.detail(id) });
      toast.success(response.message || 'Category updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update category';
      toast.error(message);
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.lists() });
      toast.success(response.message || 'Category deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete category';
      toast.error(message);
    },
  });
};

// Tag Query Hooks
export const useTagsQuery = (params?: TagQueryInput) => {
  return useQuery({
    queryKey: tagQueryKeys.list(params),
    queryFn: () => tagApi.getTags(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTagQuery = (id: string) => {
  return useQuery({
    queryKey: tagQueryKeys.detail(id),
    queryFn: () => tagApi.getTagById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id,
  });
};

// Tag Mutation Hooks
export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagInput) => tagApi.createTag(data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.lists() });
      toast.success(response.message || 'Tag created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create tag';
      toast.error(message);
    },
  });
};

export const useUpdateTagMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UpdateTagInput>) => tagApi.updateTag(id, data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.detail(id) });
      toast.success(response.message || 'Tag updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update tag';
      toast.error(message);
    },
  });
};

export const useDeleteTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagApi.deleteTag(id),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.lists() });
      toast.success(response.message || 'Tag deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete tag';
      toast.error(message);
    },
  });
};

// Series Query Hooks
export const useSeriesQuery = (params?: any) => {
  return useQuery({
    queryKey: seriesQueryKeys.list(params),
    queryFn: () => seriesApi.getSeries(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSeriesDetailQuery = (id: string) => {
  return useQuery({
    queryKey: seriesQueryKeys.detail(id),
    queryFn: () => seriesApi.getSeriesById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id,
  });
};

// Series Mutation Hooks
export const useCreateSeriesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSeriesInput) => seriesApi.createSeries(data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: seriesQueryKeys.lists() });
      toast.success(response.message || 'Series created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create series';
      toast.error(message);
    },
  });
};

export const useUpdateSeriesMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UpdateSeriesInput>) => seriesApi.updateSeries(id, data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: seriesQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: seriesQueryKeys.detail(id) });
      toast.success(response.message || 'Series updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update series';
      toast.error(message);
    },
  });
};

export const useDeleteSeriesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => seriesApi.deleteSeries(id),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: seriesQueryKeys.lists() });
      toast.success(response.message || 'Series deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete series';
      toast.error(message);
    },
  });
};
