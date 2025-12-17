/* eslint-disable @typescript-eslint/no-explicit-any */
// components/_components/blogs/blog-filters.tsx
'use client';

import { useState } from 'react';
import { Search, Filter, Grid, List, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import type { BlogQueryInput } from '@/types/blog';
import type { BlogCategory } from '@/types/entities';

interface BlogFiltersProps {
  filters: BlogQueryInput;
  categories: BlogCategory[];
  onFiltersChange: (filters: Partial<BlogQueryInput>) => void;
  onSearch: (search: string) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
}

export function BlogFilters({
  filters,
  categories,
  onFiltersChange,
  onSearch,
  viewMode,
  onViewModeChange,
}: BlogFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const clearFilter = (key: keyof BlogQueryInput) => {
    onFiltersChange({ [key]: undefined });
  };

  const clearAllFilters = () => {
    setSearchValue('');
    onFiltersChange({
      search: undefined,
      status: undefined,
      category: undefined,
      featured: undefined,
      topPick: undefined,
      difficulty: undefined,
    });
  };

  const getActiveFiltersCount = () => {
    const activeFilters = [
      filters.search,
      filters.status,
      filters.category,
      filters.featured,
      filters.topPick,
      filters.difficulty,
    ].filter(Boolean);
    return activeFilters.length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Top Row - Search and View Toggle */}
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search blogs..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          {/* Filter Popover */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-auto p-0 text-muted-foreground"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={filters.status || ''}
                    onValueChange={value =>
                      onFiltersChange({ status: (value as any) || undefined })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="">All statuses</SelectItem> */}
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={filters.category || ''}
                    onValueChange={value => onFiltersChange({ category: value || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="">All categories</SelectItem> */}
                      {categories.map(category => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select
                    value={filters.difficulty || ''}
                    onValueChange={value =>
                      onFiltersChange({
                        difficulty: (value as any) || undefined,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="">All levels</SelectItem> */}
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Special</label>
                  <div className="flex gap-2">
                    <Button
                      variant={filters.featured === 'true' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() =>
                        onFiltersChange({
                          featured: filters.featured === 'true' ? undefined : 'true',
                        })
                      }
                    >
                      Featured
                    </Button>
                    <Button
                      variant={filters.topPick === 'true' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() =>
                        onFiltersChange({
                          topPick: filters.topPick === 'true' ? undefined : 'true',
                        })
                      }
                    >
                      Top Pick
                    </Button>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort by</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={filters.sort || 'createdAt'}
                      onValueChange={value => onFiltersChange({ sort: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Created Date</SelectItem>
                        <SelectItem value="updatedAt">Updated Date</SelectItem>
                        <SelectItem value="publishedAt">Published Date</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="viewCount">View Count</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={filters.order || 'desc'}
                      onValueChange={value => onFiltersChange({ order: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Newest First</SelectItem>
                        <SelectItem value="asc">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-md p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className="h-7 px-2"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="h-7 px-2"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => {
                  setSearchValue('');
                  clearFilter('search');
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => clearFilter('status')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              Category: {categories.find(c => c._id === filters.category)?.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => clearFilter('category')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.difficulty && (
            <Badge variant="secondary" className="gap-1">
              Difficulty: {filters.difficulty}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => clearFilter('difficulty')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.featured === 'true' && (
            <Badge variant="secondary" className="gap-1">
              Featured
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => clearFilter('featured')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.topPick === 'true' && (
            <Badge variant="secondary" className="gap-1">
              Top Pick
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => clearFilter('topPick')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
