"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  Phone,
  Mail,
  MessageSquare,
  Search,
  EyeIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Lead } from "./types";
import { getStatusColor, getTypeBadgeColor } from "./leadUtils";
import { EmptyState, StatusBadge, TypeBadge } from "./LeadComponents";
import LeadDetailDialog from "./LeadDetails";

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalLeads: number;
    pageSize: number;
  };
  onPageChange: (page: number) => void;
  onStatusChange: (id: string, status: string, note: string) => Promise<void>;
  onAddComment: (id: string, comment: string) => Promise<void>;
  onAddNote: (id: string, text: string, status: string) => Promise<void>;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  loading,
  pagination,
  onPageChange,
  onStatusChange,
  onAddComment,
  onAddNote,
}) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  if (leads.length === 0) {
    return (
      <EmptyState message="Try adjusting your filters or search criteria to find the leads you're looking for." />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 shadow-lg overflow-hidden bg-white w-full mx-auto">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-slate-800 to-slate-700">
              <TableHead className="p-4 text-white font-medium">Lead</TableHead>
              <TableHead className="p-4 text-white font-medium">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Contact
                </div>
              </TableHead>
              <TableHead className="p-4 text-white font-medium">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Course / Query
                </div>
              </TableHead>
              <TableHead className="p-4 text-white font-medium whitespace-nowrap">
                Status
              </TableHead>
              <TableHead className="p-4 text-white font-medium text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id} className="hover:bg-slate-50">
                <TableCell className="p-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-lg font-semibold text-slate-700">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {lead.name}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <TypeBadge type={lead.type} />
                          {lead.subCategory && (
                            <Badge
                              variant="outline"
                              className="bg-indigo-100 text-indigo-800 border-indigo-200 text-xs"
                            >
                              {lead.subCategory}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Created: {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="p-4">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-slate-700 text-sm">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span>
                        {lead.countryCode} {lead.phoneNumber}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-700 text-sm">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <span className="truncate max-w-[150px]">
                        {lead.email}
                      </span>
                    </p>
                  </div>
                </TableCell>

                <TableCell className="p-4">
                  <div className="flex items-start">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 w-full">
                      <p className="text-sm font-medium text-slate-800 mb-1 truncate">
                        {lead.course?.title || "Unknown Course"}
                      </p>
                      {lead.course?.category && (
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-xs mb-2"
                        >
                          {lead.course.category.name}
                        </Badge>
                      )}
                      <p className="text-slate-700 text-sm line-clamp-2 mt-1">
                        {lead.query}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="p-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <div
                      className={`px-3 py-2 rounded-md text-sm font-medium ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </div>
                    <p className="text-xs text-slate-500">
                      Updated: {new Date(lead.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="p-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                    onClick={() => {
                      setSelectedLead(lead);
                      setIsDetailDialogOpen(true);
                    }}
                  >
                    <EyeIcon size={14} /> View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1 || loading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={
              pagination.currentPage === pagination.totalPages || loading
            }
          >
            Next
          </Button>
        </div>

        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(pagination.currentPage - 1) * pagination.pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  pagination.currentPage * pagination.pageSize,
                  pagination.totalLeads
                )}
              </span>{" "}
              of <span className="font-medium">{pagination.totalLeads}</span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <Button
                variant="outline"
                size="sm"
                className="rounded-l-md"
                onClick={() => onPageChange(1)}
                disabled={pagination.currentPage === 1 || loading}
              >
                <span className="sr-only">First</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || loading}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page Numbers */}
              <div className="bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 text-sm font-medium">
                {pagination.currentPage} / {pagination.totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={
                  pagination.currentPage === pagination.totalPages || loading
                }
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-r-md"
                onClick={() => onPageChange(pagination.totalPages)}
                disabled={
                  pagination.currentPage === pagination.totalPages || loading
                }
              >
                <span className="sr-only">Last</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        </div>
      </div>
      Lead Detail Dialog
      {selectedLead && (
        <LeadDetailDialog
          lead={selectedLead}
          isOpen={isDetailDialogOpen}
          onClose={() => setIsDetailDialogOpen(false)}
          onStatusChange={onStatusChange}
          onAddComment={onAddComment}
          onAddNote={onAddNote}
        />
      )}
    </div>
  );
};

export default LeadTable;
