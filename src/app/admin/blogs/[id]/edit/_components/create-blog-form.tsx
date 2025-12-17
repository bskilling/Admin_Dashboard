// components/_components/blogs/create-blog-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RefreshCw, Plus, X, Hash, Wand2, AlertCircle, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner'; // or your preferred toast library

import type { CreateBlogInput } from '@/types/blog';
import type { BlogCategory, Tag, Series as typeSeries } from '@/types/entities';
import SingleImageUploader from './SingleImageUploader';
import RichTextEditor from './RichTextEditor';
import Series from './Series';
import SimpleImageUploader from './SimpleImageUploader';
// import RichTextEditor from "./RichTextEditor1";

interface CreateBlogFormProps {
  form: UseFormReturn<CreateBlogInput>;
  categories: BlogCategory[];
  tags: Tag[];
  series: typeSeries[];
  onGenerateSlug: () => void;
  onAutoSEO: () => void;
}

// Error display component
const ErrorMessage = ({ error }: { error?: string }) => {
  if (!error) return null;

  return (
    <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
      <AlertCircle className="w-4 h-4" />
      <span>{error}</span>
    </div>
  );
};

// Success message component
const SuccessMessage = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
      <CheckCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};

export function CreateBlogForm({
  form,
  categories,
  tags,
  onGenerateSlug,
  onAutoSEO,
}: CreateBlogFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');

  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors, dirtyFields },
    trigger,
  } = form;

  // Show toast notifications for form field updates
  const showFieldUpdateToast = (fieldName: string, action: string) => {
    toast.success(`${fieldName} ${action} successfully`, {
      duration: 2000,
      position: 'top-right',
    });
  };

  // Add category with validation
  const addCategory = (categoryId: string) => {
    if (!selectedCategories.includes(categoryId)) {
      const newCategories = [...selectedCategories, categoryId];
      setSelectedCategories(newCategories);
      setValue('categories', newCategories);

      const category = categories.find(c => c._id === categoryId);
      showFieldUpdateToast(`Category "${category?.name}"`, 'added');

      // Trigger validation for categories field
      trigger('categories');
    }
  };

  // Remove category with validation
  const removeCategory = (categoryId: string) => {
    const newCategories = selectedCategories.filter(id => id !== categoryId);
    setSelectedCategories(newCategories);
    setValue('categories', newCategories);

    const category = categories.find(c => c._id === categoryId);
    showFieldUpdateToast(`Category "${category?.name}"`, 'removed');

    // Trigger validation for categories field
    trigger('categories');
  };

  // Add tag with validation
  const addTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      const newTags = [...selectedTags, tagId];
      setSelectedTags(newTags);
      setValue('tags', newTags);

      const tag = tags.find(t => t._id === tagId);
      showFieldUpdateToast(`Tag "${tag?.name}"`, 'added');

      // Trigger validation for tags field
      trigger('tags');
    }
  };

  // Remove tag with validation
  const removeTag = (tagId: string) => {
    const newTags = selectedTags.filter(id => id !== tagId);
    setSelectedTags(newTags);
    setValue('tags', newTags);

    const tag = tags.find(t => t._id === tagId);
    showFieldUpdateToast(`Tag "${tag?.name}"`, 'removed');

    // Trigger validation for tags field
    trigger('tags');
  };

  // Add SEO keyword with validation
  const addKeyword = () => {
    if (keywordInput.trim()) {
      const currentKeywords = getValues('seo.keywords') || [];
      if (currentKeywords.includes(keywordInput.trim())) {
        toast.error('Keyword already exists', { duration: 2000 });
        return;
      }

      const newKeywords = [...currentKeywords, keywordInput.trim()];
      setValue('seo.keywords', newKeywords);
      showFieldUpdateToast(`Keyword "${keywordInput.trim()}"`, 'added');
      setKeywordInput('');

      // Trigger validation for keywords field
      trigger('seo.keywords');
    }
  };

  // Remove SEO keyword with validation
  const removeKeyword = (index: number) => {
    const currentKeywords = getValues('seo.keywords') || [];
    const removedKeyword = currentKeywords[index];
    const newKeywords = currentKeywords.filter((_, i) => i !== index);
    setValue('seo.keywords', newKeywords);
    showFieldUpdateToast(`Keyword "${removedKeyword}"`, 'removed');

    // Trigger validation for keywords field
    trigger('seo.keywords');
  };

  // Enhanced generate slug function
  const handleGenerateSlug = () => {
    onGenerateSlug();
    showFieldUpdateToast('Slug', 'generated');
    trigger('slug');
  };

  // Enhanced auto SEO function
  const handleAutoSEO = () => {
    onAutoSEO();
    showFieldUpdateToast('SEO fields', 'auto-filled');
    trigger(['seo.metaTitle', 'seo.metaDescription', 'seo.focusKeyword']);
  };

  // Validation for categories (at least one required)
  useEffect(() => {
    if (selectedCategories.length === 0) {
      form.setError('categories', {
        type: 'required',
        message: 'At least one category is required',
      });
    } else {
      form.clearErrors('categories');
    }
  }, [selectedCategories, form]);

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>The main content and details of your blog post</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 w-full">
          <div className="p-6 w-full">
            <h2 className="text-lg font-medium mb-4">Upload Images</h2>
            <SingleImageUploader
              userId="current-user-id"
              maxFileSize={2} // 2MB for profile pics
              width={150}
              height={150}
              placeholder="Upload profile picture"
              className="w-full max-w-4xl"
              onUploadSuccess={file => {
                console.log('Profile picture uploaded:', file);
                // setProfileImage(file.url);
                setValue('banner', file.url);
                // Save to user profile in database
              }}
              onUploadError={error => {
                console.error('Upload failed:', error);
                alert(`Upload failed: ${error}`);
              }}
              onDelete={() => {
                console.log('Profile picture deleted');
                setValue('banner', undefined);
                // setProfileImage(null);
                // Remove from user profile in database
              }}
            />
            {errors?.banner && <p className="text-red-500 mt-2">{errors.banner.message}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 5,
                  message: 'Title must be at least 5 characters long',
                },
                maxLength: {
                  value: 100,
                  message: 'Title must be less than 100 characters',
                },
              })}
              className={`w-full p-3 border rounded-md ${
                errors.title
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Enter blog title"
            />
            <ErrorMessage error={errors.title?.message} />
            {dirtyFields.title && !errors.title && <SuccessMessage message="Title looks good!" />}
          </div>

          {/* Slug */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                {...register('slug', {
                  required: 'Slug is required',
                  pattern: {
                    value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                    message: 'Slug must be lowercase with hyphens only',
                  },
                  minLength: {
                    value: 3,
                    message: 'Slug must be at least 3 characters long',
                  },
                })}
                className={`flex-1 p-3 border rounded-md ${
                  errors.slug
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="blog-post-slug"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateSlug}
                className="shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <ErrorMessage error={errors.slug?.message} />
            {dirtyFields.slug && !errors.slug && <SuccessMessage message="Slug format is valid!" />}
          </div>

          {/* Summary */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Summary <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register('summary', {
                required: 'Summary is required',
                minLength: {
                  value: 20,
                  message: 'Summary must be at least 20 characters long',
                },
                maxLength: {
                  value: 300,
                  message: 'Summary must be less than 300 characters',
                },
              })}
              className={`min-h-[100px] ${
                errors.summary
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Brief summary of your blog post"
            />
            <div className="flex justify-between items-center mt-1">
              <ErrorMessage error={errors.summary?.message} />
              <span className="text-xs text-muted-foreground">
                {watch('summary')?.length || 0}/300 characters
              </span>
            </div>
            {dirtyFields.summary && !errors.summary && (
              <SuccessMessage message="Summary looks great!" />
            )}
          </div>
          <SimpleImageUploader />
          <RichTextEditor
            content={watch('content')}
            onChange={(content: string) => setValue('content', content)}
          />
        </CardContent>
      </Card>
      <Series
        id={watch('series')}
        setId={
          // @ts-expect-error error
          id => setValue('series', id ? id : undefined)
        }
      />
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Select categories for your blog post (at least one required)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Selected Categories */}
            {selectedCategories.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Selected Categories:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map(categoryId => {
                    const category = categories.find(c => c._id === categoryId);
                    return (
                      <Badge
                        key={categoryId}
                        variant="default"
                        className="gap-1"
                        style={{ backgroundColor: category?.color }}
                      >
                        {category?.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeCategory(categoryId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Categories */}
            <div>
              <p className="text-sm font-medium mb-2">Available Categories:</p>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {categories
                  .filter(category => !selectedCategories.includes(category._id))
                  .map(category => (
                    <Badge
                      key={category._id}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted"
                      style={{
                        borderColor: category.color,
                        color: category.color,
                      }}
                      onClick={() => addCategory(category._id)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {category.name}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Categories Error */}
            <ErrorMessage error={errors.categories?.message} />
            {selectedCategories.length > 0 && (
              <SuccessMessage message={`${selectedCategories.length} category(ies) selected`} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Add relevant tags to help categorize your content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Selected Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tagId => {
                    const tag = tags.find(t => t._id === tagId);
                    return (
                      <Badge
                        key={tagId}
                        variant="secondary"
                        className="gap-1"
                        style={{
                          backgroundColor: tag?.color + '20',
                          color: tag?.color,
                        }}
                      >
                        <Hash className="w-3 h-3" />
                        {tag?.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeTag(tagId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Tags */}
            <div>
              <p className="text-sm font-medium mb-2">Available Tags:</p>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {tags
                  .filter(tag => !selectedTags.includes(tag._id))
                  .map(tag => (
                    <Badge
                      key={tag._id}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted"
                      style={{ borderColor: tag.color, color: tag.color }}
                      onClick={() => addTag(tag._id)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      <Hash className="w-3 h-3 mr-1" />
                      {tag.name}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Tags Success Message */}
            {selectedTags.length > 0 && (
              <SuccessMessage message={`${selectedTags.length} tag(s) selected`} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize your post for search engines</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleAutoSEO}>
              <Wand2 className="w-4 h-4 mr-2" />
              Auto-fill
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Meta Title */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Meta Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('seo.metaTitle', {
                required: 'Meta title is required',
                maxLength: {
                  value: 60,
                  message: 'Meta title must be 60 characters or less',
                },
                minLength: {
                  value: 30,
                  message: 'Meta title should be at least 30 characters',
                },
              })}
              className={`w-full p-2 border rounded-md ${
                errors.seo?.metaTitle
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="SEO title (max 60 chars)"
              maxLength={60}
            />
            <div className="flex justify-between items-center mt-1">
              <ErrorMessage error={errors.seo?.metaTitle?.message} />
              <span
                className={`text-xs ${
                  (watch('seo.metaTitle')?.length || 0) > 50
                    ? 'text-orange-500'
                    : 'text-muted-foreground'
                }`}
              >
                {watch('seo.metaTitle')?.length || 0}/60 characters
              </span>
            </div>
            {dirtyFields.seo?.metaTitle && !errors.seo?.metaTitle && (
              <SuccessMessage message="Meta title length is good!" />
            )}
          </div>

          {/* Meta Description */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Meta Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register('seo.metaDescription', {
                required: 'Meta description is required',
              })}
              className={`min-h-[80px] ${
                errors.seo?.metaDescription
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="SEO description (max 160 chars)"
            />
            <div className="flex justify-between items-center mt-1">
              <ErrorMessage error={errors.seo?.metaDescription?.message} />
              <span
                className={`text-xs ${
                  (watch('seo.metaDescription')?.length || 0) > 150
                    ? 'text-orange-500'
                    : 'text-muted-foreground'
                }`}
              >
                {watch('seo.metaDescription')?.length || 0}/160 characters
              </span>
            </div>
            {dirtyFields.seo?.metaDescription && !errors.seo?.metaDescription && (
              <SuccessMessage message="Meta description length is optimal!" />
            )}
          </div>

          {/* Focus Keyword */}
          <div>
            <label className="text-sm font-medium mb-2 block">Focus Keyword</label>
            <input
              type="text"
              {...register('seo.focusKeyword', {
                minLength: {
                  value: 2,
                  message: 'Focus keyword must be at least 2 characters',
                },
              })}
              className={`w-full p-2 border rounded-md ${
                errors.seo?.focusKeyword
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Primary keyword for SEO"
            />
            <ErrorMessage error={errors.seo?.focusKeyword?.message} />
            {dirtyFields.seo?.focusKeyword && !errors.seo?.focusKeyword && (
              <SuccessMessage message="Focus keyword is set!" />
            )}
          </div>

          {/* Keywords */}
          <div>
            <label className="text-sm font-medium mb-2 block">Keywords</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={e => setKeywordInput(e.target.value)}
                  className="flex-1 p-2 border rounded-md border-gray-300 focus:border-blue-500"
                  placeholder="Add keyword"
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addKeyword}
                  disabled={!keywordInput.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {watch('seo.keywords')?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watch('seo.keywords')?.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {keyword}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeKeyword(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              {watch('seo.keywords')?.length > 0 && (
                <SuccessMessage message={`${watch('seo.keywords')?.length} keyword(s) added`} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
