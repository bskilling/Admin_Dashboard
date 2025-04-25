"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  search: string;
  status: string;
  sort: string;
  order: string;
  startDate: string;
  endDate: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  limit,
  search,
  status,
  sort,
  order,
  startDate,
  endDate,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Generate pagination URL with all current filters
  const getPaginationUrl = (page: number, newLimit?: number) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", newLimit ? newLimit.toString() : limit.toString());

    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (sort) params.append("sort", sort);
    if (order) params.append("order", order);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return `${pathname}?${params.toString()}`;
  };

  // Handle limit change
  const handleLimitChange = (newLimit: string) => {
    router.push(getPaginationUrl(1, parseInt(newLimit)));
  };

  // Generate page links
  const generatePageLinks = () => {
    const links = [];

    // Always show first page
    links.push(
      <PaginationItem key="page-1">
        <PaginationLink href={getPaginationUrl(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Add ellipsis if needed
    if (currentPage > 3) {
      links.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i > 1 && i < totalPages) {
        links.push(
          <PaginationItem key={`page-${i}`}>
            <PaginationLink
              href={getPaginationUrl(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      links.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      links.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink
            href={getPaginationUrl(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return links;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="perPage" className="text-sm">
          Rows per page:
        </Label>
        <Select value={limit.toString()} onValueChange={handleLimitChange}>
          <SelectTrigger id="perPage" className="w-[70px]">
            <SelectValue placeholder={limit.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={currentPage > 1 ? getPaginationUrl(currentPage - 1) : "#"}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {generatePageLinks()}

          <PaginationItem>
            <PaginationNext
              href={
                currentPage < totalPages
                  ? getPaginationUrl(currentPage + 1)
                  : "#"
              }
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages || 1}
      </div>
    </div>
  );
}
