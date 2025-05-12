'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MdDelete } from 'react-icons/md';
import { TDraftCourseForm } from '../page';

export default function ProjectsCoveredSection({
  watch,
  setValue,
  register,
}: {
  watch: UseFormReturn<TDraftCourseForm>['watch'];
  setValue: UseFormReturn<TDraftCourseForm>['setValue'];
  register: UseFormReturn<TDraftCourseForm>['register'];
}) {
  return (
    <div className="w-full">
      <div className="rounded-xl mt-5 w-full bg-white shadow-md p-6">
        <h3 className="text-2xl font-semibold text-gray-800">Projects Covered</h3>

        <div className="mt-6 space-y-6">
          {watch('curriculum.projects')?.map((field, index) => (
            <div
              key={index}
              className="border-l-4 border-purple-500 pl-6 py-4 bg-gray-50 rounded-lg relative"
            >
              {/* Delete Project Button */}
              <button
                className="absolute top-3 right-3 text-red-500 hover:text-red-600 transition"
                onClick={() => {
                  const projects = watch('curriculum.projects') || [];
                  setValue(
                    'curriculum.projects',
                    projects.filter((_, i) => i !== index)
                  );
                }}
              >
                <MdDelete size={22} />
              </button>

              <div className="space-y-4">
                <Input
                  {...register(`curriculum.projects.${index}.title`)}
                  label={`Project ${index + 1}`}
                  placeholder="Enter Project Title"
                />

                <div className="space-y-4">
                  {field?.content.map((f, i) => (
                    <div key={i} className="flex items-center gap-x-3">
                      <Input
                        {...register(`curriculum.projects.${index}.content.${i}`)}
                        placeholder="Enter Project Content"
                      />
                      <MdDelete
                        size={22}
                        className="text-red-500 cursor-pointer hover:text-red-600 transition"
                        onClick={() => {
                          const currentContent =
                            watch(`curriculum.projects.${index}.content`) || [];
                          setValue(
                            `curriculum.projects.${index}.content`,
                            currentContent.filter((_, i1) => i1 !== i)
                          );
                        }}
                      />
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
                      onClick={() => {
                        const currentProjects = watch(`curriculum.projects.${index}.content`) || [];
                        setValue(`curriculum.projects.${index}.content`, [...currentProjects, '']);
                      }}
                    >
                      + Add Content
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              type="button"
              className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition"
              onClick={() => {
                const projects = watch('curriculum.projects') || [];
                setValue('curriculum.projects', [...projects, { title: '', content: [] }]);
              }}
            >
              + Add New Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
