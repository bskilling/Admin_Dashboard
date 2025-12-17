// app/admin/categories/page.tsx
'use client';

import { useState } from 'react';
import { Plus, Search, MoreHorizontal, FolderTree, Hash, Folder } from 'lucide-react';
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

import { useCategoriesQuery, useDeleteCategoryMutation } from '@/lib/hooks/use-blog-queries';

import type { CategoryQueryInput } from '@/types/blog';
import { LoadingSpinner } from '../blogs/_components/loading-spinner';
import { EmptyState } from '../blogs/_components/empty-state';
import { Pagination } from '../blogs/_components/pagination';
import { ConfirmDialog } from '../blogs/_components/confirm-dialog';

export default function CategoriesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<CategoryQueryInput>({
    page: 1,
    limit: 20,
    sort: 'createdAt',
    order: 'desc',
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: categoriesResponse, isLoading, error } = useCategoriesQuery(filters);
  const deleteCategoryMutation = useDeleteCategoryMutation();

  const categories = categoriesResponse?.data || [];
  const meta = categoriesResponse?.meta;

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCategoryMutation.mutateAsync(deleteId);
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
            <p className="text-destructive">Failed to load categories. Please try again.</p>
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
            <FolderTree className="w-8 h-8" />
            Categories
          </h1>
          <p className="text-muted-foreground">
            Manage blog categories and organize your content hierarchically
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Category
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Root Categories</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.filter(cat => !cat.parent).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sub Categories</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.filter(cat => cat.parent).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(cat => cat.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search categories..."
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
            Active Only
          </Button>
          <Button
            variant={filters.parent === 'null' ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setFilters(prev => ({
                ...prev,
                parent: prev.parent === 'null' ? undefined : 'null',
                page: 1,
              }))
            }
          >
            Root Only
          </Button>
        </div>
      </div>

      {/* Categories Table */}
      {categories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="Get started by creating your first category to organize your blog posts."
          action={
            <Button asChild>
              <Link href="/admin/categories/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Category
              </Link>
            </Button>
          }
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Blog Count</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(category => (
                <TableRow key={category._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* Color indicator */}
                      {category.color && (
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      {/* Icon */}
                      {category.icon && (
                        <span className="text-muted-foreground">{category.icon}</span>
                      )}
                      <div>
                        <div className="font-medium text-sm">{category.name}</div>
                        {category.description && (
                          <div className="text-xs text-muted-foreground">
                            {category.description.length > 40
                              ? `${category.description.substring(0, 40)}...`
                              : category.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{category.slug}</code>
                  </TableCell>
                  <TableCell>
                    {category.parent && typeof category.parent === 'object' ? (
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: category.parent.color,
                          color: category.parent.color,
                        }}
                      >
                        {category.parent.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Root Category</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? 'default' : 'secondary'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.blogCount || 0} posts</Badge>
                  </TableCell>
                  <TableCell>
                    {category.displayOrder !== undefined ? (
                      <Badge variant="outline">{category.displayOrder}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/categories/${category._id}`)}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/categories/${category._id}/edit`)}
                        >
                          Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(category._id)}
                          className="text-destructive"
                        >
                          Delete Category
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {meta && meta.totalPages && meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page || 1}
          totalPages={meta.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={open => !open && setDeleteId(null)}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone and will affect any blog posts using this category."
        onConfirm={handleDelete}
        loading={deleteCategoryMutation.isPending}
      />
    </div>
  );
}
