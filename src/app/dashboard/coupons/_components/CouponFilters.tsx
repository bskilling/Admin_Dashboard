'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function CouponFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [type, setType] = useState<string | undefined>(searchParams.get('type') || undefined);
  const [active, setActive] = useState<string | undefined>(searchParams.get('active') || undefined);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (active) params.set('active', active);
    router.push(`/dashboard/coupons?${params.toString()}`);
  };

  const resetFilters = () => {
    setType(undefined);
    setActive(undefined);
    router.push('/coupons');
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="type">Coupon Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="active">Status</Label>
        <Select value={active} onValueChange={setActive}>
          <SelectTrigger id="active">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters}>Apply</Button>
        <Button variant="outline" onClick={resetFilters}>
          Clear
        </Button>
      </div>
    </div>
  );
}
