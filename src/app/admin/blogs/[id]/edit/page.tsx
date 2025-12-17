/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  Lock,
  Key,
  Loader2,
  RefreshCw,
  Plus,
  X,
  Hash,
  Wand2,
  AlertCircle,
  CheckCircle,
  Upload,
  BookOpen,
  Check,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

// Import your types and schemas
import { updateBlogSchema, type UpdateBlogInput } from '@/types/blog';
import type { BlogCategory, Tag, Series as SeriesType } from '@/types/entities';

// Rich Text Editor imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import CodeBlock from '@tiptap/extension-code-block';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';

interface EditBlogPageProps {
  params: { id: string };
}

// File Upload Interface
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  s3Key: string;
}

// Error Message Component
const ErrorMessage = ({ error }: { error?: string }) => {
  if (!error) return null;
  return (
    <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
      <AlertCircle className="w-4 h-4" />
      <span>{error}</span>
    </div>
  );
};

// Success Message Component
const SuccessMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
      <CheckCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};

// Single Image Uploader Component
const SingleImageUploader = ({
  value,
  onChange,
  placeholder = 'Upload image',
  className = '',
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
  placeholder?: string;
  className?: string;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', 'IMAGE');
      formData.append('userId', 'current-user-id');

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        onChange(result.fileUrl);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        {value && (
          <div className="relative">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => onChange(undefined)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium">{placeholder}</p>
              <p className="text-xs text-gray-500">Click to browse files</p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

// Rich Text Editor Menu Bar
const MenuBar = ({ editor }: { editor: any }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);

  const setLink = useCallback(() => {
    if (!linkUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setShowLinkModal(false);
      return;
    }
    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setLinkUrl('');
    setShowLinkModal(false);
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!imageUrl) {
      setShowImageModal(false);
      return;
    }
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl('');
    setShowImageModal(false);
  }, [editor, imageUrl]);

  const handleButtonClick = (callback: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    callback();
  };

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-t-lg">
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 bg-gray-50">
        {/* Text formatting */}
        <button
          onClick={handleButtonClick(() => editor.chain().focus().toggleBold().run())}
          className={`w-8 h-8 flex items-center justify-center rounded ${
            editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          title="Bold"
          type="button"
        >
          <strong>B</strong>
        </button>

        <button
          onClick={handleButtonClick(() => editor.chain().focus().toggleItalic().run())}
          className={`w-8 h-8 flex items-center justify-center rounded ${
            editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          title="Italic"
          type="button"
        >
          <em>I</em>
        </button>

        {/* Headings */}
        <button
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          )}
          className={`px-2 h-8 flex items-center justify-center rounded ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          title="Heading 1"
          type="button"
        >
          H1
        </button>

        <button
          onClick={handleButtonClick(() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          )}
          className={`px-2 h-8 flex items-center justify-center rounded ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          title="Heading 2"
          type="button"
        >
          H2
        </button>

        {/* Lists */}
        <button
          onClick={handleButtonClick(() => editor.chain().focus().toggleBulletList().run())}
          className={`w-8 h-8 flex items-center justify-center rounded ${
            editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          title="Bullet List"
          type="button"
        >
          •
        </button>

        <button
          onClick={handleButtonClick(() => editor.chain().focus().toggleOrderedList().run())}
          className={`w-8 h-8 flex items-center justify-center rounded ${
            editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          title="Ordered List"
          type="button"
        >
          1.
        </button>

        {/* Link and Image */}
        <button
          onClick={handleButtonClick(() => setShowLinkModal(true))}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
          title="Add Link"
          type="button"
        >
          🔗
        </button>

        <button
          onClick={handleButtonClick(() => setShowImageModal(true))}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
          title="Add Image"
          type="button"
        >
          🖼️
        </button>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="absolute z-10 p-4 bg-white shadow-lg rounded-lg border">
          <h3 className="text-lg font-medium mb-3">Add Link</h3>
          <input
            type="text"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border rounded-lg mb-3"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleButtonClick(() => setShowLinkModal(false))}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleButtonClick(setLink)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              type="button"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="absolute z-10 p-4 bg-white shadow-lg rounded-lg border">
          <h3 className="text-lg font-medium mb-3">Add Image</h3>
          <input
            type="text"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border rounded-lg mb-3"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleButtonClick(() => setShowImageModal(false))}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleButtonClick(addImage)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              type="button"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Rich Text Editor Component
const RichTextEditor = ({
  content,
  onChange,
  placeholder = 'Start writing your blog post...',
}: {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      CodeBlock,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="relative">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-blue max-w-none min-h-[300px] border border-gray-300 border-t-0 rounded-b-lg p-4 focus:outline-none"
      />
    </div>
  );
};

// Series Selector Component
const SeriesSelector = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string | undefined) => void;
}) => {
  const [series, setSeries] = useState<SeriesType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/blogs/series?isActive=true&limit=50'
        );
        const data = await response.json();
        if (data.success && data.data) {
          setSeries(data.data);
        }
      } catch (error) {
        console.error('Error fetching series:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  const handleSelect = (seriesId: string) => {
    onChange(value === seriesId ? undefined : seriesId);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Select Series (Optional)</label>
      {series.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <BookOpen className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm">No active series available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
          {series.map(seriesItem => (
            <div
              key={seriesItem._id}
              onClick={() => handleSelect(seriesItem._id)}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                value === seriesItem._id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 mb-1 truncate">{seriesItem.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {seriesItem.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {seriesItem.blogCount} blog
                    {seriesItem.blogCount !== 1 ? 's' : ''}
                  </div>
                </div>
                {value === seriesItem._id && (
                  <Check className="text-blue-600 ml-2 flex-shrink-0" size={20} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Edit Blog Page Component
export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blogData, setBlogData] = useState<any>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');

  // React Hook Form setup
  const form = useForm<UpdateBlogInput>({
    resolver: zodResolver(updateBlogSchema),
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

  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors, dirtyFields },
    trigger,
  } = form;

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch blog data, categories, and tags in parallel
        const [blogResponse, categoriesResponse, tagsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/blogs/${params.id}`),
          fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/blogs/categories?limit=100'),
          fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/blogs/tags?limit=100'),
        ]);

        const [blogResult, categoriesResult, tagsResult] = await Promise.all([
          blogResponse.json(),
          categoriesResponse.json(),
          tagsResponse.json(),
        ]);

        if (!blogResponse.ok) {
          throw new Error(blogResult.message || 'Failed to fetch blog data');
        }

        if (blogResult.success && blogResult.data) {
          const blog = blogResult.data;
          setBlogData(blog);

          // Extract category and tag IDs
          const categoryIds = blog.categories?.map((cat: any) => cat._id || cat) || [];
          const tagIds = blog.tags?.map((tag: any) => tag._id || tag) || [];

          setSelectedCategories(categoryIds);
          setSelectedTags(tagIds);

          // Populate form with fetched data
          form.reset({
            id: blog._id,
            title: blog.title || '',
            slug: blog.slug || '',
            banner: blog.banner || undefined,
            series: blog.series?.seriesId || undefined,
            summary: blog.summary || '',
            content: blog.content || '',
            categories: categoryIds,
            tags: tagIds,
            status: blog.status || 'draft',
            visibility: blog.visibility || 'public',
            isTopPick: blog.isTopPick || false,
            isFeatured: blog.isFeatured || false,
            isPinned: blog.isPinned || false,
            difficulty: blog.difficulty || undefined,
            language: blog.language || 'en',
            seo: {
              metaTitle: blog.seo?.metaTitle || blog.title || '',
              metaDescription: blog.seo?.metaDescription || blog.summary || '',
              keywords: blog.seo?.keywords || [],
              focusKeyword: blog.seo?.focusKeyword || '',
              robots: blog.seo?.robots || 'index, follow',
              twitterCard: blog.seo?.twitterCard || 'summary_large_image',
              ogType: blog.seo?.ogType || 'article',
              ogLocale: blog.seo?.ogLocale || 'en_US',
            },
          });
        }

        // Set categories and tags
        if (categoriesResult.success) {
          setCategories(categoriesResult.data || []);
        }
        if (tagsResult.success) {
          setTags(tagsResult.data || []);
        }
      } catch (error: any) {
        console.error('❌ Fetch data error:', error);
        toast.error(error.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, form]);

  // Form submission handler
  const onSubmit = async (data: UpdateBlogInput) => {
    try {
      setIsSubmitting(true);
      console.log('🚀 Updating blog data:', data);

      const updateData = { ...data, id: params.id };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/blogs/${params.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update blog');
      }

      toast.success('Blog updated successfully!');
      router.push('/admin/blogs');
    } catch (error: any) {
      console.error('❌ Update blog error:', error);
      toast.error(error.message || 'Failed to update blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Utility functions
  const generateSlug = () => {
    const title = getValues('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
      trigger('slug');
    }
  };

  const autoFillSEO = () => {
    const title = getValues('title');
    const summary = getValues('summary');

    if (title && !getValues('seo.metaTitle')) {
      setValue('seo.metaTitle', title.substring(0, 60));
    }
    if (summary && !getValues('seo.metaDescription')) {
      setValue('seo.metaDescription', summary.substring(0, 160));
    }
    trigger(['seo.metaTitle', 'seo.metaDescription']);
  };

  const addCategory = (categoryId: string) => {
    if (!selectedCategories.includes(categoryId)) {
      const newCategories = [...selectedCategories, categoryId];
      setSelectedCategories(newCategories);
      setValue('categories', newCategories);
      trigger('categories');
    }
  };

  const removeCategory = (categoryId: string) => {
    const newCategories = selectedCategories.filter(id => id !== categoryId);
    setSelectedCategories(newCategories);
    setValue('categories', newCategories);
    trigger('categories');
  };

  const addTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      const newTags = [...selectedTags, tagId];
      setSelectedTags(newTags);
      setValue('tags', newTags);
      trigger('tags');
    }
  };

  const removeTag = (tagId: string) => {
    const newTags = selectedTags.filter(id => id !== tagId);
    setSelectedTags(newTags);
    setValue('tags', newTags);
    trigger('tags');
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      const currentKeywords = getValues('seo.keywords') || [];
      if (!currentKeywords.includes(keywordInput.trim())) {
        const newKeywords = [...currentKeywords, keywordInput.trim()];
        setValue('seo.keywords', newKeywords);
        setKeywordInput('');
        trigger('seo.keywords');
      }
    }
  };

  const removeKeyword = (index: number) => {
    const currentKeywords = getValues('seo.keywords') || [];
    const newKeywords = currentKeywords.filter((_, i) => i !== index);
    setValue('seo.keywords', newKeywords);
    trigger('seo.keywords');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading blog data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!blogData) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Blog Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The blog you're looking for doesn't exist or couldn't be loaded.
            </p>
            <Button onClick={() => router.push('/admin/blogs')}>Back to Blogs</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <p className="text-muted-foreground">Update and republish your blog post</p>
        </div>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          const err = updateBlogSchema.safeParse(form.getValues()).error?.errors[0];
          const path = err?.path;
          if (err) {
            toast.error(err.message, {
              description: `Field: ${path?.join('.')} ${err.message}`,
              duration: 5000,
            });
            return;
          }
          form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-6"
      >
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Banner Image */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Banner Image</label>
                  <SingleImageUploader
                    value={watch('banner')}
                    onChange={url => setValue('banner', url)}
                    placeholder="Upload banner image"
                  />
                  <ErrorMessage error={errors?.banner?.message} />
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    className={`w-full p-3 border rounded-md ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter blog title"
                  />
                  <ErrorMessage error={errors.title?.message} />
                  {dirtyFields.title && !errors.title && (
                    <SuccessMessage message="Title looks good!" />
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      {...register('slug')}
                      className={`flex-1 p-3 border rounded-md ${
                        errors.slug ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="blog-post-slug"
                    />
                    <Button type="button" variant="outline" onClick={generateSlug}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                  <ErrorMessage error={errors.slug?.message} />
                  {dirtyFields.slug && !errors.slug && (
                    <SuccessMessage message="Slug format is valid!" />
                  )}
                </div>

                {/* Summary */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Summary <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    {...register('summary')}
                    className={`min-h-[100px] ${
                      errors.summary ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Brief summary of your blog post"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <ErrorMessage error={errors.summary?.message} />
                    <span className="text-xs text-muted-foreground">
                      {watch('summary')?.length || 0}/1000 characters
                    </span>
                  </div>
                  {dirtyFields.summary && !errors.summary && (
                    <SuccessMessage message="Summary looks great!" />
                  )}
                </div>

                {/* Rich Text Editor */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <RichTextEditor
                    // @ts-expect-error content
                    content={watch('content')}
                    onChange={(content: string) => setValue('content', content)}
                  />
                  <ErrorMessage error={errors.content?.message} />
                </div>
              </CardContent>
            </Card>

            {/* Series Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Series</CardTitle>
              </CardHeader>
              <CardContent>
                <SeriesSelector
                  value={watch('series')}
                  onChange={value => setValue('series', value)}
                />
              </CardContent>
            </Card>

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

                  <ErrorMessage error={errors.categories?.message} />
                  {selectedCategories.length > 0 && (
                    <SuccessMessage
                      message={`${selectedCategories.length} category(ies) selected`}
                    />
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
                  <Button type="button" variant="outline" size="sm" onClick={autoFillSEO}>
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
                    {...register('seo.metaTitle')}
                    className={`w-full p-2 border rounded-md ${
                      errors.seo?.metaTitle ? 'border-red-500' : 'border-gray-300'
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
                </div>

                {/* Meta Description */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Meta Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    {...register('seo.metaDescription')}
                    className={`min-h-[80px] ${
                      errors.seo?.metaDescription ? 'border-red-500' : 'border-gray-300'
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
                </div>

                {/* Focus Keyword */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Focus Keyword</label>
                  <input
                    type="text"
                    {...register('seo.focusKeyword')}
                    className="w-full p-2 border rounded-md border-gray-300"
                    placeholder="Primary keyword for SEO"
                  />
                  <ErrorMessage error={errors.seo?.focusKeyword?.message} />
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
                        className="flex-1 p-2 border rounded-md border-gray-300"
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Updating...' : 'Update Blog'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(`/blog/${watch('slug')}`, '_blank')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </CardContent>
            </Card>

            {/* Status & Visibility */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <select {...register('status')} className="w-full p-2 border rounded-md">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Visibility</label>
                  <select {...register('visibility')} className="w-full p-2 border rounded-md">
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
                  <input type="checkbox" {...register('isFeatured')} className="rounded" />
                  <span className="text-sm">Featured Post</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('isTopPick')} className="rounded" />
                  <span className="text-sm">Top Pick</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('isPinned')} className="rounded" />
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
                <select {...register('difficulty')} className="w-full p-2 border rounded-md">
                  <option value="aa">Select difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </CardContent>
            </Card>

            {/* Blog Info */}
            {blogData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Blog Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Created:</span>{' '}
                    {new Date(blogData.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{' '}
                    {new Date(blogData.updatedAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Views:</span> {blogData.viewCount || 0}
                  </div>
                  <div>
                    <span className="font-medium">Read Time:</span> {blogData.readTime || 0} min
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
