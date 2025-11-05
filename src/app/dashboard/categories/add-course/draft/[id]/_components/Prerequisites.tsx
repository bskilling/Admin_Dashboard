'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MdDelete } from 'react-icons/md';
import { TDraftCourseForm } from '../page';

export default function PrerequisitesSection({
  watch,
  setValue,
  register,
}: {
  watch: UseFormReturn<TDraftCourseForm>['watch'];
  setValue: UseFormReturn<TDraftCourseForm>['setValue'];
  register: UseFormReturn<TDraftCourseForm>['register'];
}) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg w-full border border-blue-300">
      <h2 className="text-2xl font-bold text-blue-700 tracking-wide">Prerequisites</h2>

      {watch('curriculum.prerequisites')?.length > 0 ? (
        <div className="w-full space-y-4 mt-4">
          {watch('curriculum.prerequisites')?.map((field, index) => (
            <div
              key={index}
              className="flex items-center gap-x-3 w-full bg-white p-4 rounded-lg shadow-md border border-gray-200 transition hover:shadow-lg"
            >
              <Input
                {...register(`curriculum.prerequisites.${index}`)}
                placeholder="Enter Prerequisite"
                className="bg-gray-100 flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                type="button"
                onClick={() => {
                  const currentPrerequisites = watch('curriculum.prerequisites') || [];
                  setValue(
                    'curriculum.prerequisites',
                    currentPrerequisites.filter((_, i) => i !== index)
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
        <p className="text-gray-500 italic mt-4">No prerequisites added yet.</p>
      )}

      <div className="w-full flex justify-end mt-4">
        <Button
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-md hover:scale-105 transition-transform shadow-md hover:shadow-lg"
          onClick={() => {
            setValue('curriculum.prerequisites', [
              ...(watch('curriculum.prerequisites') || []),
              '',
            ]);
          }}
          type="button"
        >
          ➕ Add Prerequisite
        </Button>
      </div>
    </div>
  );
}
