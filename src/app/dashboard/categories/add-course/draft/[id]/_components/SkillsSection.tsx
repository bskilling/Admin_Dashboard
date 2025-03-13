"use client";

import { MdDelete } from "react-icons/md";
// import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { TDraftCourseForm } from "../page";
import { Combobox } from "@/components/global/combox";

export default function SkillsSection({
  watch,
  setValue,
  skills,
  setSkill,
  isLoading,
  data,
}: {
  watch: UseFormReturn<TDraftCourseForm>["watch"];
  setValue: UseFormReturn<TDraftCourseForm>["setValue"];
  skills: any[];
  setSkill: React.Dispatch<React.SetStateAction<any[]>>;
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
          key={"skills"}
          setAdd={(skill) => {
            const currentSkillIds = watch("skills") || [];
            const skillsSet = new Set(currentSkillIds);

            if (skillsSet.has(skill._id)) {
              toast.error("Skill already added");
              return;
            }

            skillsSet.add(skill._id);
            setValue("skills", Array.from(skillsSet));
            setSkill((prev) => [...prev, skill]);
          }}
        />
      )}

      <div className="flex flex-col gap-y-5 mt-5">
        {skills?.map((skill, index) => (
          <div
            key={index}
            className="flex gap-x-4 items-center bg-white p-2 rounded-md shadow-sm"
          >
            <Image
              width={40}
              height={40}
              src={skill.logo.viewUrl}
              alt={skill.title}
              className="w-10 h-10 object-cover rounded-md"
            />
            <p className="capitalize">{skill?.title}</p>
            <button
              type="button"
              onClick={() => {
                const updatedSkills = watch("skills")?.filter(
                  (_, i) => i !== index
                );
                setValue("skills", updatedSkills);
                setSkill((prev) => prev.filter((s) => s._id !== skill._id));
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
