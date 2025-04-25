"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { EmiLeadActions } from "./emi-leads-actions";
import { EmiLeadStatus } from "./emi-leads-status";
import { EmiLeadFilter } from "./emi-leads-filter";
import { PaginationControls } from "./pagination-controls";
import { formatDate } from "@/lib/utils";

// Types based on our MongoDB schema
export interface EmiLead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  courseId?: string;
  amount?: number;
  status: string;
  emiDetails?: {
    partner: string;
    loanAmount: number;
    loanTenure: number;
    loanInterestRate: number;
    loanProcessingFee: number;
  };
  notes: Array<{
    text: string;
    status: string;
    addedBy?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface EmiLeadsResponse {
  success: boolean;
  message: string;
  data: {
    emiForms: EmiLead[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

interface EmiLeadsTableProps {
  page: number;
  limit: number;
  search: string;
  status: string;
  sort: string;
  order: string;
  startDate: string;
  endDate: string;
}

export function EmiLeadsTable({
  page,
  limit,
  search,
  status,
  sort,
  order,
  startDate,
  endDate,
}: EmiLeadsTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Fetch EMI leads data
  const { data, isLoading, isError } = useQuery<EmiLeadsResponse>({
    queryKey: [
      "emiLeads",
      page,
      limit,
      search,
      status,
      sort,
      order,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (sort) params.append("sort", sort);
      if (order) params.append("order", order);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/emi-leads?${params.toString()}`
      );
      return response.data;
    },
  });

  // Handle sorting change
  const handleSortChange = (column: string) => {
    const newOrder = sort === column && order === "asc" ? "desc" : "asc";
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    params.append("sort", column);
    params.append("order", newOrder);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    router.push(`${pathname}?${params.toString()}`);
  };

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800";
      case "Attempted to Contact":
        return "bg-yellow-100 text-yellow-800";
      case "In-conversation":
        return "bg-purple-100 text-purple-800";
      case "Spam":
        return "bg-red-100 text-red-800";
      case "Converted":
        return "bg-green-100 text-green-800";
      case "Not-Converted":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">
          Failed to load EMI leads. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EmiLeadFilter
        currentSearch={search}
        currentStatus={status}
        currentStartDate={startDate}
        currentEndDate={endDate}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <button
                  onClick={() => handleSortChange("name")}
                  className="flex items-center gap-1"
                >
                  Name
                  {sort === "name" && (
                    <span>{order === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSortChange("status")}
                  className="flex items-center gap-1"
                >
                  Status
                  {sort === "status" && (
                    <span>{order === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSortChange("createdAt")}
                  className="flex items-center gap-1"
                >
                  Date
                  {sort === "createdAt" && (
                    <span>{order === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </TableHead>
              <TableHead>Last Note</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 6 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data.emiForms.length ? (
              data.data.emiForms.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <div>{lead.email}</div>
                    <div className="text-sm text-gray-500">{lead.phone}</div>
                  </TableCell>
                  <TableCell>
                    <EmiLeadStatus
                      leadId={lead._id}
                      currentStatus={lead.status}
                    />
                  </TableCell>
                  <TableCell>{formatDate(lead.createdAt)}</TableCell>
                  <TableCell>
                    {lead.notes?.length > 0 ? (
                      <div
                        className="max-w-[200px] truncate"
                        title={lead.notes[lead.notes.length - 1].text}
                      >
                        {lead.notes[lead.notes.length - 1].text}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No notes yet
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <EmiLeadActions leadId={lead._id} lead={lead} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.data.pagination && (
        <PaginationControls
          currentPage={data.data.pagination.page}
          totalPages={data.data.pagination.pages}
          limit={limit}
          search={search}
          status={status}
          sort={sort}
          order={order}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </div>
  );
}
