/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
// app/admin/categories/create/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Save, RefreshCw, Palette, FolderTree, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import { createBlogCategorySchema, type CreateBlogCategoryInput } from '@/types/blog';
import { useCreateCategoryMutation, useCategoriesQuery } from '@/lib/hooks/use-blog-queries';

const DEFAULT_COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#64748b',
  '#6b7280',
  '#374151',
];

// Error display component
const ErrorMessage = ({ error }: { error?: { message?: string } }) => {
  if (!error?.message) return null;

  return (
    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
      <AlertCircle className="w-4 h-4" />
      <span>{error.message}</span>
    </div>
  );
};

// Input wrapper with error styling
const InputWrapper = ({ children, hasError }: { children: React.ReactNode; hasError: boolean }) => {
  return <div className={hasError ? 'space-y-1' : ''}>{children}</div>;
};

export default function CreateCategoryPage() {
  const router = useRouter();

  // Fetch existing categories for parent selection
  // @ts-expect-error err
  const { data: categoriesResponse } = useCategoriesQuery({ limit: 100 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const categories = categoriesResponse?.data || [];

  // React Hook Form setup
  const form = useForm<CreateBlogCategoryInput>({
    resolver: zodResolver(createBlogCategorySchema),
    mode: 'onChange', // Changed to onChange for real-time validation
    shouldFocusError: true,
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      isActive: true,
      displayOrder: 0,
      //   parent: undefined,
    },
  });

  const {
    formState: { errors },
  } = form;
  const createCategoryMutation = useCreateCategoryMutation();

  const onSubmit = async (data: CreateBlogCategoryInput) => {
    try {
      console.log('🚀 Submitting category data:', data);
      await createCategoryMutation.mutateAsync(data);

      toast.success('Success!', {
        description: 'Category created successfully!',
      });

      router.push('/admin/categories');
    } catch (error: any) {
      console.error('❌ Create category error:', error);

      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;

        // Set form errors for each field
        validationErrors.forEach((err: any) => {
          const fieldName = err.path[err.path.length - 1];
          form.setError(fieldName, {
            type: 'server',
            message: err.message,
          });
        });

        // Show general toast
        toast.error('Validation Failed', {
          description: `Please fix ${validationErrors.length} error(s) below`,
        });
      } else if (error.response?.data?.message) {
        // Specific server error
        const message = error.response.data.message;
        toast.error('Server Error', {
          description: message,
        });

        // If it's a duplicate slug/name error, set it on the appropriate field
        if (message.toLowerCase().includes('slug')) {
          form.setError('slug', {
            type: 'server',
            message: message,
          });
        } else if (message.toLowerCase().includes('name')) {
          form.setError('name', {
            type: 'server',
            message: message,
          });
        }
      } else {
        // Generic error
        toast.error('Error', {
          description: 'Failed to create category. Please try again.',
        });
      }
    }
  };

  // Handle client-side validation errors
  const onError = (errors: any) => {
    console.log('📝 Form validation errors:', errors);

    const errorCount = Object.keys(errors).length;
    const firstError = Object.values(errors)[0] as any;

    toast.error('Validation Failed', {
      description: `${errorCount} error(s) found. ${
        firstError?.message || 'Please check the form.'
      }`,
    });

    // Focus on first error field
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      element?.focus();
    }
  };

  const handleGenerateSlug = () => {
    const name = form.getValues('name');
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue('slug', slug);

      // Clear any existing slug errors
      form.clearErrors('slug');

      toast.success('Slug Generated', {
        description: `Generated slug: ${slug}`,
      });
    } else {
      toast.error('No Name', {
        description: 'Please enter a category name first',
      });
    }
  };

  const handleColorSelect = (color: string) => {
    form.setValue('color', color);
    form.clearErrors('color');
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderTree className="w-8 h-8" />
            Create New Category
          </h1>
          <p className="text-muted-foreground">Create a new category to organize your blog posts</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6" noValidate>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details for your category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <InputWrapper hasError={!!errors.name}>
              <label className="text-sm font-medium mb-2 block">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...form.register('name')}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  errors.name
                    ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Enter category name (e.g., Technology, Travel, Tutorials)"
              />
              <ErrorMessage error={errors.name} />
            </InputWrapper>

            {/* Slug */}
            <InputWrapper hasError={!!errors.slug}>
              <label className="text-sm font-medium mb-2 block">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  {...form.register('slug')}
                  className={`flex-1 p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                    errors.slug
                      ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="category-slug"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateSlug}
                  className="shrink-0"
                  title="Generate slug from name"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <ErrorMessage error={errors.slug} />
              {!errors.slug && (
                <p className="text-xs text-muted-foreground mt-1">
                  URL-friendly version of the category name (auto-generated from name)
                </p>
              )}
            </InputWrapper>

            {/* Description */}
            <InputWrapper hasError={!!errors.description}>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                {...form.register('description')}
                className={`min-h-[100px] transition-colors ${
                  errors.description
                    ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
                placeholder="Brief description of what this category covers"
                maxLength={500}
              />
              <ErrorMessage error={errors.description} />
              {!errors.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {form.watch('description')?.length || 0}/500 characters
                </p>
              )}
            </InputWrapper>
          </CardContent>
        </Card>

        {/* Category Hierarchy & Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Category Settings</CardTitle>
            <CardDescription>Configure category hierarchy and appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display Order */}
            <InputWrapper hasError={!!errors.displayOrder}>
              <label className="text-sm font-medium mb-2 block">Display Order</label>
              <input
                type="number"
                {...form.register('displayOrder', { valueAsNumber: true })}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  errors.displayOrder
                    ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
              />
              <ErrorMessage error={errors.displayOrder} />
              {!errors.displayOrder && (
                <p className="text-xs text-muted-foreground mt-1">
                  Lower numbers appear first in category lists
                </p>
              )}
            </InputWrapper>

            {/* Icon */}
            <InputWrapper hasError={!!errors.icon}>
              <label className="text-sm font-medium mb-2 block">Icon (Optional)</label>
              <input
                type="text"
                {...form.register('icon')}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  errors.icon
                    ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="📁 or folder, home, settings, etc."
              />
              <ErrorMessage error={errors.icon} />
              {!errors.icon && (
                <p className="text-xs text-muted-foreground mt-1">
                  Emoji or icon name from your icon library
                </p>
              )}
            </InputWrapper>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how your category looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Color */}
            <InputWrapper hasError={!!errors.color}>
              <label className="text-sm font-medium mb-2 block">Category Color</label>
              <div className="space-y-3">
                <input
                  type="text"
                  {...form.register('color')}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                    errors.color
                      ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="#3b82f6"
                />
                <ErrorMessage error={errors.color} />
                <div className="grid grid-cols-10 gap-2">
                  {DEFAULT_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                        form.watch('color') === color
                          ? 'border-gray-800 scale-110'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                {!errors.color && (
                  <p className="text-xs text-muted-foreground">
                    Click a color or enter a custom hex code
                  </p>
                )}
              </div>
            </InputWrapper>

            {/* Preview */}
            {(form.watch('name') || form.watch('color')) && (
              <div>
                <label className="text-sm font-medium mb-2 block">Preview</label>
                <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/30">
                  {form.watch('color') && (
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: form.watch('color') }}
                    />
                  )}
                  {form.watch('icon') && <span>{form.watch('icon')}</span>}
                  <span className="font-medium">{form.watch('name') || 'Category Name'}</span>
                </div>
              </div>
            )}

            {/* Active Status */}
            <InputWrapper hasError={!!errors.isActive}>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...form.register('isActive')}
                  className="rounded focus:ring-2 focus:ring-primary"
                  id="isActive"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active Category
                </label>
                <p className="text-xs text-muted-foreground ml-2">
                  Inactive categories won't appear in category selection
                </p>
              </div>
              <ErrorMessage error={errors.isActive} />
            </InputWrapper>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={createCategoryMutation.isPending} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            {createCategoryMutation.isPending ? 'Creating...' : 'Create Category'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
