// app/admin/tags/page.tsx
'use client';

import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Hash, Tag as TagIcon, Filter } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

import { useTagsQuery, useDeleteTagMutation } from '@/lib/hooks/use-blog-queries';

import type { TagQueryInput } from '@/types/blog';
import { LoadingSpinner } from '../blogs/_components/loading-spinner';
import { EmptyState } from '../blogs/_components/empty-state';
import { ConfirmDialog } from '../blogs/_components/confirm-dialog';
import { Pagination } from '../blogs/_components/pagination';

export default function TagsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<TagQueryInput>({
    page: 1,
    limit: 20,
    sort: 'createdAt',
    order: 'desc',
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const { data: tagsResponse, isLoading, error } = useTagsQuery(filters);
  const deleteTagMutation = useDeleteTagMutation();

  const tags = tagsResponse?.data || [];
  const meta = tagsResponse?.meta;

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteTagMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
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
            <p className="text-destructive">Failed to load tags. Please try again.</p>
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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TagIcon className="w-8 h-8" />
            Tags
          </h1>
          <p className="text-muted-foreground">
            Manage blog tags for better content labeling and organization
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tags/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Tag
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tags</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tags.filter(tag => tag.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tags with Blogs</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tags.filter(tag => (tag.blogCount || 0) > 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tags.reduce((sum, tag) => sum + (tag.blogCount || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tags..."
            onChange={e => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filters.isActive === 'true' ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setFilters(prev => ({
                ...prev,
                isActive: prev.isActive === 'true' ? undefined : 'true',
                page: 1,
              }))
            }
          >
            <Filter className="w-4 h-4 mr-1" />
            Active Only
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
          >
            {viewMode === 'table' ? 'Grid View' : 'Table View'}
          </Button>
        </div>
      </div>

      {/* Content */}
      {tags.length === 0 ? (
        <EmptyState
          title="No tags found"
          description="Get started by creating your first tag to label your blog posts."
          action={
            <Button asChild>
              <Link href="/admin/tags/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Tag
              </Link>
            </Button>
          }
        />
      ) : viewMode === 'table' ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Blog Count</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map(tag => (
                <TableRow key={tag._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* Color indicator */}
                      {tag.color && (
                        <div
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: tag.color }}
                        />
                      )}
                      <Badge
                        variant="secondary"
                        className="gap-1"
                        style={{
                          backgroundColor: tag.color ? tag.color + '20' : undefined,
                          color: tag.color || undefined,
                          borderColor: tag.color || undefined,
                        }}
                      >
                        <Hash className="w-3 h-3" />
                        {tag.name}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{tag.slug}</code>
                  </TableCell>
                  <TableCell>
                    {tag.description ? (
                      <span className="text-sm">
                        {tag.description.length > 60
                          ? `${tag.description.substring(0, 60)}...`
                          : tag.description}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm italic">No description</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={tag.isActive ? 'default' : 'secondary'}>
                      {tag.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{tag.blogCount || 0} posts</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(tag.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/tags/${tag._id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/tags/${tag._id}/edit`)}
                        >
                          Edit Tag
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(tag._id)}
                          className="text-destructive"
                        >
                          Delete Tag
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
        // Grid View
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tags.map(tag => (
            <Card key={tag._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant="secondary"
                    className="gap-1"
                    style={{
                      backgroundColor: tag.color ? tag.color + '20' : undefined,
                      color: tag.color || undefined,
                      borderColor: tag.color || undefined,
                    }}
                  >
                    <Hash className="w-3 h-3" />
                    {tag.name}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/admin/tags/${tag._id}`)}>
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/admin/tags/${tag._id}/edit`)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(tag._id)}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded block">{tag.slug}</code>

                  {tag.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{tag.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant={tag.isActive ? 'default' : 'secondary'} className="text-xs">
                      {tag.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {tag.blogCount || 0} posts
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Created {new Date(tag.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages && meta.totalPages > 1 && (
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
        title="Delete Tag"
        description="Are you sure you want to delete this tag? This action cannot be undone and will remove this tag from all associated blog posts."
        onConfirm={handleDelete}
        loading={deleteTagMutation.isPending}
      />
    </div>
  );
}
