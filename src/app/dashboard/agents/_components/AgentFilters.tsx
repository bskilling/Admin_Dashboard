// components/agents/AgentFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { AgentFilters } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X } from 'lucide-react';
import { useDebounce } from './use-debounce';

interface AgentFiltersProps {
  filters: AgentFilters;
  onFiltersChange: (filters: AgentFilters) => void;
}

export default function AgentFiltersComponent({ filters, onFiltersChange }: AgentFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    onFiltersChange({ ...filters, search: debouncedSearch, page: 1 });
  }, [debouncedSearch]);

  const handleFilterChange = (key: keyof AgentFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  const resetFilters = () => {
    setSearchValue('');
    onFiltersChange({
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.sortBy !== 'createdAt' ||
    filters.sortOrder !== 'desc';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <Select
                value={filters.status || 'all'}
                onValueChange={value =>
                  handleFilterChange('status', value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="flex-1">
              <Select
                value={filters.sortBy || 'createdAt'}
                onValueChange={value => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="totalSales">Total Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="flex-1">
              <Select
                value={filters.sortOrder || 'desc'}
                onValueChange={value => handleFilterChange('sortOrder', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <Button variant="outline" onClick={resetFilters} className="flex-shrink-0">
                <X className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
