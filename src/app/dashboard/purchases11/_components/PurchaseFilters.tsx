// Add these imports at the top if not already present
'use client';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, X, Calendar, SlidersHorizontal } from 'lucide-react';
import { PurchaseFilters } from './types';
import { debounce } from './purchaseUtils';

interface PurchaseFiltersProps {
  filters: PurchaseFilters;
  onFiltersChange: (filters: Partial<PurchaseFilters>) => void;
  onExport: () => void;
  totalCount: number;
  loading?: boolean;
}
const PurchaseFiltersComponent: React.FC<PurchaseFiltersProps> = ({
  filters,
  onFiltersChange,
  onExport,
  totalCount,
  loading = false,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Debounced search handler
  const debouncedSearch = debounce((value: string) => {
    onFiltersChange({ search: value, page: 1 });
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (key: keyof PurchaseFilters, value: any) => {
    onFiltersChange({ [key]: value, page: 1 });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      courseId: undefined,
      userId: undefined,
      startDate: '',
      endDate: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.courseId) count++;
    if (filters.userId) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search and Quick Filters */}
          <div className="flex flex-1 gap-3 flex-wrap items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by order ID, user name, email, or course..."
                defaultValue={filters.search}
                onChange={handleSearchChange}
                className="pl-10"
                disabled={loading}
              />
            </div>

            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={value => handleFilterChange('status', value)}
              disabled={loading}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select
              value={filters.sortBy}
              onValueChange={value => handleFilterChange('sortBy', value)}
              disabled={loading}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select
              value={filters.sortOrder}
              onValueChange={value => handleFilterChange('sortOrder', value as 'asc' | 'desc')}
              disabled={loading}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest</SelectItem>
                <SelectItem value="asc">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 items-center">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
                disabled={loading}
              >
                <X className="w-3 h-3 mr-1" />
                Clear ({activeFiltersCount})
              </Button>
            )}

            <Sheet open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2" disabled={loading}>
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-96">
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                  <SheetDescription>
                    Apply additional filters to refine your search results
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                  {/* Start Date */}
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={filters.startDate}
                      onChange={e => handleFilterChange('startDate', e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={filters.endDate}
                      onChange={e => handleFilterChange('endDate', e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  {/* Course ID */}
                  <div>
                    <Label htmlFor="courseId">Course ID</Label>
                    <Input
                      id="courseId"
                      placeholder="Enter Course ID"
                      value={filters.courseId ?? ''}
                      onChange={e => handleFilterChange('courseId', e.target.value || undefined)}
                      disabled={loading}
                    />
                  </div>

                  {/* User ID */}
                  <div>
                    <Label htmlFor="userId">User ID</Label>
                    <Input
                      id="userId"
                      placeholder="Enter User ID"
                      value={filters.userId ?? ''}
                      onChange={e => handleFilterChange('userId', e.target.value || undefined)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Export Button */}
            <Button
              variant="default"
              onClick={onExport}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Showing <strong>{totalCount}</strong> results
        </p>
      </CardContent>
    </Card>
  );
};

export default PurchaseFiltersComponent;
