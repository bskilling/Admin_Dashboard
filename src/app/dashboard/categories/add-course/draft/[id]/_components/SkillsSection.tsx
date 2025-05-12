'use client';

import { MdDelete } from 'react-icons/md';
// import { Combobox } from "@/components/ui/combobox";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { UseFormReturn } from 'react-hook-form';
import { TDraftCourseForm } from '../page';
import { Combobox } from '@/components/global/combox';

export default function SkillsSection({
  watch,
  setValue,
  skills,
  setSkill,
  isLoading,
  data,
}: {
  watch: UseFormReturn<TDraftCourseForm>['watch'];
  setValue: UseFormReturn<TDraftCourseForm>['setValue'];
  skills: string[];
  setSkill: React.Dispatch<React.SetStateAction<string[]>>;
  isLoading: boolean;
  data: any;
}) {
  return (
    <div className="bg-blue-100 p-5 rounded-md shadow-md">
      <h2 className="font-bold pb-5 text-lg">Skills</h2>
      {!isLoading && data && (
        <Combobox
          frameworks={data}
          nofound="No Skills found"
          placeholder="Add New Skill"
          key={'skills'}
          setAdd={skill => {
            const currentSkillIds = watch('skills') || [];
            const skillsSet = new Set(currentSkillIds);

            if (skillsSet.has(skill._id)) {
              toast.error('Skill already added');
              return;
            }

            skillsSet.add(skill._id);
            setValue('skills', Array.from(skillsSet));
            // @ts-expect-error error
            setSkill(prev => [...prev, skill]);
          }}
        />
      )}

      <div className="flex flex-col gap-y-5 mt-5">
        {skills?.map((skill, index) => (
          <div key={index} className="flex gap-x-4 items-center bg-white p-2 rounded-md shadow-sm">
            <p className="capitalize">{skill}</p>
            <button
              type="button"
              onClick={() => {
                const updatedSkills = watch('skills')?.filter((_, i) => i !== index);
                setValue('skills', updatedSkills);
                setSkill(prev => prev.filter(s => s !== skill));
              }}
            >
              <MdDelete size={20} className="text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
