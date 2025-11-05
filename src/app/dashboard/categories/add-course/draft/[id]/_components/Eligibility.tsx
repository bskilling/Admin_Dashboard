'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MdDelete } from 'react-icons/md';
import { TDraftCourseForm } from '../page';

export default function EligibilitySection({
  watch,
  setValue,
  register,
}: {
  watch: UseFormReturn<TDraftCourseForm>['watch'];
  setValue: UseFormReturn<TDraftCourseForm>['setValue'];
  register: UseFormReturn<TDraftCourseForm>['register'];
}) {
  return (
    <div className="flex flex-col items-center gap-y-6 mt-6 bg-gradient-to-r from-purple-100 to-purple-50 p-6 rounded-lg shadow-lg w-full border border-purple-300">
      <h3 className="text-2xl font-bold text-purple-700 tracking-wide">Eligibility Criteria</h3>

      {watch('curriculum.eligibility')?.length > 0 ? (
        <div className="w-full space-y-4">
          {watch('curriculum.eligibility')?.map((field, index) => (
            <div
              key={index}
              className="flex items-center gap-x-3 w-full bg-white p-4 rounded-lg shadow-md border border-gray-200 transition hover:shadow-lg"
            >
              <Input
                {...register(`curriculum.eligibility.${index}`)}
                placeholder="Enter Eligibility Criteria"
                className="bg-gray-100 flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <button
                type="button"
                onClick={() => {
                  const currentEligibility = watch('curriculum.eligibility') || [];
                  setValue(
                    'curriculum.eligibility',
                    currentEligibility.filter((_, i) => i !== index)
                  );
                }}
                className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <MdDelete size={22} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No eligibility criteria added yet.</p>
      )}

      <div className="w-full flex justify-end">
        <Button
          className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-5 py-2 rounded-md hover:scale-105 transition-transform shadow-md hover:shadow-lg"
          onClick={() => {
            setValue('curriculum.eligibility', [...(watch('curriculum.eligibility') || []), '']);
          }}
          type="button"
        >
          ➕ Add Eligibility
        </Button>
      </div>
    </div>
  );
}
