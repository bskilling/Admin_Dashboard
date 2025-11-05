// components/blog/BlogForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import RichTextEditor from './RichTextEditor';
import Image from 'next/image';
import { toast } from 'sonner';
import { useCategories } from '../../_components/useCategories';
import { useTags } from '../../_components/useTags';
import { useCreateBlog, useUpdateBlog } from '../../_components/useblog';
import { Blog, BlogCategory, Tag } from '../../_components/types';
import FileUploader from '@/app/dashboard/categories/add-course/draft/[id]/_components/FileUploader';
import RelatedContents from './RelatedContents';

// Validation schema
const blogFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long'),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  summary: z
    .string()
    .min(10, 'Summary must be at least 10 characters')
    .max(500, 'Summary is too long'),
  content: z.string().min(50, 'Content must be at least 50 characters'),

  author: z.string().optional(), // Assuming this will be ObjectId as string
  adminUser: z.string().optional(), // Assuming this will be ObjectId as string
  coAuthors: z.array(z.string()).optional(), // Array of ObjectIds
  categories: z.array(z.string()).min(1, 'At least one category is required'), // Array of ObjectIds
  tags: z.array(z.string()).optional(), // Array of ObjectIds
  featuredImage: z.string().optional(), // Assuming this will be ObjectId as string
  status: z.enum(['draft', 'published', 'archived', 'scheduled']),
  visibility: z.enum(['public', 'private', 'password_protected']),
  password: z.string().optional(),
  publishedAt: z.string().optional(), // Date as ISO string
  scheduledFor: z.string().optional(), // Date as ISO string
  isTopPick: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  relatedBlogs: z.array(z.string()).optional(), // Array of ObjectIds
  relatedCourses: z.array(z.string()).optional(), // Array of ObjectIds

  seo: z.object({
    metaTitle: z.string().max(70, 'Meta title should be 70 characters or less'),
    metaDescription: z.string().max(160, 'Meta description should be 160 characters or less'),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().optional(), // ObjectId as string
    canonicalUrl: z.string().url(),
    focusKeyword: z.string().optional(),
    robots: z.string().optional(),
    structuredData: z.any().optional(),
    twitterCard: z.enum(['summary', 'summary_large_image', 'app', 'player']).optional(),
    twitterCreator: z.string().optional(),
    ogType: z.enum(['article', 'website', 'profile']).optional(),
    ogLocale: z.string().optional(),
    schema: z
      .object({
        type: z.string().optional(),
        data: z.any().optional(),
      })
      .optional(),
  }),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  language: z.string().optional(),
  translations: z
    .array(
      z.object({
        language: z.string(),
        blogId: z.string(), // ObjectId as string
      })
    )
    .optional(),
  fileAttachments: z.array(z.string()).optional(), // Array of ObjectIds
  lastUpdatedAt: z.string().optional(), // Date as ISO string
  tableOfContents: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        level: z.number(),
      })
    )
    .optional(),
  metadata: z.any().optional(),
});

// type BlogFormValues = z.infer<typeof blogFormSchema>;
type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  initialData?: Blog;
  isEditing?: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({ initialData, isEditing = false }) => {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [urls, setUrls] = useState<string[]>([]);
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
    getValues,
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
            ? initialData.categories.map(category =>
                typeof category === 'string' ? category : category._id
              )
            : [],
          tags: Array.isArray(initialData.tags)
            ? initialData.tags.map(tag => (typeof tag === 'string' ? tag : tag._id))
            : [],
          featuredImage: initialData.featuredImage?._id as string,
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
            metaDescription: initialData.seo?.metaDescription || initialData.summary,
            keywords: initialData.seo?.keywords || [],
            focusKeyword: initialData.seo?.focusKeyword,
          },
        }
      : {
          title: '',
          summary: '',
          content: '',
          categories: [],
          tags: [],
          status: 'draft',
          visibility: 'public',
          seo: {
            metaTitle: '',
            metaDescription: '',
            keywords: [],
            focusKeyword: '',
          },
        },
  });

  // Watch form values for dynamic updates
  const title = watch('title');
  const status = watch('status');
  const visibility = watch('visibility');

  // Auto-generate slug from title
  useEffect(() => {
    if (initialData?.featuredImage?.viewUrl) {
      setCurrentUrl(initialData.featuredImage?.viewUrl);
    }

    if (title && !isEditing) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      setValue('slug', slug);

      // Also update SEO title if not manually set
      if (!watch('seo.metaTitle')) {
        setValue('seo.metaTitle', title);
      }
    }
  }, [title, setValue, watch, isEditing]);

  // Update SEO summary when blog summary changes
  useEffect(() => {
    const summary = watch('summary');
    if (summary && !watch('seo.metaDescription')) {
      setValue('seo.metaDescription', summary);
    }
  }, [watch, setValue]);

  // Mutations for creating and updating blogs
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog(initialData?._id || '');

  // Handle form submission
  const onSubmit = async (data: BlogFormValues) => {
    try {
      // Prepare blog data
      const blogData = {
        ...data,
        // Convert scheduled date to ISO string if exists
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor).toISOString() : undefined,
      };

      if (isEditing && initialData) {
        // @ts-expect-error
        await updateBlogMutation.mutateAsync(blogData);
      } else {
        // @ts-expect-error
        await createBlogMutation.mutateAsync(blogData);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog');
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
    formData.append('file', file);

    try {
      // In a real app, you would upload to your API
      // This is a placeholder for actual upload functionality
      toast.error('Image upload functionality needs to be implemented');
      // After upload succeeds, set the image URL:
      // setValue('featuredImage', response.data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
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
    <form
      onSubmit={e => {
        e.preventDefault();
        console.log('submitted');
        const data = getValues();
        // console.log(blogFormSchema.safeParse(data).error.);
        const path = blogFormSchema.safeParse(data)?.error?.errors?.[0]?.path;
        const error = blogFormSchema.safeParse(data)?.error?.errors?.[0]?.message;
        console.log('error', error);
        if (error) {
          toast.error(`${path} : ${error}`);
          return;
        }
        handleSubmit(data => {
          console.log('data', data);

          onSubmit(data);
        })(e);
      }}
      className="space-y-8"
    >
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
              {...register('title')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Your blog title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
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
                {...register('slug')}
                className="w-full px-4 py-2 border rounded-r-lg"
                placeholder="your-blog-title"
              />
            </div>
            {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium mb-1">
              Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              id="summary"
              {...register('summary')}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="A brief summary of your blog post"
            />
            {errors.summary && (
              <p className="mt-1 text-sm text-red-500">{errors.summary.message}</p>
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
                <RichTextEditor content={field.value} onChange={field.onChange} />
              )}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          {/* Related Contents */}
          <RelatedContents control={control} initialData={initialData} />

          {/* Advanced SEO Options */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Canonical URL</label>
              <input
                type="text"
                {...register('seo.canonicalUrl')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://example.com/canonical-path"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Robots Meta</label>
              <input
                type="text"
                {...register('seo.robots')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="index, follow"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">OG Type</label>
                <select {...register('seo.ogType')} className="w-full px-4 py-2 border rounded-lg">
                  <option value="article">Article</option>
                  <option value="website">Website</option>
                  <option value="profile">Profile</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Twitter Card</label>
                <select
                  {...register('seo.twitterCard')}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Twitter Creator</label>
              <input
                type="text"
                {...register('seo.twitterCreator')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">OG Image</label>
              <FileUploader
                setFileId={id => {
                  if (!id) return;
                  setValue('seo.ogImage', id);
                }}
                title="Upload OG Image"
                id={watch('seo.ogImage')}
                label="Upload Image"
                setUrl={url => {
                  /* Handle URL if needed */
                }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Publishing options */}
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Publishing Options</h3>

            {/* Status */}
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                {...register('status')}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
                <option value="scheduled">Scheduled</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            {/* Scheduled date (show only if status is scheduled) */}
            {status === 'scheduled' && (
              <div className="mb-4">
                <label htmlFor="scheduledFor" className="block text-sm font-medium mb-1">
                  Schedule Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="scheduledFor"
                  type="datetime-local"
                  {...register('scheduledFor')}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                {errors.scheduledFor && (
                  <p className="mt-1 text-sm text-red-500">{errors.scheduledFor.message}</p>
                )}
              </div>
            )}

            {/* Visibility */}
            <div className="mb-4">
              <label htmlFor="visibility" className="block text-sm font-medium mb-1">
                Visibility <span className="text-red-500">*</span>
              </label>
              <select
                id="visibility"
                {...register('visibility')}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="password_protected">Password Protected</option>
              </select>
              {errors.visibility && (
                <p className="mt-1 text-sm text-red-500">{errors.visibility.message}</p>
              )}
            </div>

            {/* Password (show only if visibility is password_protected) */}
            {visibility === 'password_protected' && (
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            )}

            {/* Featured options */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center">
                <input
                  id="isFeatured"
                  type="checkbox"
                  {...register('isFeatured')}
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
                  {...register('isTopPick')}
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
                  {...register('isPinned')}
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
            <h3 className="text-lg font-semibold mb-6">Categories & Tags aa</h3>

            {/* Categories */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Categories <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="categories"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {categoryData?.categories.map((category: BlogCategory) => {
                      const isSelected = field.value?.includes(category._id);
                      return (
                        <button
                          type="button"
                          key={category._id}
                          onClick={() => {
                            const newValue = isSelected
                              ? field.value.filter((id: string) => id !== category._id)
                              : [...(field.value || []), category._id];
                            field.onChange(newValue);
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm border transition ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              {errors.categories && (
                <p className="mt-2 text-sm text-red-500">{errors.categories.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {tagData?.tags.map((tag: Tag) => {
                      const isSelected = field.value?.includes(tag._id);
                      return (
                        <button
                          type="button"
                          key={tag._id}
                          onClick={() => {
                            const newValue = isSelected
                              ? // @ts-expect-error
                                field.value.filter((id: string) => id !== tag._id)
                              : [...(field.value || []), tag._id];
                            field.onChange(newValue);
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm border transition ${
                            isSelected
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              {errors.tags && <p className="mt-2 text-sm text-red-500">{errors.tags.message}</p>}
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Featured Image aaa</h3>
            <FileUploader
              setFileId={id => {
                if (id) {
                  setValue('featuredImage', id);
                }
              }}
              title="Upload Featured Image"
              id={watch('featuredImage')}
              label="Upload Image"
              setUrl={url => {
                if (url) {
                  setCurrentUrl(url);
                }
              }}
              url={currentUrl}
            />

            {/* Current image preview */}
            {watch('featuredImage') && (
              <div className="mb-4">
                <div className="relative w-full h-40 rounded-lg overflow-hidden">
                  <img src={currentUrl} alt="Featured Image" className="object-cover" />
                </div>

                <button
                  type="button"
                  onClick={() => setValue('featuredImage', '')}
                  className="mt-2 text-red-500 text-sm hover:text-red-700"
                >
                  Remove Image
                </button>
              </div>
            )}

            {/* Image upload */}
            {!watch('featuredImage') && (
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
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>

          {/* SEO options */}
          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">SEO Settings</h3>

            {/* Meta Title */}
            <div className="mb-4">
              <label htmlFor="seo.metaTitle" className="block text-sm font-medium mb-1">
                Meta Title
              </label>
              <input
                id="seo.metaTitle"
                type="text"
                {...register('seo.metaTitle')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="SEO Title (defaults to post title)"
              />
              {errors.seo?.metaTitle && (
                <p className="mt-1 text-sm text-red-500">{errors.seo.metaTitle.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {watch('seo.metaTitle')?.length || 0}/70 characters
              </p>
            </div>

            {/* Meta Description */}
            <div className="mb-4">
              <label htmlFor="seo.metaDescription" className="block text-sm font-medium mb-1">
                Meta Description
              </label>
              <textarea
                id="seo.metaDescription"
                {...register('seo.metaDescription')}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="SEO Description (defaults to post summary)"
              />
              {errors.seo?.metaDescription && (
                <p className="mt-1 text-sm text-red-500">{errors.seo.metaDescription.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {watch('seo.metaDescription')?.length || 0}/160 characters
              </p>
            </div>

            {/* Focus Keyword */}
            <div className="mb-4">
              <label htmlFor="seo.focusKeyword" className="block text-sm font-medium mb-1">
                Focus Keyword
              </label>
              <input
                id="seo.focusKeyword"
                type="text"
                {...register('seo.focusKeyword')}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Main keyword for this post"
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium mb-1">Additional Keywords</label>
              <Controller
                control={control}
                name="seo.keywords"
                render={({ field }) => (
                  <div>
                    <input
                      type="text"
                      placeholder="Add keywords and press Enter"
                      className="w-full px-4 py-2 border rounded-lg"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const target = e.target as HTMLInputElement;
                          const value = target.value.trim();

                          if (value && !field.value?.includes(value)) {
                            field.onChange([...(field.value || []), value]);
                            target.value = '';
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
              <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                {...register('difficulty')}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Not specified</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.difficulty && (
                <p className="mt-1 text-sm text-red-500">{errors.difficulty.message}</p>
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
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </div>
          ) : isEditing ? (
            'Update Post'
          ) : (
            'Create Post'
          )}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;
