"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOptions } from "./type";

interface LeadsFilterProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  isFilterMenuOpen: boolean;
  setIsFilterMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resetFilters: () => void;
}

const LeadsFilter: React.FC<LeadsFilterProps> = ({
  filters,
  setFilters,
  isFilterMenuOpen,
  setIsFilterMenuOpen,
  resetFilters,
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600">
            Manage and track all your business leads in one place
          </p>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              className="pl-10 w-full md:w-64"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters({ ...filters, searchQuery: e.target.value })
              }
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filter menu */}
      {isFilterMenuOpen && (
        <div className="mb-6 p-4 border rounded-md bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Lead Type
              </label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="b2i">B2I</SelectItem>
                  <SelectItem value="b2b">B2B</SelectItem>
                  <SelectItem value="b2c">B2C</SelectItem>
                  <SelectItem value="b2g">B2G</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="NEW">NEW</SelectItem>
                  <SelectItem value="Attempted to Contact">
                    Attempted to Contact
                  </SelectItem>
                  <SelectItem value="Not Contact">Not Contact</SelectItem>
                  <SelectItem value="In-conversation">
                    In-conversation
                  </SelectItem>
                  <SelectItem value="Prospect">Prospect</SelectItem>
                  <SelectItem value="Not-Eligible">Not Eligible</SelectItem>
                  <SelectItem value="Not-Interested">Not Interested</SelectItem>
                  <SelectItem value="Spam">Spam</SelectItem>
                  <SelectItem value="Opportunity">Opportunity</SelectItem>
                  <SelectItem value="Contact-in-Future">
                    Contact in Future
                  </SelectItem>
                  <SelectItem value="Closed-Won">Closed-Won</SelectItem>
                  <SelectItem value="Closed-Lost">Closed-Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Sub Category
              </label>
              <Select
                value={filters.subCategory}
                onValueChange={(value) =>
                  setFilters({ ...filters, subCategory: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="jobs">Jobs</SelectItem>
                  <SelectItem value="skills">Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={resetFilters} className="mr-2">
              Reset Filters
            </Button>
            <Button onClick={() => setIsFilterMenuOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default LeadsFilter;
