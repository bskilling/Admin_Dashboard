// hooks/useBlogs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '@/lib/api';
import { Blog, BlogFormData, BlogListResponse, BlogQueryParams } from './types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Blog list query hook
export const useBlogs = (params: BlogQueryParams = {}) => {
  return useQuery<BlogListResponse>({
    queryKey: ['blogs', params],
    queryFn: () => blogApi.getAll(params).then(res => res.data.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Single blog query hook
export const useBlog = (slug: string) => {
  return useQuery<{ blog: Blog }>({
    queryKey: ['blog', slug],
    queryFn: () => blogApi.getBySlug(slug).then(res => res.data.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!slug, // Only fetch when slug is available
  });
};

// Related blogs query hook
export const useRelatedBlogs = (id: string) => {
  return useQuery<{ relatedBlogs: Blog[] }>({
    queryKey: ['relatedBlogs', id],
    queryFn: () => blogApi.getRelated(id).then(res => res.data.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id, // Only fetch when id is available
  });
};

// Create blog mutation hook
export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: BlogFormData) => blogApi.create(data).then(res => res.data.data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog created successfully');
      // Navigate to the new blog
      if (data.blog.status === 'published') {
        router.push(`/dashboard/blog/${data.blog.slug}`);
      } else {
        router.push('/dashboard/blog'); // Go back to blog list
      }
    },
    onError: () => {
      toast.error('Failed to create blog');
    },
  });
};

// Update blog mutation hook
export const useUpdateBlog = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: BlogFormData) => blogApi.update(id, data).then(res => res.data.data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', data.blog.slug] });
      toast.success('Blog updated successfully');

      // Navigate to the blog
      if (data.blog.status === 'published') {
        router.push(`/dashboard/blog/${data.blog.slug}`);
      } else {
        router.push('/dashboard/blog'); // Go back to blog list
      }
    },
    onError: () => {
      toast.error('Failed to update blog');
    },
  });
};

// Delete blog mutation hook
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => blogApi.delete(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog deleted successfully');
      router.push('/dashboard/blog');
    },
    onError: () => {
      toast.error('Failed to delete blog');
    },
  });
};

// Like blog mutation hook
export const useLikeBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogApi.like(id).then(res => res.data.data),
    onSuccess: (data, variables) => {
      // Update blog data in cache
      queryClient.setQueriesData({ queryKey: ['blog'] }, (oldData: any) => {
        if (oldData && oldData.blog) {
          return {
            ...oldData,
            blog: {
              ...oldData.blog,
              likeCount: data.likeCount,
            },
          };
        }
        return oldData;
      });
    },
  });
};

// Share blog mutation hook
export const useShareBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogApi.share(id).then(res => res.data.data),
    onSuccess: (data, variables) => {
      // Update blog data in cache
      queryClient.setQueriesData({ queryKey: ['blog'] }, (oldData: any) => {
        if (oldData && oldData.blog) {
          return {
            ...oldData,
            blog: {
              ...oldData.blog,
              shareCount: data.shareCount,
            },
          };
        }
        return oldData;
      });
    },
  });
};
