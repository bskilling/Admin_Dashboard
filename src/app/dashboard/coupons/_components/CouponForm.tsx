'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { createCouponSchema } from './Validtor';
import env from '@/lib/env';

export default function CouponForm({
  defaultValues,
  onSuccess,
}: {
  defaultValues?: Partial<z.infer<typeof createCouponSchema> & { _id: string }>;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof createCouponSchema>>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const onSubmit = async (values: z.infer<typeof createCouponSchema>) => {
    try {
      const res = await fetch(
        env.BACKEND_URL + '/api/coupons' + (defaultValues?._id ? `/${defaultValues._id}` : ''),
        {
          method: defaultValues ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      toast.success('Coupon created');
      onSuccess?.();
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create coupon');
    }
  };

  return (
    <form
      onSubmit={e => {
        const path = handleSubmit(onSubmit)(e);
      }}
      className="grid gap-4 w-full"
    >
      {/* Coupon Code */}
      <div className="grid gap-1">
        <Label htmlFor="code">Coupon Code</Label>
        <Input id="code" {...register('code')} placeholder="E.g. NEWYEAR50" />
        {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
      </div>

      {/* Type */}
      <div className="grid gap-1">
        <Label htmlFor="type">Type</Label>
        <Select
          defaultValue="percentage"
          onValueChange={val => setValue('type', val as 'percentage' | 'fixed')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
      </div>

      {/* Discount */}
      <div className="grid gap-1">
        <Label htmlFor="discount">Discount</Label>
        <Input id="discount" type="number" {...register('discount')} />
        {errors.discount && <p className="text-red-500 text-sm">{errors.discount.message}</p>}
      </div>
      <div className="grid gap-1">
        <Label htmlFor="usageLimit">Usage Limit</Label>
        <Input
          id="usageLimit"
          type="number"
          {...register('usageLimit')}
          placeholder="Enter usage limit"
        />
        {errors.minPurchaseAmount && (
          <p className="text-red-500 text-sm">{errors.usageLimit?.message}</p>
        )}
      </div>
      {/* Minimum Purchase */}
      <div className="grid gap-1">
        <Label htmlFor="minPurchaseAmount">Minimum Purchase Amount</Label>
        <Input
          id="minPurchaseAmount"
          type="number"
          {...register('minPurchaseAmount')}
          placeholder="Enter minimum purchase amount"
        />
        {errors.minPurchaseAmount && (
          <p className="text-red-500 text-sm">{errors.minPurchaseAmount.message}</p>
        )}
      </div>

      {/* Expiry */}
      <div className="grid gap-1">
        <Label htmlFor="expiresAt">Expires At</Label>
        <Input
          id="expiresAt"
          type="date"
          {...register('expiresAt')}
          placeholder="Enter expiry date"
        />
        {errors.expiresAt && <p className="text-red-500 text-sm">{errors.expiresAt.message}</p>}
      </div>

      {/* Is Active Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="isActive">Is Active</Label>
        <Switch
          id="isActive"
          checked={form.watch('isActive')}
          onCheckedChange={val => setValue('isActive', val)}
        />
      </div>

      <Button type="submit" className="w-full">
        Create Coupon
      </Button>
    </form>
  );
}
