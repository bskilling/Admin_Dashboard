/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/blogs/page.tsx
'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useBlogsQuery, useDeleteBlogMutation } from '@/lib/hooks/use-blog-queries';
import { useCategoriesQuery } from '@/lib/hooks/use-blog-queries';
import { BlogFilters } from './_components/blog-filters';
import { BlogCard } from './_components/blog-card';
import { ConfirmDialog } from './_components/confirm-dialog';
import { LoadingSpinner } from './_components/loading-spinner';
import { EmptyState } from './_components/empty-state';
import { Pagination } from './_components/pagination';

import type { BlogQueryInput } from '@/types/blog';

export default function BlogsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<BlogQueryInput>({
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
  });
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: blogsResponse, isLoading, error } = useBlogsQuery(filters);
  // @ts-expect-error Server Component
  const { data: categoriesResponse } = useCategoriesQuery({
    limit: 100,
  });
  const deleteBlogMutation = useDeleteBlogMutation();

  const blogs = blogsResponse?.data || [];
  const meta = blogsResponse?.meta;
  const categories = categoriesResponse?.data || [];

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleFilterChange = (newFilters: Partial<BlogQueryInput>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteBlogMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      published: 'default',
      draft: 'secondary',
      archived: 'destructive',
      scheduled: 'outline',
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load blogs. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts and content</p>
        </div>
        <Button asChild>
          <Link href="/admin/blogs/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Blog
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blogs.filter(blog => blog.status === 'published').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blogs.filter(blog => blog.status === 'draft').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blogs.reduce((sum, blog) => sum + blog.viewCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <BlogFilters
        filters={filters}
        categories={categories}
        onFiltersChange={handleFilterChange}
        onSearch={handleSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Content */}
      {blogs.length === 0 ? (
        <EmptyState
          title="No blogs found"
          description="Get started by creating your first blog post."
          action={
            <Button asChild>
              <Link href="/admin/blogs/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Blog
              </Link>
            </Button>
          }
        />
      ) : viewMode === 'table' ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map(blog => (
                <TableRow key={blog._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{blog.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {blog.summary.substring(0, 60)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(blog.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {blog.categories.slice(0, 2).map((category: any) => (
                        <Badge key={category._id} variant="outline" className="text-xs">
                          {category.name}
                        </Badge>
                      ))}
                      {blog.categories.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{blog.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{blog.viewCount}</TableCell>
                  <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/blogs/${blog._id}`)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/blogs/${blog._id}/edit`)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(blog._id)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map(blog => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onEdit={id => router.push(`/admin/blogs/${id}/edit`)}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta?.totalPages && meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page ?? 1}
          totalPages={meta.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={open => !open && setDeleteId(null)}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        onConfirm={handleDelete}
        loading={deleteBlogMutation.isPending}
      />
    </div>
  );
}
