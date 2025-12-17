// Add this to your lib/hooks/use-blog-queries.ts file

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateBlogInput } from '@/types/blog';

// Update Blog Mutation
export const useUpdateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateBlogInput) => {
      const { id, ...updateData } = data;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw {
          response: {
            data: result,
          },
          message: result.message || 'Failed to update blog',
        };
      }

      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch blog queries
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', variables.id] });

      // Update the specific blog in cache if it exists
      queryClient.setQueryData(['blog', variables.id], data);
    },
    onError: error => {
      console.error('Update blog mutation error:', error);
    },
  });
};
