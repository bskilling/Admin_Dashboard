// hooks/useTags.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagApi } from "@/lib/api";
import { Tag, TagListResponse } from "./types";
import { toast } from "react-hot-toast";

// Get all tags
export const useTags = (params = {}) => {
  return useQuery<TagListResponse>({
    queryKey: ["tags", params],
    queryFn: () => tagApi.getAll(params).then((res) => res.data.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get tag by slug
export const useTag = (slug: string) => {
  return useQuery<{ tag: Tag }>({
    queryKey: ["tag", slug],
    queryFn: () => tagApi.getBySlug(slug).then((res) => res.data.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
  });
};

// Create tag
export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Tag>) =>
      tagApi.create(data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag created successfully");
    },
    onError: () => {
      toast.error("Failed to create tag");
    },
  });
};

// Update tag
export const useUpdateTag = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Tag>) =>
      tagApi.update(id, data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["tag", id] });
      toast.success("Tag updated successfully");
    },
    onError: () => {
      toast.error("Failed to update tag");
    },
  });
};

// Delete tag
export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagApi.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete tag");
    },
  });
};
