/*
  File: app/(admin)/important-logs/page.tsx
  Description: Frontend for viewing important logs in a paginated, filterable table using shadcn/ui and TanStack Query.
*/

'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import env from '@/lib/env';

const fetchImportantLogs = async (params: any) => {
  const res = await axios.get(env.BACKEND_URL + '/api/important-logs', { params });
  return res.data;
};

export default function ImportantLogsPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    action: undefined,
    performedBy: undefined,
    success: undefined,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['importantLogs', filters],
    queryFn: () => fetchImportantLogs(filters),
  });

  const logs = data?.data || [];
  const meta = data?.meta || {};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters({ ...filters, [name]: value });
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">🔍 Important Logs</h2>

      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Action</Label>
            <Input
              name="action"
              value={filters.action}
              onChange={handleInputChange}
              placeholder="e.g. CRON_EXECUTION"
            />
          </div>
          <div>
            <Label>Performed By</Label>
            <Input
              name="performedBy"
              value={filters.performedBy}
              onChange={handleInputChange}
              placeholder="admin_id"
            />
          </div>
          <div>
            <Label>Success</Label>
            <Select onValueChange={val => handleSelectChange('success', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Success</SelectItem>
                <SelectItem value="false">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={() => setFilters({ ...filters, page: 1 })} className="w-full">
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl shadow border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Performed By</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : logs.length > 0 ? (
              logs.map((log: any) => (
                <TableRow key={log._id}>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.performedBy}</TableCell>
                  <TableCell>{log.source || '-'}</TableCell>
                  <TableCell>
                    <span
                      className={`font-semibold ${log.success ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {log.success ? 'Success' : 'Failed'}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate" title={log.message}>
                    {log.message}
                  </TableCell>
                  <TableCell>{format(new Date(log.createdAt), 'dd MMM yyyy, hh:mm a')}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No logs found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          disabled={filters.page === 1}
          onClick={() => handlePageChange(filters.page - 1)}
        >
          Prev
        </Button>
        <p className="text-sm">
          Page {filters.page} of {meta.totalPages || 1}
        </p>
        <Button
          variant="outline"
          disabled={filters.page === meta.totalPages}
          onClick={() => handlePageChange(filters.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
