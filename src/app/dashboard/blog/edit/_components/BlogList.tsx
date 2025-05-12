// components/blog/BlogList.tsx
'use client';

import { useEffect, useState } from 'react';
import { useBlogs } from './useblog';
import { useCategories } from './useCategories';
import { useTags } from './useTags';
import { BlogQueryParams, Blog } from './types';
import BlogCard from './BlogCard';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// Limited sort options
const sortOptions = [
  { value: 'updated', label: 'Recently Updated' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'title', label: 'Title (A-Z)' },
];

// Status options
const statusOptions = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'archived', label: 'Archived' },
];

export default function BlogList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse query parameters including status
  const [queryParams, setQueryParams] = useState<BlogQueryParams>({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    tag: searchParams.get('tag') || '',
    sort: (searchParams.get('sort') as any) || 'updated',
    status: (searchParams.get('status') as any) || 'draft', // Default to published but get from URL if present
  });

  // Fetch blogs with the current query parameters
  const { data: blogData, isLoading, isError } = useBlogs(queryParams);

  // Fetch categories and tags for filters
  const { data: categoryData } = useCategories();
  const { data: tagData } = useTags();

  // Update URL when query parameters change
  useEffect(() => {
    const params = new URLSearchParams();

    // Include all parameters in URL, including status
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      }
    });

    // Update the URL without reloading the page
    const url = pathname + (params.toString() ? `?${params.toString()}` : '');
    router.push(url);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, pathname, router]);

  // Handle search input
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;

    setQueryParams(prev => ({
      ...prev,
      search: searchQuery,
      page: 1, // Reset to first page on new search
    }));
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | number) => {
    setQueryParams(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setQueryParams(prev => ({
      ...prev,
      page: newPage,
    }));

    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Blog Posts</h1>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              name="search"
              placeholder="Search articles..."
              defaultValue={queryParams.search || ''}
              className="w-full md:w-64 px-4 py-2 border rounded-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Status filter */}
        <div className="w-full sm:w-auto">
          <select
            value={queryParams.status || 'published'}
            onChange={e => handleFilterChange('status', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category filter */}
        <div className="w-full sm:w-auto">
          <select
            value={queryParams.category || ''}
            onChange={e => handleFilterChange('category', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            {categoryData?.categories?.map(category => (
              <option key={category._id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tag filter */}
        <div className="w-full sm:w-auto">
          <select
            value={queryParams.tag || ''}
            onChange={e => handleFilterChange('tag', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">All Tags</option>
            {tagData?.tags?.map(tag => (
              <option key={tag._id} value={tag.slug}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort filter */}
        <div className="w-full sm:w-auto">
          <select
            value={queryParams.sort || 'updated'}
            onChange={e => handleFilterChange('sort', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold text-red-500">Error loading blogs</h3>
          <p className="mt-2">Please try again later.</p>
        </div>
      )}

      {/* No results */}
      {!isLoading && !isError && (!blogData?.blogs || blogData.blogs.length === 0) && (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold">No blog posts found</h3>
          <p className="mt-2">Try adjusting your filters or search query.</p>
        </div>
      )}

      {/* Blog posts grid */}
      {!isLoading && !isError && blogData?.blogs && blogData.blogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogData.blogs.map((blog: Blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {blogData && blogData.pagination && blogData.pagination.totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(blogData.pagination.currentPage - 1)}
              disabled={!blogData.pagination.hasPrevPage}
              className={`px-4 py-2 rounded-lg ${
                blogData.pagination.hasPrevPage
                  ? 'bg-gray-200 hover:bg-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Previous
            </button>

            {/* Page numbers */}
            {Array.from({ length: blogData.pagination.totalPages }, (_, i) => i + 1)
              .filter(
                page =>
                  page === 1 ||
                  page === blogData.pagination.totalPages ||
                  Math.abs(page - blogData.pagination.currentPage) <= 2
              )
              .map((page, index, array) => {
                // Add ellipsis for page gaps
                if (index > 0 && page - array[index - 1] > 1) {
                  return (
                    <span key={`ellipsis-${page}`} className="flex items-center px-4 py-2">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      page === blogData.pagination.currentPage
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

            <button
              onClick={() => handlePageChange(blogData.pagination.currentPage + 1)}
              disabled={!blogData.pagination.hasNextPage}
              className={`px-4 py-2 rounded-lg ${
                blogData.pagination.hasNextPage
                  ? 'bg-gray-200 hover:bg-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
