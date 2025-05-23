// app/nsdc-lead/_components/pagination-controls.tsx
'use client';

import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Props {
  page: number;
  limit: number;
  total: number;
}

export const PaginationControls = ({ page, limit, total }: Props) => {
  const router = useRouter();
  const totalPages = Math.ceil(total / limit);

  const setParam = (newPage: number, newLimit: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    params.set('limit', newLimit.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button disabled={page === 1} onClick={() => setParam(page - 1, limit)}>
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button disabled={page === totalPages} onClick={() => setParam(page + 1, limit)}>
          Next
        </Button>
      </div>

      <Select value={limit.toString()} onValueChange={val => setParam(1, parseInt(val))}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Limit" />
        </SelectTrigger>
        <SelectContent>
          {[10, 20, 50, 100].map(num => (
            <SelectItem key={num} value={num.toString()}>
              {num} / page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
