'use client';

import { IoKeyOutline } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { TDraftCourseForm } from '../page';

export default function KeyFeaturesSection({
  watch,
  setValue,
  keyFeature,
  setKeyFeature,
}: {
  watch: UseFormReturn<TDraftCourseForm>['watch'];
  setValue: UseFormReturn<TDraftCourseForm>['setValue'];
  keyFeature: string;
  setKeyFeature: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="bg-green-100 p-5 rounded-md shadow-md mt-6">
      <h2 className="font-bold flex gap-x-2 items-center text-lg">
        <IoKeyOutline size={20} /> Key Features
      </h2>

      <div className="grid gap-5 mt-4">
        {watch('overview.keyFeatures')?.map((field, index) => (
          <div key={index} className="flex items-center bg-white p-2 rounded-md shadow-sm">
            <Input key={field} value={field} className="flex-1" />
            <MdDelete
              size={30}
              className="cursor-pointer text-red-500"
              onClick={() => {
                setValue(
                  'overview.keyFeatures',
                  watch('overview.keyFeatures')?.filter(item => item !== field)
                );
              }}
            />
          </div>
        ))}

        <div className="flex items-center gap-x-4">
          <Input
            value={keyFeature}
            onChange={e => setKeyFeature(e.target.value)}
            placeholder="Enter a key feature"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => {
              const keyFeatures = watch('overview.keyFeatures') || [];
              setValue('overview.keyFeatures', [...keyFeatures, keyFeature]);
              setKeyFeature('');
            }}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
