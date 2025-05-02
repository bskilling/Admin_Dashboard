"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOptions, STATUS_OPTIONS, TYPE_OPTIONS } from "./types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface LeadFilterProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  isFilterMenuOpen: boolean;
  setIsFilterMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resetFilters: () => void;
}

const LeadFilter: React.FC<LeadFilterProps> = ({
  filters,
  setFilters,
  isFilterMenuOpen,
  setIsFilterMenuOpen,
  resetFilters,
}) => {
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [tempFilters, setTempFilters] = useState<FilterOptions>({ ...filters });

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.type) count++;
    if (filters.status) count++;
    if (filters.subCategory) count++;
    if (filters.category) count++;
    if (filters.courseId) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  // Apply filters
  const applyFilters = () => {
    setFilters(tempFilters);
    setIsFilterMenuOpen(false);
  };

  // Reset temp filters
  const handleResetFilters = () => {
    setTempFilters({
      type: "",
      subCategory: "",
      status: "",
      searchQuery: filters.searchQuery, // Preserve search query
      category: "",
      courseId: "",
    });
    resetFilters();
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or query..."
            className="pl-10 w-full"
            value={filters.searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setFilters((prev) => ({ ...prev, searchQuery: value }));
              setTempFilters((prev) => ({ ...prev, searchQuery: value }));
            }}
          />
          {filters.searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => {
                setFilters((prev) => ({ ...prev, searchQuery: "" }));
                setTempFilters((prev) => ({ ...prev, searchQuery: "" }));
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Popover open={isFilterMenuOpen} onOpenChange={setIsFilterMenuOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1"
              aria-expanded={isFilterMenuOpen}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 bg-blue-500 text-white">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 md:w-96 p-4" align="end">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Filter Leads</h3>

              {/* Type Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Lead Type
                </label>
                <Select
                  value={tempFilters.type}
                  onValueChange={(value) =>
                    setTempFilters({ ...tempFilters, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Status
                </label>
                <Select
                  value={tempFilters.status}
                  onValueChange={(value) =>
                    setTempFilters({ ...tempFilters, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sub Category Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Sub Category
                </label>
                <Select
                  value={tempFilters.subCategory}
                  onValueChange={(value) =>
                    setTempFilters({ ...tempFilters, subCategory: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sub-Categories</SelectItem>
                    <SelectItem value="jobs">Jobs</SelectItem>
                    <SelectItem value="skills">Skills</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Course Categories - could be populated from API */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Course Category
                </label>
                <Select
                  value={tempFilters.category}
                  onValueChange={(value) =>
                    setTempFilters({ ...tempFilters, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {/* This would be populated from API */}
                    <SelectItem value="cat1">Web Development</SelectItem>
                    <SelectItem value="cat2">Data Science</SelectItem>
                    <SelectItem value="cat3">Digital Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
                <Button size="sm" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.type && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 flex items-center gap-1"
            >
              Type: {filters.type.toUpperCase()}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setFilters({ ...filters, type: "" })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.status && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 flex items-center gap-1"
            >
              Status: {filters.status}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setFilters({ ...filters, status: "" })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.subCategory && (
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 flex items-center gap-1"
            >
              Sub-Category: {filters.subCategory}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setFilters({ ...filters, subCategory: "" })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.category && (
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 flex items-center gap-1"
            >
              Category
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setFilters({ ...filters, category: "" })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {activeFiltersCount > 1 && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs"
              onClick={resetFilters}
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadFilter;
