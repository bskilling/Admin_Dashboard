"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
// import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/app/hooks/use-debounce";

interface EmiLeadFilterProps {
  currentSearch: string;
  currentStatus: string;
  currentStartDate: string;
  currentEndDate: string;
}

export function EmiLeadFilter({
  currentSearch,
  currentStatus,
  currentStartDate,
  currentEndDate,
}: EmiLeadFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Form state
  const [search, setSearch] = useState(currentSearch);
  const [status, setStatus] = useState(currentStatus);
  const [startDate, setStartDate] = useState<Date | undefined>(
    currentStartDate ? new Date(currentStartDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    currentEndDate ? new Date(currentEndDate) : undefined
  );

  // Debounce search input to avoid too many URL updates
  const debouncedSearch = useDebounce(search, 500);

  // Update URL with filters
  const updateFilters = useCallback(() => {
    const params = new URLSearchParams();

    // Always include page and limit
    params.append("page", "1"); // Reset to first page when filters change
    params.append("limit", "10");

    if (debouncedSearch) params.append("search", debouncedSearch);
    if (status) params.append("status", status);
    if (startDate)
      params.append("startDate", startDate.toISOString().split("T")[0]);
    if (endDate) params.append("endDate", endDate.toISOString().split("T")[0]);

    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, status, startDate, endDate, router, pathname]);

  // Update URL when debounced search changes
  useEffect(() => {
    updateFilters();
  }, [debouncedSearch, updateFilters]);

  // Quick filter by status
  const handleStatusChange = (value: string) => {
    setStatus(value);

    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("limit", "10");
    if (debouncedSearch) params.append("search", debouncedSearch);
    params.append("status", value);
    if (startDate)
      params.append("startDate", startDate.toISOString().split("T")[0]);
    if (endDate) params.append("endDate", endDate.toISOString().split("T")[0]);

    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle date selection
  const handleDateSelect = (field: "start" | "end", date?: Date) => {
    if (field === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  // Apply date filters
  const applyDateFilters = () => {
    updateFilters();
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setStartDate(undefined);
    setEndDate(undefined);
    router.push(pathname);
  };

  // Count active filters
  const activeFilterCount = [
    debouncedSearch,
    status,
    startDate,
    endDate,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
      <div className="w-full sm:w-auto flex-1">
        <Input
          placeholder="Search by name, email, or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="">All Statuses</SelectItem> */}
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="Attempted to Contact">
              Attempted to Contact
            </SelectItem>
            <SelectItem value="In-conversation">In Conversation</SelectItem>
            <SelectItem value="Spam">Spam</SelectItem>
            <SelectItem value="Converted">Converted</SelectItem>
            <SelectItem value="Not-Converted">Not Converted</SelectItem>
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FilterIcon className="h-4 w-4" />
              Advanced Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 rounded-full bg-primary w-5 h-5 text-[11px] flex items-center justify-center text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter EMI Leads</SheetTitle>
              <SheetDescription>
                Apply filters to narrow down your EMI leads list
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sheet-search">Search</Label>
                <Input
                  id="sheet-search"
                  placeholder="Name, email, or phone"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sheet-status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="sheet-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="">All Statuses</SelectItem> */}
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="Attempted to Contact">
                      Attempted to Contact
                    </SelectItem>
                    <SelectItem value="In-conversation">
                      In Conversation
                    </SelectItem>
                    <SelectItem value="Spam">Spam</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                    <SelectItem value="Not-Converted">Not Converted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"></PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "End date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"></PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button onClick={applyDateFilters}>Apply Filters</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={resetFilters} size="sm">
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
