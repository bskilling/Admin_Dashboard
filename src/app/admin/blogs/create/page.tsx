/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/blogs/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye, Globe, Lock, Key } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { createBlogSchema, type CreateBlogInput } from '@/types/blog';
import {
  useCreateBlogMutation,
  useCategoriesQuery,
  useTagsQuery,
  useSeriesQuery,
} from '@/lib/hooks/use-blog-queries';
import { CreateBlogForm } from './_components/create-blog-form';

// Field name mapping for better error messages
const fieldNameMap: Record<string, string> = {
  title: 'Blog Title',
  slug: 'URL Slug',
  summary: 'Blog Summary',
  content: 'Blog Content',
  categories: 'Categories',
  tags: 'Tags',
  status: 'Publication Status',
  visibility: 'Visibility Settings',
  password: 'Password',
  publishedAt: 'Published Date',
  scheduledFor: 'Scheduled Date',
  isTopPick: 'Top Pick',
  isFeatured: 'Featured',
  isPinned: 'Pinned',
  relatedBlogs: 'Related Blogs',
  relatedCourses: 'Related Courses',
  series: 'Series',
  difficulty: 'Difficulty Level',
  language: 'Language',
  'seo.metaTitle': 'SEO Meta Title',
  'seo.metaDescription': 'SEO Meta Description',
  'seo.keywords': 'SEO Keywords',
  'seo.canonicalUrl': 'Canonical URL',
  'seo.focusKeyword': 'Focus Keyword',
  'seo.robots': 'Robots Meta Tag',
};

export default function CreateBlogPage() {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);

  // Fetch data for dropdowns
  // @ts-expect-error err
  const { data: categoriesResponse } = useCategoriesQuery({ limit: 100 });
  // @ts-expect-error err
  const { data: tagsResponse } = useTagsQuery({ limit: 100 });
  const { data: seriesResponse } = useSeriesQuery({ limit: 100 });

  const categories = categoriesResponse?.data || [];
  const tags = tagsResponse?.data || [];
  const series = seriesResponse?.data || [];

  // React Hook Form setup
  const form = useForm<CreateBlogInput>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      content: '',
      categories: [],
      tags: [],
      status: 'draft',
      visibility: 'public',
      isTopPick: false,
      isFeatured: false,
      isPinned: false,
      language: 'en',
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
        robots: 'index, follow',
        twitterCard: 'summary_large_image',
        ogType: 'article',
        ogLocale: 'en_US',
      },
    },
  });

  const createBlogMutation = useCreateBlogMutation();

  const onSubmit = async (data: CreateBlogInput) => {
    try {
      console.log('🚀 Submitting blog data:', data);
      await createBlogMutation.mutateAsync(data);
      toast.success('Blog created successfully!');
      router.push('/admin/blogs');
    } catch (error: any) {
      console.error('❌ Create blog error:', error);

      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        validationErrors.forEach((err: any) => {
          const fieldPath = err.path.join('.');
          const fieldName = fieldNameMap[fieldPath] || fieldPath;
          toast.error(`${fieldName}: ${err.message}`, {
            description: `Please check the ${fieldName} field`,
            duration: 5000,
          });
        });
      } else {
        const message = error.response?.data?.message || 'Failed to create blog';
        toast.error(message);
      }
    }
  };

  const onError = (errors: any) => {
    console.log('📝 Form validation errors:', errors);

    // Count total errors
    const errorCount = Object.keys(errors).length;

    // Show summary toast
    toast.error(`Please fix ${errorCount} validation error${errorCount > 1 ? 's' : ''}`, {
      description: 'Check the highlighted fields below',
      duration: 5000,
    });

    // Show toast for each validation error with detailed info
    Object.entries(errors).forEach(([field, error]: [string, any]) => {
      if (error?.message) {
        const friendlyFieldName =
          fieldNameMap[field] ||
          field
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();

        // Handle nested errors (like seo.metaTitle)
        if (error.type === 'required') {
          toast.error(`${friendlyFieldName} is required`, {
            description: `Please provide a value for ${friendlyFieldName}`,
            duration: 4000,
          });
        } else if (error.type === 'min') {
          toast.error(`${friendlyFieldName} is too short`, {
            description: error.message,
            duration: 4000,
          });
        } else if (error.type === 'max') {
          toast.error(`${friendlyFieldName} is too long`, {
            description: error.message,
            duration: 4000,
          });
        } else {
          toast.error(`${friendlyFieldName}: ${error.message}`, {
            description: `Validation error in ${friendlyFieldName}`,
            duration: 4000,
          });
        }
      }
    });

    // Handle nested errors (like seo fields)
    if (errors.seo) {
      Object.entries(errors.seo).forEach(([seoField, seoError]: [string, any]) => {
        if (seoError?.message) {
          const fullFieldPath = `seo.${seoField}`;
          const friendlyName = fieldNameMap[fullFieldPath] || seoField;

          toast.error(`${friendlyName}: ${seoError.message}`, {
            description: `Please check the SEO section`,
            duration: 4000,
          });
        }
      });
    }
  };

  const handleGenerateSlug = () => {
    const title = form.getValues('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue('slug', slug);
      toast.success('Slug generated from title');
    } else {
      toast.error('Please enter a title first');
    }
  };

  const handleAutoSEO = () => {
    const title = form.getValues('title');
    const summary = form.getValues('summary');

    let updated = false;

    if (title && !form.getValues('seo.metaTitle')) {
      form.setValue('seo.metaTitle', title.substring(0, 60));
      updated = true;
    }

    if (summary && !form.getValues('seo.metaDescription')) {
      form.setValue('seo.metaDescription', summary.substring(0, 160));
      updated = true;
    }

    if (updated) {
      toast.success('SEO fields auto-filled from title and summary');
    } else {
      toast.info('SEO fields are already filled or missing title/summary');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submit
    const result = createBlogSchema.safeParse(form.getValues());

    if (!result.success) {
      const errors = result.error.errors;
      console.log('Validation errors:', errors);

      // Show first error
      const firstError = errors[0];
      const fieldPath = firstError.path.join('.');
      const friendlyName = fieldNameMap[fieldPath] || fieldPath;

      toast.error(`Validation Error: ${friendlyName}`, {
        description: firstError.message,
        duration: 5000,
      });

      // Show summary of all errors
      if (errors.length > 1) {
        setTimeout(() => {
          toast.error(`Total ${errors.length} validation errors found`, {
            description: 'Please check all highlighted fields',
            duration: 5000,
          });
        }, 500);
      }

      return;
    }

    form.handleSubmit(onSubmit, onError)(e);
  };

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
          <p className="text-muted-foreground">Create and publish a new blog post</p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <CreateBlogForm
              form={form}
              categories={categories}
              tags={tags}
              series={series}
              onGenerateSlug={handleGenerateSlug}
              onAutoSEO={handleAutoSEO}
            />
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={createBlogMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {createBlogMutation.isPending ? 'Creating...' : 'Create Blog'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsPreview(!isPreview)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isPreview ? 'Edit' : 'Preview'}
                </Button>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <select {...form.register('status')} className="w-full p-2 border rounded-md">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    {/* <option value="scheduled">Scheduled</option> */}
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Visibility</label>
                  <select {...form.register('visibility')} className="w-full p-2 border rounded-md">
                    <option value="public">
                      <Globe className="w-4 h-4 mr-2 inline" />
                      Public
                    </option>
                    <option value="private">
                      <Lock className="w-4 h-4 mr-2 inline" />
                      Private
                    </option>
                    <option value="password_protected">
                      <Key className="w-4 h-4 mr-2 inline" />
                      Password Protected
                    </option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Special Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Special Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...form.register('isFeatured')} className="rounded" />
                  <span className="text-sm">Featured Post</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...form.register('isTopPick')} className="rounded" />
                  <span className="text-sm">Top Pick</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...form.register('isPinned')} className="rounded" />
                  <span className="text-sm">Pin to Top</span>
                </label>
              </CardContent>
            </Card>

            {/* Difficulty */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Difficulty Level</CardTitle>
              </CardHeader>
              <CardContent>
                <select {...form.register('difficulty')} className="w-full p-2 border rounded-md">
                  <option value="">Select difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
