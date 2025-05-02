// components/blog/TagForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTag, useUpdateTag } from "./useTags";
import { Tag } from "./types";
import { toast } from "react-hot-toast";

// Validation schema
const tagFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name is too long"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),
  description: z.string().max(200, "Description is too long").optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format")
    .optional(),
  isActive: z.boolean().optional(),
});

type TagFormValues = z.infer<typeof tagFormSchema>;

interface TagFormProps {
  initialData?: Tag;
  isEditing?: boolean;
  onComplete?: () => void;
}

const TagForm: React.FC<TagFormProps> = ({
  initialData,
  isEditing = false,
  onComplete,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description || "",
          color: initialData.color || "#3B82F6", // Default to blue
          isActive: initialData.isActive,
        }
      : {
          name: "",
          description: "",
          color: "#3B82F6", // Default to blue
          isActive: true,
        },
  });

  // Auto-generate slug from name
  const name = watch("name");
  const autoGenerateSlug = () => {
    if (name && !isEditing) {
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      setValue("slug", slug);
    }
  };

  // Mutations for creating and updating tags
  const createTagMutation = useCreateTag();
  const updateTagMutation =
    isEditing && initialData ? useUpdateTag(initialData._id) : null;

  // Handle form submission
  const onSubmit = async (data: TagFormValues) => {
    setIsSubmitting(true);

    try {
      if (isEditing && initialData) {
        await updateTagMutation?.mutateAsync(data);
        toast.success("Tag updated successfully");
      } else {
        await createTagMutation.mutateAsync(data);
        toast.success("Tag created successfully");
      }

      // Execute callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving tag:", error);
      toast.error("Failed to save tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Tag name"
          onBlur={autoGenerateSlug}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-1">
          Slug
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">
            /blog/tag/
          </span>
          <input
            id="slug"
            type="text"
            {...register("slug")}
            className="w-full px-4 py-2 border rounded-r-lg"
            placeholder="tag-name"
          />
        </div>
        {errors.slug && (
          <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={2}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Tag description (optional)"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Color */}
      <div>
        <label htmlFor="color" className="block text-sm font-medium mb-1">
          Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            id="color"
            type="color"
            {...register("color")}
            className="h-10 w-10 border-0 p-0"
          />
          <input
            type="text"
            {...register("color")}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="#3B82F6"
          />
        </div>
        {errors.color && (
          <p className="mt-1 text-sm text-red-500">{errors.color.message}</p>
        )}
      </div>

      {/* Active status */}
      <div className="flex items-center">
        <input
          id="isActive"
          type="checkbox"
          {...register("isActive")}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="ml-2 text-sm">
          Active
        </label>
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </div>
          ) : isEditing ? (
            "Update Tag"
          ) : (
            "Create Tag"
          )}
        </button>
      </div>
    </form>
  );
};

export default TagForm;
