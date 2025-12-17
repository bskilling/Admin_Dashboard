/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
} from 'lucide-react';

// Types
interface Blog {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  featuredImage?: {
    url: string;
    alt: string;
  };
  publishedAt: string;
  readTime: number;
  series: {
    order: number;
  };
}

interface Series {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: {
    url: string;
    alt: string;
  };
  isActive: boolean;
  blogs: Blog[];
  blogCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: Series;
  errors?: any[];
}

interface UpdateSeriesForm {
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  isActive: boolean;
}

export default function SeriesDetailPage() {
  const router = useRouter();
  const { id, edit } = router.query;
  const isEditing = edit === 'true';

  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(isEditing);
  const [updateForm, setUpdateForm] = useState<UpdateSeriesForm>({
    title: '',
    slug: '',
    description: '',
    coverImage: '',
    isActive: true,
  });

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Fetch series data
  const fetchSeries = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/series/${id}`);
      const data: ApiResponse = await response.json();

      if (data.success && data.data) {
        setSeries(data.data);
        // Initialize edit form with current data
        setUpdateForm({
          title: data.data.title,
          slug: data.data.slug,
          description: data.data.description,
          coverImage: data.data.coverImage?.url || '',
          isActive: data.data.isActive,
        });
      } else {
        console.error('Failed to fetch series:', data.message);
        if (response.status === 404) {
          router.push('/admin/blogs/series');
        }
      }
    } catch (error) {
      console.error('Error fetching series:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof UpdateSeriesForm, value: string | boolean) => {
    setUpdateForm(prev => ({
      ...prev,
      [field]: value,
      // Auto-generate slug when title changes
      ...(field === 'title' && typeof value === 'string' && { slug: generateSlug(value) }),
    }));
  };

  // Update series
  const handleUpdateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setUpdating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/series/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateForm),
        }
      );

      const data: ApiResponse = await response.json();

      if (data.success) {
        setEditMode(false);
        // Update URL to remove edit parameter
        router.replace(`/admin/blogs/series/${id}`);
        fetchSeries(); // Refresh data
      } else {
        console.error('Failed to update series:', data.message);
        if (data.errors) {
          console.error('Validation errors:', data.errors);
        }
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating series:', error);
      alert('Failed to update series');
    } finally {
      setUpdating(false);
    }
  };

  // Delete series
  const handleDeleteSeries = async () => {
    if (!id || !series) return;

    if (
      !confirm(`Are you sure you want to delete "${series.title}"? This action cannot be undone.`)
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/series/${id}`,
        {
          method: 'DELETE',
        }
      );

      const data: ApiResponse = await response.json();

      if (data.success) {
        router.push('/admin/blogs/series');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting series:', error);
      alert('Failed to delete series');
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
    router.replace(`/admin/blogs/series/${id}`);
    // Reset form to original values
    if (series) {
      setUpdateForm({
        title: series.title,
        slug: series.slug,
        description: series.description,
        coverImage: series.coverImage?.url || '',
        isActive: series.isActive,
      });
    }
  };

  // Load data when ID is available
  useEffect(() => {
    if (id) {
      fetchSeries();
    }
  }, [id]);

  // Set edit mode based on URL parameter
  useEffect(() => {
    setEditMode(isEditing);
  }, [isEditing]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Series Not Found</h2>
            <p className="text-gray-600 mb-6">
              The series you're looking for doesn't exist or has been deleted.
            </p>
            <Link
              href="/admin/blogs/series"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to Series
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin/blogs/series"
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Series
          </Link>

          {!editMode && (
            <div className="flex gap-2">
              <button
                onClick={() => setEditMode(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={handleDeleteSeries}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Series Details */}
        <div className="bg-white rounded-lg shadow mb-6">
          {/* Cover Image */}
          {(series.coverImage || updateForm.coverImage) && !editMode && (
            <div className="w-full h-64 rounded-t-lg overflow-hidden">
              <img
                src={series.coverImage?.url || updateForm.coverImage}
                alt={series.coverImage?.alt || series.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            {editMode ? (
              /* Edit Form */
              <form onSubmit={handleUpdateSeries} className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">Edit Series</h1>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={updateForm.title}
                      onChange={e => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      maxLength={200}
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                    <input
                      type="text"
                      value={updateForm.slug}
                      onChange={e => handleInputChange('slug', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      maxLength={200}
                      pattern="^[a-z0-9-]+$"
                      title="Only lowercase letters, numbers, and hyphens allowed"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={updateForm.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    maxLength={1000}
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={updateForm.coverImage}
                    onChange={e => handleInputChange('coverImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  {updateForm.coverImage && (
                    <div className="mt-2">
                      <img
                        src={updateForm.coverImage}
                        alt="Cover preview"
                        className="w-32 h-20 object-cover rounded border"
                        onError={e => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={updateForm.isActive}
                    onChange={e => handleInputChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active series
                  </label>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{series.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          series.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {series.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex items-center gap-1">
                        <BookOpen size={16} />
                        <span>{series.blogCount} blogs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Created {new Date(series.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{series.description}</p>
                </div>

                {/* Slug */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">URL Slug</h2>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm">{series.slug}</code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Blogs in Series */}
        {!editMode && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Blogs in this Series</h2>
              <p className="text-gray-600 mt-1">
                {series.blogs.length === 0
                  ? 'No blogs have been added to this series yet.'
                  : `${series.blogs.length} blog${
                      series.blogs.length === 1 ? '' : 's'
                    } in this series`}
              </p>
            </div>

            {series.blogs.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>This series doesn't have any blogs yet.</p>
                <p className="text-sm mt-2">
                  Add blogs to this series when creating or editing blog posts.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {series.blogs.map(blog => (
                  <div key={blog._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-4">
                      {/* Order Badge */}
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold">
                          {blog.series.order}
                        </div>
                      </div>

                      {/* Featured Image */}
                      {blog.featuredImage && (
                        <div className="flex-shrink-0">
                          <img
                            src={blog.featuredImage.url}
                            alt={blog.featuredImage.alt}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {blog.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {blog.summary}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{blog.readTime} min read</span>
                              </div>
                            </div>
                          </div>
                          <Link
                            href={`/blog/${blog.slug}`}
                            className="ml-4 text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                          >
                            <ExternalLink size={14} />
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
