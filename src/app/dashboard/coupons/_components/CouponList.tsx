'use client';
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import env from '@/lib/env';
import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import CouponForm from './CouponForm';
import { z } from 'zod';
import { createCouponSchema } from './Validtor';
import axios from 'axios';
import { toast } from 'sonner';
// import { createCouponSchema } from '@/validators/coupon.validator';

interface Props {
  query: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CouponList({ query }: Props) {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const type = searchParams.get('type');
  const active = searchParams.get('active');

  const url = new URLSearchParams({ page, limit: '10' });
  if (type) url.set('type', type);
  if (active) url.set('active', active);

  const { data, isLoading, mutate } = useSWR(
    env?.BACKEND_URL + `/api/coupons?${url.toString()}`,
    fetcher
  );
  const [editCoupon, setEditCoupon] = useState<z.infer<typeof createCouponSchema> | null>(null);

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (!data?.success) return <p className="text-red-500">Failed to load coupons.</p>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Min Purchase</TableHead>
            <TableHead>Usage Limit</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((coupon: any) => (
            <TableRow key={coupon._id}>
              <TableCell className="font-semibold">{coupon.code}</TableCell>
              <TableCell>{coupon.type}</TableCell>
              <TableCell>
                {coupon.type === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
              </TableCell>
              <TableCell>
                {coupon.minPurchaseAmount ? `₹${coupon.minPurchaseAmount}` : '-'}
              </TableCell>
              <TableCell>{coupon.usageLimit ?? '-'}</TableCell>
              <TableCell>{new Date(coupon.expiresAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={coupon.isActive ? 'default' : 'outline'}>
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <Dialog onOpenChange={open => !open && setEditCoupon(null)}>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="outline" onClick={() => setEditCoupon(coupon)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-1/3">
                    <CouponForm
                      // @ts-ignore
                      defaultValues={editCoupon}
                      onSuccess={() => {
                        mutate(); // re-fetch
                        setEditCoupon(null);
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger className="mx-2">
                    <Button variant="destructive" size="icon">
                      D
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and
                        remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose>
                        <Button variant="destructive">Nope</Button>
                      </DialogClose>

                      <Button
                        onClick={async () => {
                          try {
                            axios.delete(`${env?.BACKEND_URL}/api/coupons/${coupon._id}`);
                            toast.success('Coupon deleted');
                            mutate();
                          } catch (error) {
                            toast.error('Failed to delete coupon');
                          }
                        }}
                      >
                        Yep
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
