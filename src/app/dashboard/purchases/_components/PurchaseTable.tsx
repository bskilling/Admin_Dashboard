'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Mail,
  Phone,
  Copy,
  ExternalLink,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Purchase, Pagination } from './types';
import { formatCurrency, formatDate, getStatusConfig, truncateText } from './purchaseUtils';

interface PurchaseTableProps {
  purchases: Purchase[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onViewDetails: (purchase: Purchase) => void;
  loading?: boolean;
}

interface TableRowProps {
  purchase: Purchase;
  onViewDetails: (purchase: Purchase) => void;
}

const TableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4">
        <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-3 bg-gray-100 rounded animate-pulse"></div>
        </div>
        <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    ))}
  </div>
);

const TableRow: React.FC<TableRowProps> = ({ purchase, onViewDetails }) => {
  const statusConfig = getStatusConfig(purchase.status);
  const StatusIcon = statusConfig.icon;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You might want to add a toast notification here
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <tr className="border-b hover:bg-gray-50/50 transition-colors">
      {/* Order ID */}
      <td className="p-4">
        <div className="space-y-1">
          <div className="font-mono text-sm font-medium">{purchase.orderId}</div>
          <div className="text-xs text-muted-foreground">
            {formatDate(purchase.createdAt).split(',')[0]}
          </div>
        </div>
      </td>

      {/* Customer */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" alt={purchase.userDetails?.name} />
            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
              {purchase.userDetails?.name ? getUserInitials(purchase.userDetails.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm truncate">
              {purchase.userDetails?.name || 'Unknown User'}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {purchase.userDetails?.email}
            </div>
          </div>
        </div>
      </td>

      {/* Course */}
      <td className="p-4">
        <div className="max-w-48">
          <div className="font-medium text-sm truncate" title={purchase.courseDetails?.title}>
            {truncateText(purchase.courseDetails?.title || 'Unknown Course', 40)}
          </div>
          <div className="text-xs text-muted-foreground">Course</div>
        </div>
      </td>

      {/* Amount */}
      <td className="p-4">
        <div className="text-right">
          <div className="font-semibold text-sm">
            {formatCurrency(purchase.amount, purchase.currency)}
          </div>
          <div className="text-xs text-muted-foreground">{purchase.currency}</div>
        </div>
      </td>

      {/* Status */}
      <td className="p-4">
        <Badge className={`${statusConfig.color} flex items-center gap-1 w-fit`}>
          <StatusIcon className="w-3 h-3" />
          {statusConfig.label}
        </Badge>
      </td>

      {/* Date */}
      <td className="p-4">
        <div className="text-sm">{formatDate(purchase.createdAt)}</div>
      </td>

      {/* Actions */}
      <td className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => onViewDetails(purchase)}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => copyToClipboard(purchase.orderId)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Order ID
            </DropdownMenuItem>

            {purchase.userDetails?.email && (
              <DropdownMenuItem onClick={() => copyToClipboard(purchase.userDetails!.email)}>
                <Mail className="w-4 h-4 mr-2" />
                Copy Email
              </DropdownMenuItem>
            )}

            {purchase.courseDetails?.slug && (
              <DropdownMenuItem>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Course
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

const PaginationControls: React.FC<{
  pagination: Pagination;
  onPageChange: (page: number) => void;
}> = ({ pagination, onPageChange }) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, pagination.currentPage - delta);
      i <= Math.min(pagination.totalPages - 1, pagination.currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (pagination.currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (pagination.currentPage + delta < pagination.totalPages - 1) {
      rangeWithDots.push('...', pagination.totalPages);
    } else {
      rangeWithDots.push(pagination.totalPages);
    }

    return rangeWithDots;
  };

  if (pagination.totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {(pagination.currentPage - 1) * pagination.limit + 1}-
        {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
        {pagination.totalCount.toLocaleString()} results
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={!pagination.hasPrevPage}
          onClick={() => onPageChange(pagination.currentPage - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) =>
            page === '...' ? (
              <span key={index} className="px-2 py-1 text-sm text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={index}
                variant={page === pagination.currentPage ? 'default' : 'outline'}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.currentPage + 1)}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const PurchaseTable: React.FC<PurchaseTableProps> = ({
  purchases,
  pagination,
  onPageChange,
  onViewDetails,
  loading = false,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          All Purchases
          <span className="text-sm font-normal text-muted-foreground">
            ({pagination.totalCount.toLocaleString()})
          </span>
        </CardTitle>
        <CardDescription>
          Manage and monitor all course purchases with detailed information
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium text-sm">Order ID</th>
                <th className="text-left p-4 font-medium text-sm">Customer</th>
                <th className="text-left p-4 font-medium text-sm">Course</th>
                <th className="text-right p-4 font-medium text-sm">Amount</th>
                <th className="text-left p-4 font-medium text-sm">Status</th>
                <th className="text-left p-4 font-medium text-sm">Date</th>
                <th className="text-center p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <TableSkeleton />
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    <div className="space-y-2">
                      <div>No purchases found</div>
                      <div className="text-sm">Try adjusting your filters or search terms</div>
                    </div>
                  </td>
                </tr>
              ) : (
                purchases.map(purchase => (
                  <TableRow key={purchase._id} purchase={purchase} onViewDetails={onViewDetails} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && purchases.length > 0 && (
          <div className="mt-6">
            <PaginationControls pagination={pagination} onPageChange={onPageChange} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PurchaseTable;
