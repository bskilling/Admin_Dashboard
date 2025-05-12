'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { BookOpenIcon, ClockIcon, CreditCardIcon, ShieldCheckIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { TDraftCourseForm } from '../page';

interface CoursePricingProps {
  form: UseFormReturn<any>; // Pass the entire useForm return object as a prop
  durationHours: number;
}

export default function CoursePricing({
  watch,
  setValue,
  register,
  formState,
}: {
  watch: UseFormReturn<TDraftCourseForm>['watch'];
  setValue: UseFormReturn<TDraftCourseForm>['setValue'];
  register: UseFormReturn<TDraftCourseForm>['register'];
  formState: UseFormReturn<TDraftCourseForm>['formState'];
}) {
  //   const { watch, setValue, register, formState } = form;

  return (
    <div className="p-6">
      {/* Main Card */}
      <div className="max-w-lg w-full mx-auto bg-white shadow-xl rounded-2xl p-6 flex flex-col gap-6">
        {/* Paid Course Toggle */}
        <div className="flex items-center gap-3">
          <Switch
            id="isPaid"
            checked={watch('isPaid')}
            onCheckedChange={checked => setValue('isPaid', checked)}
          />
          <Label htmlFor="isPaid" className="font-medium text-gray-800">
            Paid Course
          </Label>
        </div>
        {formState.errors.isPaid && (
          <p className="text-sm text-red-500">{formState.errors.isPaid.message}</p>
        )}

        {/* Price Input */}
        {watch('isPaid') && (
          <div className="relative">
            <Input
              {...register('price.amount')}
              placeholder="Enter Price"
              type="number"
              className="pr-10"
            />
            <CurrencyDollarIcon className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
            {formState.errors.price?.amount && (
              <p className="text-sm text-red-500">{formState.errors.price.amount.message}</p>
            )}
          </div>
        )}

        {/* Course Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard icon={<ClockIcon />} text={`${watch('durationHours')} Hours`} />
          <FeatureCard icon={<BookOpenIcon />} text="Comprehensive Learning" />
          <FeatureCard icon={<CurrencyDollarIcon />} text="Flexible Payment Options" />
          <FeatureCard icon={<ShieldCheckIcon />} text="Secure Payment" />
        </div>

        {/* Enroll Button */}
        <Button className="bg-[#F4A261] text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:bg-[#E98E49] transition-transform transform hover:scale-105 flex items-center">
          <CreditCardIcon className="h-5 w-5 mr-2" />
          Enroll Now
        </Button>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow">
      {icon}
      <span className="font-medium text-gray-700">{text}</span>
    </div>
  );
}
