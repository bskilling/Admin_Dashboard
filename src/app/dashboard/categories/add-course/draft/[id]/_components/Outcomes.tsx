'use client';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MdDelete } from 'react-icons/md';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { TDraftCourseForm } from '../page';

export default function OutcomesSection({
  watch,
  setValue,
}: {
  watch: UseFormReturn<TDraftCourseForm>['watch'];
  setValue: UseFormReturn<TDraftCourseForm>['setValue'];
}) {
  const [currentOutcome, setCurrentOutcome] = useState('');

  return (
    <div className="">
      <div className="bg-gradient-to-r from-green-50 to-green-100 text-gray-900 rounded-lg p-6 shadow-lg border border-green-300">
        <h2 className="font-bold text-2xl text-green-800 mb-4 flex items-center gap-2">
          🚀 Course Outcomes
        </h2>

        <div className="flex flex-col gap-4">
          {
            // @ts-ignore
            watch('outcomes')?.length > 0 ? (
              watch('outcomes')?.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border border-gray-300 p-4 rounded-lg shadow-md bg-white transition hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <IoCheckmarkCircle size={24} className="text-green-500" />
                    <p className="text-[15px] font-medium text-gray-800">{field}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedOutcomes =
                        watch('outcomes')?.filter((_, i) => i !== index) || [];
                      setValue('outcomes', updatedOutcomes);
                    }}
                    className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <MdDelete size={22} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-center">No outcomes added yet.</p>
            )
          }

          {/* Add New Outcome Input */}
          <div className="flex items-center gap-3 border border-gray-300 p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition">
            <Input
              value={currentOutcome}
              placeholder="Enter an outcome..."
              onChange={e => setCurrentOutcome(e.target.value)}
              className="flex-1 text-[14px] !border-none focus:ring-0"
            />
            <button
              type="button"
              onClick={() => {
                if (currentOutcome.trim().length < 5) {
                  return toast.error('Please enter a valid outcome');
                }
                const outcomes = watch('outcomes') || [];
                setValue('outcomes', [...outcomes, currentOutcome]);
                setCurrentOutcome('');
              }}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              ➕ <span className="hidden sm:inline">Add Outcome</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
