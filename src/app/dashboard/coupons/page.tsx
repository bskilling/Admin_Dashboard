/*
This is a full Next.js (App Router) + React TypeScript frontend implementation for a Coupon Management Page
*/

// app/coupons/page.tsx
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon, SlidersHorizontal } from 'lucide-react';
import CouponList from './_components/CouponList';
import CouponForm from './_components/CouponForm';
import CouponFilters from './_components/CouponFilters';

export default function CouponsPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
  }, [searchParams]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Coupons</h1>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <CouponFilters />
            </SheetContent>
          </Sheet>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" /> New Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="w-1/3">
              <CouponForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CouponList query={query} />
    </div>
  );
}
