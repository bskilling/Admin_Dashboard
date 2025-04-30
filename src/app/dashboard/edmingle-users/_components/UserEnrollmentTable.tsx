// components/UserEnrollmentTable.tsx
"use client";

import { useState } from "react";
import { ChevronDown, MoreHorizontal, Search, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEnrollments, IEdmingleUser } from "./enrollments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function UserEnrollmentTable() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users with enrollments
  const { data, isLoading, isError } = useQuery({
    queryKey: ["enrollments", page],
    queryFn: () => fetchEnrollments(page, 10),
    staleTime: 1000 * 60 * 60 * 24 * 200,
  });

  // Filter users based on search query
  const filteredUsers =
    data?.data?.enrollments.filter((user) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.contactNumber.includes(query)
      );
    }) || [];

  // Count total enrollments for a user
  const countEnrollments = (user: IEdmingleUser) => user.enrollments.length;

  // Get enrollment status counts
  const getStatusCounts = (user: IEdmingleUser) => {
    return user.enrollments.reduce(
      (counts, enrollment) => {
        counts[enrollment.status] = (counts[enrollment.status] || 0) + 1;
        return counts;
      },
      {} as Record<string, number>
    );
  };

  // Get most recent enrollment date
  const getLatestEnrollment = (user: IEdmingleUser) => {
    if (user.enrollments.length === 0) return null;

    return user.enrollments.reduce((latest, enrollment) => {
      const currentDate = new Date(enrollment.enrolledAt);
      const latestDate = new Date(latest.enrolledAt);
      return currentDate > latestDate ? enrollment : latest;
    }, user.enrollments[0]);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-xl font-semibold">User Enrollments</h2>
          <p className="text-sm text-gray-600">
            Manage and view all user course enrollments
          </p>
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-10">
          <p className="text-lg text-red-600">Failed to load enrollments</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold text-center">
                  Total Enrollments
                </TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">
                  Latest Enrollment
                </TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >
                    {searchQuery
                      ? "No users match your search"
                      : "No enrollments found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const totalEnrollments = countEnrollments(user);
                  const statusCounts = getStatusCounts(user);
                  const latestEnrollment = getLatestEnrollment(user);

                  return (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-sm text-gray-500">
                            {user.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{user.contactNumber}</TableCell>
                      <TableCell className="text-center">
                        {totalEnrollments}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {statusCounts.enrolled && (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              {statusCounts.enrolled} Enrolled
                            </Badge>
                          )}
                          {statusCounts.pending && (
                            <Badge
                              variant="outline"
                              className="border-yellow-300 text-yellow-700"
                            >
                              {statusCounts.pending} Pending
                            </Badge>
                          )}
                          {statusCounts.failed && (
                            <Badge
                              variant="destructive"
                              className="bg-red-100 text-red-800 hover:bg-red-200"
                            >
                              {statusCounts.failed} Failed
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {latestEnrollment ? (
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {latestEnrollment.courseId.title.length > 20
                                ? `${latestEnrollment.courseId.title.substring(0, 20)}...`
                                : latestEnrollment.courseId.title}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(latestEnrollment.enrolledAt)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/edmingle-users/${user._id}`}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {data?.data?.pagination && data.data.pagination.totalPages > 1 && (
            <div className="p-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                      className={
                        page <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({
                    length: Math.min(5, data.data.pagination.totalPages),
                  }).map((_, i) => {
                    let pageNumber = page;

                    if (page <= 3) {
                      pageNumber = i + 1;
                    } else if (page >= data.data.pagination.totalPages - 2) {
                      pageNumber = data.data.pagination.totalPages - 4 + i;
                    } else {
                      pageNumber = page - 2 + i;
                    }

                    if (
                      pageNumber > 0 &&
                      pageNumber <= data.data.pagination.totalPages
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(pageNumber);
                            }}
                            isActive={pageNumber === page}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < data.data.pagination.totalPages)
                          setPage(page + 1);
                      }}
                      className={
                        page >= data.data.pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
