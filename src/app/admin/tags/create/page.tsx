/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
// app/admin/tags/create/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Save, Hash, Palette } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import { createTagSchema, type CreateTagInput } from '@/types/blog';
import { useCreateTagMutation } from '@/lib/hooks/use-blog-queries';

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

export default function CreateTagPage() {
  const router = useRouter();

  // React Hook Form setup
  const form = useForm<CreateTagInput>({
    resolver: zodResolver(createTagSchema),
    mode: 'onSubmit',
    shouldFocusError: false,
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
    },
  });

  const createTagMutation = useCreateTagMutation();

  const onSubmit = async (data: CreateTagInput) => {
    try {
      console.log('🚀 Submitting tag data:', data);
      await createTagMutation.mutateAsync(data);
      toast.success('Tag created successfully!');
      router.push('/admin/tags');
    } catch (error: any) {
      console.error('❌ Create tag error:', error);

      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        validationErrors.forEach((err: any) => {
          const fieldName = err.path[err.path.length - 1];
          toast.error(`Validation Error: ${fieldName}`, {
            description: err.message,
          });
        });
      } else {
        const message = error.response?.data?.message || 'Failed to create tag';
        toast.error('Error', {
          description: message,
        });
      }
    }
  };

  // Handle client-side validation errors with toast messages only
  const onError = (errors: any) => {
    console.log('📝 Form validation errors:', errors);

    Object.entries(errors).forEach(([field, error]: [string, any]) => {
      if (error?.message) {
        toast.error(`Validation Error: ${field}`, {
          description: error.message,
        });
      }
    });
  };

  const handleColorSelect = (color: string) => {
    form.setValue('color', color);
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Tag</h1>
          <p className="text-muted-foreground">
            Create a new tag to label and organize your blog posts
          </p>
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
        noValidate // Disable HTML5 validation
      >
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Enter the basic details for your tag</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tag Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...form.register('name')}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter tag name"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Keep it short and descriptive (e.g., "React", "JavaScript", "Tutorial")
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
              <Textarea
                {...form.register('description')}
                className="min-h-[100px]"
                placeholder="Brief description of what this tag represents"
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {form.watch('description')?.length || 0}/300 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tag Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how your tag looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Color */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tag Color</label>
              <div className="space-y-3">
                <input
                  type="text"
                  {...form.register('color')}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="#3b82f6"
                />
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
                <p className="text-xs text-muted-foreground">
                  Click a color or enter a custom hex code
                </p>
              </div>
            </div>

            {/* Preview */}
            {(form.watch('name') || form.watch('color')) && (
              <div>
                <label className="text-sm font-medium mb-2 block">Preview</label>
                <div className="flex gap-2">
                  <span
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border"
                    style={{
                      backgroundColor: form.watch('color') ? form.watch('color') + '20' : '#f3f4f6',
                      color: form.watch('color') || '#374151',
                      borderColor: form.watch('color') || '#d1d5db',
                    }}
                  >
                    <Hash className="w-3 h-3 mr-1" />
                    {form.watch('name') || 'Tag Name'}
                  </span>
                </div>
              </div>
            )}

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...form.register('isActive')}
                className="rounded focus:ring-2 focus:ring-primary"
                id="isActive"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Active Tag
              </label>
              <p className="text-xs text-muted-foreground ml-2">
                Inactive tags won't appear in tag selection
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={createTagMutation.isPending} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            {createTagMutation.isPending ? 'Creating...' : 'Create Tag'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
