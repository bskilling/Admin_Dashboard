// components/blog/BlogForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import RichTextEditor from "./RichTextEditor";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useCategories } from "../../_components/useCategories";
import { useTags } from "../../_components/useTags";
import { useCreateBlog, useUpdateBlog } from "../../_components/useblog";
import { Blog, BlogCategory, Tag } from "../../_components/types";

// Validation schema
const blogFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(500, "Summary is too long"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  status: z.enum(["draft", "published", "archived", "scheduled"]),
  visibility: z.enum(["public", "private", "password_protected"]),
  password: z.string().optional(),
  scheduledFor: z.string().optional(),
  isTopPick: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  seo: z.object({
    metaTitle: z
      .string()
      .max(70, "Meta title should be 70 characters or less")
      .optional(),
    metaDescription: z
      .string()
      .max(160, "Meta description should be 160 characters or less")
      .optional(),
    keywords: z.array(z.string()).optional(),
    focusKeyword: z.string().optional(),
  }),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  initialData?: Blog;
  isEditing?: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({
  initialData,
  isEditing = false,
}) => {
  const router = useRouter();

  // Get categories and tags for select inputs
  const { data: categoryData, isLoading: categoriesLoading } = useCategories();
  const { data: tagData, isLoading: tagsLoading } = useTags();

  // Setup form with react-hook-form and zod validation
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          summary: initialData.summary,
          content: initialData.content,
          categories: Array.isArray(initialData.categories)
            ? initialData.categories.map((category) =>
                typeof category === "string" ? category : category._id
              )
            : [],
          tags: Array.isArray(initialData.tags)
            ? initialData.tags.map((tag) =>
                typeof tag === "string" ? tag : tag._id
              )
            : [],
          featuredImage: initialData.featuredImage as string,
          status: initialData.status,
          visibility: initialData.visibility,
          password: initialData.password,
          scheduledFor: initialData.scheduledFor
            ? format(new Date(initialData.scheduledFor), "yyyy-MM-dd'T'HH:mm")
            : undefined,
          isTopPick: initialData.isTopPick,
          isFeatured: initialData.isFeatured,
          isPinned: initialData.isPinned,
          difficulty: initialData.difficulty,
          seo: {
            metaTitle: initialData.seo?.metaTitle || initialData.title,
            metaDescription:
              initialData.seo?.metaDescription || initialData.summary,
            keywords: initialData.seo?.keywords || [],
            focusKeyword: initialData.seo?.focusKeyword,
          },
        }
      : {
          title: "",
          summary: "",
          content: "",
          categories: [],
          tags: [],
          status: "draft",
          visibility: "public",
          seo: {
            metaTitle: "",
            metaDescription: "",
            keywords: [],
            focusKeyword: "",
          },
        },
  });

  // Watch form values for dynamic updates
  const title = watch("title");
  const status = watch("status");
  const visibility = watch("visibility");

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !isEditing) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      setValue("slug", slug);

      // Also update SEO title if not manually set
      if (!watch("seo.metaTitle")) {
        setValue("seo.metaTitle", title);
      }
    }
  }, [title, setValue, watch, isEditing]);

  // Update SEO summary when blog summary changes
  useEffect(() => {
    const summary = watch("summary");
    if (summary && !watch("seo.metaDescription")) {
      setValue("seo.metaDescription", summary);
    }
  }, [watch, setValue]);

  // Mutations for creating and updating blogs
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog(initialData?._id || "");

  // Handle form submission
  const onSubmit = async (data: BlogFormValues) => {
    try {
      // Prepare blog data
      const blogData = {
        ...data,
        // Convert scheduled date to ISO string if exists
        scheduledFor: data.scheduledFor
          ? new Date(data.scheduledFor).toISOString()
          : undefined,
      };

      if (isEditing && initialData) {
        await updateBlogMutation.mutateAsync(blogData);
      } else {
        await createBlogMutation.mutateAsync(blogData);
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Failed to save blog");
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    router.back();
  };

  // Handle featured image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("file", file);

    try {
      // In a real app, you would upload to your API
      // This is a placeholder for actual upload functionality
      toast.error("Image upload functionality needs to be implemented");
      // After upload succeeds, set the image URL:
      // setValue('featuredImage', response.data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  // Loading state
  if (categoriesLoading || tagsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Your blog title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1">
              Slug
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">
                /blog/
              </span>
              <input
                id="slug"
                type="text"
                {...register("slug")}
                className="w-full px-4 py-2 border rounded-r-lg"
                placeholder="your-blog-title"
              />
            </div>
            {errors.slug && (
              <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium mb-1">
              Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              id="summary"
              {...register("summary")}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="A brief summary of your blog post"
            />
            {errors.summary && (
              <p className="mt-1 text-sm text-red-500">
                {errors.summary.message}
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">
                {errors.content.message}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Publishing options */}
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Publishing Options</h3>

            {/* Status */}
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                {...register("status")}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
                <option value="scheduled">Scheduled</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Scheduled date (show only if status is scheduled) */}
            {status === "scheduled" && (
              <div className="mb-4">
                <label
                  htmlFor="scheduledFor"
                  className="block text-sm font-medium mb-1"
                >
                  Schedule Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="scheduledFor"
                  type="datetime-local"
                  {...register("scheduledFor")}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                {errors.scheduledFor && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.scheduledFor.message}
                  </p>
                )}
              </div>
            )}

            {/* Visibility */}
            <div className="mb-4">
              <label
                htmlFor="visibility"
                className="block text-sm font-medium mb-1"
              >
                Visibility <span className="text-red-500">*</span>
              </label>
              <select
                id="visibility"
                {...register("visibility")}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="password_protected">Password Protected</option>
              </select>
              {errors.visibility && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.visibility.message}
                </p>
              )}
            </div>

            {/* Password (show only if visibility is password_protected) */}
            {visibility === "password_protected" && (
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}

            {/* Featured options */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center">
                <input
                  id="isFeatured"
                  type="checkbox"
                  {...register("isFeatured")}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isFeatured" className="ml-2 text-sm">
                  Feature this post
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="isTopPick"
                  type="checkbox"
                  {...register("isTopPick")}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isTopPick" className="ml-2 text-sm">
                  Mark as Top Pick
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="isPinned"
                  type="checkbox"
                  {...register("isPinned")}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isPinned" className="ml-2 text-sm">
                  Pin to top of blog
                </label>
              </div>
            </div>
          </div>

          {/* Categories & Tags */}
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Categories & Tags</h3>

            {/* Categories */}
            <div className="mb-4">
              <label
                htmlFor="categories"
                className="block text-sm font-medium mb-1"
              >
                Categories <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="categories"
                render={({ field }) => (
                  <select
                    multiple
                    className="w-full px-4 py-2 border rounded-lg"
                    value={field.value}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions);
                      field.onChange(options.map((option) => option.value));
                    }}
                  >
                    {categoryData?.categories.map((category: BlogCategory) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.categories && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.categories.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Hold Ctrl/Cmd to select multiple
              </p>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-1">
                Tags
              </label>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <select
                    multiple
                    className="w-full px-4 py-2 border rounded-lg"
                    value={field.value || []}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions);
                      field.onChange(options.map((option) => option.value));
                    }}
                  >
                    {tagData?.tags.map((tag: Tag) => (
                      <option key={tag._id} value={tag._id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              // Continuing from the previous BlogForm component
              {errors.tags && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.tags.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Hold Ctrl/Cmd to select multiple
              </p>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Featured Image</h3>

            {/* Current image preview */}
            {watch("featuredImage") && (
              <div className="mb-4">
                <div className="relative w-full h-40 rounded-lg overflow-hidden">
                  <img
                    src={watch("featuredImage") ?? ""}
                    alt="Featured Image"
                    className="object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setValue("featuredImage", "")}
                  className="mt-2 text-red-500 text-sm hover:text-red-700"
                >
                  Remove Image
                </button>
              </div>
            )}

            {/* Image upload */}
            {!watch("featuredImage") && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-12 0H8m16 0a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-4 flex text-sm justify-center">
                  <label
                    htmlFor="featured-image-upload"
                    className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                  >
                    <span>Upload an image</span>
                    <input
                      id="featured-image-upload"
                      name="featured-image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>

          {/* SEO options */}
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">SEO Settings</h3>

            {/* Meta Title */}
            <div className="mb-4">
              <label
                htmlFor="seo.metaTitle"
                className="block text-sm font-medium mb-1"
              >
                Meta Title
              </label>
              <input
                id="seo.metaTitle"
                type="text"
                {...register("seo.metaTitle")}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="SEO Title (defaults to post title)"
              />
              {errors.seo?.metaTitle && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.seo.metaTitle.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {watch("seo.metaTitle")?.length || 0}/70 characters
              </p>
            </div>

            {/* Meta Description */}
            <div className="mb-4">
              <label
                htmlFor="seo.metaDescription"
                className="block text-sm font-medium mb-1"
              >
                Meta Description
              </label>
              <textarea
                id="seo.metaDescription"
                {...register("seo.metaDescription")}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="SEO Description (defaults to post summary)"
              />
              {errors.seo?.metaDescription && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.seo.metaDescription.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {watch("seo.metaDescription")?.length || 0}/160 characters
              </p>
            </div>

            {/* Focus Keyword */}
            <div className="mb-4">
              <label
                htmlFor="seo.focusKeyword"
                className="block text-sm font-medium mb-1"
              >
                Focus Keyword
              </label>
              <input
                id="seo.focusKeyword"
                type="text"
                {...register("seo.focusKeyword")}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Main keyword for this post"
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Additional Keywords
              </label>
              <Controller
                control={control}
                name="seo.keywords"
                render={({ field }) => (
                  <div>
                    <input
                      type="text"
                      placeholder="Add keywords and press Enter"
                      className="w-full px-4 py-2 border rounded-lg"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const target = e.target as HTMLInputElement;
                          const value = target.value.trim();

                          if (value && !field.value?.includes(value)) {
                            field.onChange([...(field.value || []), value]);
                            target.value = "";
                          }
                        }
                      }}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value?.map((keyword, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          <span>{keyword}</span>
                          <button
                            type="button"
                            className="ml-2 text-gray-500 hover:text-gray-700"
                            onClick={() => {
                              const newKeywords = [...(field.value || [])];
                              newKeywords.splice(index, 1);
                              field.onChange(newKeywords);
                            }}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Additional Settings</h3>

            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium mb-1"
              >
                Difficulty Level
              </label>
              <select
                id="difficulty"
                {...register("difficulty")}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Not specified</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.difficulty && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.difficulty.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </div>
          ) : isEditing ? (
            "Update Post"
          ) : (
            "Create Post"
          )}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;
