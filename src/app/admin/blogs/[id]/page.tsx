/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Tag, Bookmark, Share2, Eye, Heart } from 'lucide-react';

// Types based on your schema - these represent the populated data from API
interface Author {
  _id: string;
  name: string;
  email?: string;
  bio?: string;
  shortBio?: string;
  profilePicture?: {
    url: string;
    alt: string;
  };
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    instagram?: string;
    youtube?: string;
  };
  role?: string;
  expertise?: string[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
}

interface BlogTag {
  _id: string;
  name: string;
  description?: string;
  color?: string;
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
}

interface SEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: {
    url: string;
    alt: string;
  };
  canonicalUrl?: string;
  focusKeyword?: string;
  robots: string;
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterCreator?: string;
  ogType: 'article' | 'website' | 'profile';
  ogLocale: string;
}

interface TableOfContents {
  id: string;
  text: string;
  level: number;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  banner?: string;
  series?: string;
  summary: string;
  content: string;
  author?: Author;
  coAuthors?: Author[];
  categories: Category[];
  tags: BlogTag[];
  featuredImage?: {
    url: string;
    alt: string;
  };
  galleryImages?: Array<{
    url: string;
    alt: string;
  }>;
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  visibility: 'public' | 'private' | 'password_protected';
  publishedAt?: string;
  scheduledFor?: string;
  isTopPick: boolean;
  isFeatured: boolean;
  isPinned: boolean;
  relatedBlogs?: Blog[];
  seo: SEO;
  readTime: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  tableOfContents?: TableOfContents[];
  viewCount?: number;
  likeCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: Blog;
  errors?: any[];
}

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog data
  const fetchBlog = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${id}`);
      const data: ApiResponse = await response.json();

      if (data.success && data.data) {
        setBlog(data.data);

        // Update document title and meta
        if (data.data.seo?.metaTitle) {
          document.title = data.data.seo.metaTitle;
        }
      } else {
        setError(data.message || 'Blog not found');
        if (response.status === 404) {
          router.push('/admin/blogs');
        }
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  // Load data when ID is available
  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Back button skeleton */}
            <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>

            {/* Hero section skeleton */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-8">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>

            {/* Content skeleton */}
            <div className="bg-white rounded-lg shadow p-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            href="/admin/blogs"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Blogs
          </Link>

          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Blog Not Found'}</h1>
            <p className="text-gray-600 mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/admin/blogs"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/admin/blogs"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Blogs
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="w-full h-64 md:h-80">
              <img
                src={blog.featuredImage.url}
                alt={blog.featuredImage.alt}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.isPinned && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  📌 Pinned
                </span>
              )}
              {blog.isFeatured && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  ⭐ Featured
                </span>
              )}
              {blog.isTopPick && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  🏆 Top Pick
                </span>
              )}
              {blog.difficulty && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    blog.difficulty === 'beginner'
                      ? 'bg-green-100 text-green-800'
                      : blog.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {blog.difficulty.charAt(0).toUpperCase() + blog.difficulty.slice(1)}
                </span>
              )}
            </div>

            {/* Series Info */}
            {blog.series && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">
                  Part {blog.series} of Series:
                </div>
                <Link
                  href={`/admin/blogs/series/${blog.series}`}
                  className="text-blue-700 hover:text-blue-800 font-semibold"
                >
                  {blog.series}
                </Link>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>

            {/* Summary */}
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">{blog.summary}</p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              {blog.author && (
                <div className="flex items-center gap-2">
                  {blog.author.profilePicture ? (
                    <img
                      src={blog.author.profilePicture.url}
                      alt={blog.author.profilePicture.alt}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User size={16} />
                  )}
                  <span>{blog.author.name}</span>
                </div>
              )}

              {blog.publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{blog.readTime} min read</span>
              </div>

              {blog.viewCount !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{blog.viewCount} views</span>
                </div>
              )}

              {blog.likeCount !== undefined && (
                <div className="flex items-center gap-1">
                  <Heart size={16} />
                  <span>{blog.likeCount} likes</span>
                </div>
              )}
            </div>

            {/* Categories and Tags */}
            <div className="flex flex-wrap gap-4 mb-6">
              {/* Categories */}
              {blog.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.categories.map(category => (
                    <Link
                      key={category._id}
                      href={`/blogs?category=${category._id}`}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                      style={
                        category.color
                          ? {
                              backgroundColor: category.color + '20',
                              color: category.color,
                            }
                          : {}
                      }
                    >
                      {category.icon && <span className="mr-1">{category.icon}</span>}
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Tags */}
              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map(tag => (
                    <Link
                      key={tag._id}
                      href={`/blogs?tag=${tag._id}`}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-1"
                      style={
                        tag.color
                          ? {
                              backgroundColor: tag.color + '20',
                              color: tag.color,
                            }
                          : {}
                      }
                    >
                      <Tag size={12} />
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Bookmark size={16} />
                Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </article>

        {/* Table of Contents */}
        {blog.tableOfContents && blog.tableOfContents.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <nav className="space-y-2">
              {blog.tableOfContents.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                  style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6 md:p-8 mb-8">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Author Bio */}
        {blog.author && blog.author.bio && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">About the Author</h2>
            <div className="flex gap-4">
              {blog.author.profilePicture && (
                <img
                  src={blog.author.profilePicture.url}
                  alt={blog.author.profilePicture.alt}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{blog.author.name}</h3>
                {blog.author.role && (
                  <p className="text-gray-600 text-sm mb-2">{blog.author.role}</p>
                )}
                <p className="text-gray-700 mb-3">{blog.author.bio}</p>

                {/* Social Links */}
                {blog.author.socialLinks && (
                  <div className="flex gap-3">
                    {Object.entries(blog.author.socialLinks).map(([platform, url]) =>
                      url ? (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 capitalize text-sm"
                        >
                          {platform}
                        </a>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Related Blogs */}
        {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blog.relatedBlogs.map(relatedBlog => (
                <Link
                  key={relatedBlog._id}
                  href={`/blogs/${relatedBlog._id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold mb-2">{relatedBlog.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{relatedBlog.summary}</p>
                  {relatedBlog.publishedAt && (
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(relatedBlog.publishedAt).toLocaleDateString()}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
