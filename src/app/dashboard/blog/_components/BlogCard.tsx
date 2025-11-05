// components/blog/BlogCard.tsx
'use client';

import { Blog } from './types';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const isNew =
    new Date(blog.publishedAt || blog.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000; // Less than 7 days old

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      {/* Featured Image */}
      <div className="relative h-48 w-full">
        {blog.featuredImage ? (
          <Image
            src={
              // @ts-expect-error
              blog.featuredImage as string
            }
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Labels */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {isNew && (
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
              New
            </span>
          )}

          {blog.isFeatured && (
            <span className="bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Featured
            </span>
          )}

          {blog.isTopPick && (
            <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Top Pick
            </span>
          )}

          {blog.difficulty && (
            <span
              className={`text-white text-xs font-semibold px-2 py-1 rounded ${
                blog.difficulty === 'beginner'
                  ? 'bg-blue-500'
                  : blog.difficulty === 'intermediate'
                    ? 'bg-orange-500'
                    : 'bg-red-500'
              }`}
            >
              {blog.difficulty.charAt(0).toUpperCase() + blog.difficulty.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-2">
          {Array.isArray(blog.categories) &&
            blog.categories.map((category: any) => (
              <Link
                href={`/dashboard/blog?category=${typeof category === 'string' ? category : category.slug}`}
                key={typeof category === 'string' ? category : category._id}
                className="text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                {typeof category === 'string' ? category : category.name}
              </Link>
            ))}
        </div>

        {/* Title */}
        <Link href={`/dashboard/blog/${blog.slug}`} className="group">
          <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
            {blog.title}
          </h2>
        </Link>

        {/* Summary */}
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{blog.summary}</p>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center">
            {/* Author photo if available */}
            {blog.author && typeof blog.author !== 'string' && blog.author.profilePicture && (
              <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
                <Image
                  src={blog.author.profilePicture as string}
                  alt={blog.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Author name */}
            <span>
              {blog.author
                ? typeof blog.author === 'string'
                  ? blog.author
                  : blog.author.name
                : 'Unknown Author'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Read time */}
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {blog.readTime} min read
            </span>

            {/* Publication date */}
            <span title={new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}>
              {formatDistanceToNow(new Date(blog.publishedAt || blog.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
