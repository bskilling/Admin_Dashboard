// hooks/useCategories.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "@/lib/api";
import { BlogCategory, BlogCategoryListResponse } from "./types";
import { toast } from "react-hot-toast";

// Get all categories
export const useCategories = (params = {}) => {
  return useQuery<BlogCategoryListResponse>({
    queryKey: ["categories", params],
    queryFn: () => categoryApi.getAll(params).then((res) => res.data.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get category by slug
export const useCategory = (slug: string) => {
  return useQuery<{ category: BlogCategory }>({
    queryKey: ["category", slug],
    queryFn: () => categoryApi.getBySlug(slug).then((res) => res.data.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
  });
};

// Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BlogCategory>) =>
      categoryApi.create(data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
    },
    onError: () => {
      toast.error("Failed to create category");
    },
  });
};

// Update category
export const useUpdateCategory = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BlogCategory>) =>
      categoryApi.update(id, data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      toast.success("Category updated successfully");
    },
    onError: () => {
      toast.error("Failed to update category");
    },
  });
};

// Delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });
};
