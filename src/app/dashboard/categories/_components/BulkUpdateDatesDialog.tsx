'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarDays } from 'lucide-react';
import env from '@/lib/env';
import { ICategories } from './CreateCategory';

interface BulkUpdateDatesDialogProps {
  category: ICategories['categories'][number];
  children: React.ReactNode;
}

interface BulkUpdateData {
  categoryIds?: string[];
  startTime?: string;
  endTime?: string;
  isPublished?: boolean;
  type?: string;
}

export default function BulkUpdateDatesDialog({ category, children }: BulkUpdateDatesDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [updateStartDate, setUpdateStartDate] = useState(false);
  const [updateEndDate, setUpdateEndDate] = useState(false);
  const [onlyPublished, setOnlyPublished] = useState(false);
  const [filterByType, setFilterByType] = useState<string>('all');

  const bulkUpdateMutation = useMutation({
    mutationFn: async (data: BulkUpdateData) => {
      const res = await axios.patch(`${env.BACKEND_URL}/api/courses/bulk-update-dates`, data);
      return res.data;
    },
    onSuccess: response => {
      toast.success(
        `Successfully updated ${response.data.modified} out of ${response.data.matched} courses`
      );

      queryClient.invalidateQueries({
        queryKey: ['courses', category?._id],
      });

      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update courses';
      toast.error(errorMessage);
    },
  });

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setUpdateStartDate(false);
    setUpdateEndDate(false);
    setOnlyPublished(false);
    setFilterByType('all');
  };

  const handleSubmit = () => {
    if (!updateStartDate && !updateEndDate) {
      toast.error('Please select at least one date to update');
      return;
    }

    if (updateStartDate && !startDate) {
      toast.error('Please provide start date');
      return;
    }

    if (updateEndDate && !endDate) {
      toast.error('Please provide end date');
      return;
    }

    const updateData: BulkUpdateData = {
      categoryIds: [category._id],
    };

    if (onlyPublished) {
      updateData.isPublished = true;
    }

    if (filterByType !== 'all') {
      updateData.type = filterByType;
    }

    if (updateStartDate) {
      updateData.startTime = new Date(startDate).toISOString();
    }

    if (updateEndDate) {
      updateData.endTime = new Date(endDate).toISOString();
    }

    if (updateStartDate && updateEndDate) {
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);

      if (startDateTime >= endDateTime) {
        toast.error('Start date must be before end date');
        return;
      }
    }

    bulkUpdateMutation.mutate(updateData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-[90vw] max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Bulk Update Course Dates
          </DialogTitle>
          <DialogDescription>
            Update dates for courses in{' '}
            <span className="font-semibold text-blue-600 capitalize">{category?.name}</span> (
            {category?.type?.toUpperCase()})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="onlyPublished"
                checked={onlyPublished}
                onCheckedChange={setOnlyPublished}
              />
              <Label htmlFor="onlyPublished">Only Published</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeFilter">Type</Label>
              <Select value={filterByType} onValueChange={setFilterByType}>
                <SelectTrigger id="typeFilter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="b2c">B2C</SelectItem>
                  <SelectItem value="b2b">B2B</SelectItem>
                  <SelectItem value="b2g">B2G</SelectItem>
                  <SelectItem value="b2i">B2I</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="updateStartDate"
                checked={updateStartDate}
                onCheckedChange={setUpdateStartDate}
              />
              <Label htmlFor="updateStartDate">Update Start Date</Label>
            </div>

            {updateStartDate && (
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            )}
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="updateEndDate"
                checked={updateEndDate}
                onCheckedChange={setUpdateEndDate}
              />
              <Label htmlFor="updateEndDate">Update End Date</Label>
            </div>

            {updateEndDate && (
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={bulkUpdateMutation.isPending || (!updateStartDate && !updateEndDate)}
          >
            {bulkUpdateMutation.isPending ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
