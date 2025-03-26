"use client";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { TDraftCourseForm } from "../page";

const SkillsSelector = ({
  formWatch,
  formSetValue,
}: {
  formWatch: UseFormReturn<TDraftCourseForm>["watch"];
  formSetValue: UseFormReturn<TDraftCourseForm>["setValue"];
}) => {
  const [newSkill, setNewSkill] = useState("");

  // Handle adding a new skill
  const handleAddSkill = () => {
    // Trim whitespace and validate
    const skillToAdd = newSkill.trim();

    if (!skillToAdd) {
      return;
    }

    // Get current skills from the form
    const currentSkills = formWatch("skills") || [];

    // Check if the skill is already added (case-insensitive)
    if (
      currentSkills.some(
        (skill) => skill.toLowerCase() === skillToAdd.toLowerCase()
      )
    ) {
      toast.error("Skill already added");
      return;
    }

    // Update the form value with the new skill added
    formSetValue("skills", [...currentSkills, skillToAdd]);

    // Clear the input
    setNewSkill("");
  };

  // Handle removing a skill
  const handleRemoveSkill = (index: number) => {
    // Get current skills
    const currentSkills = formWatch("skills") || [];

    // Remove skill at the specified index
    const updatedSkills = currentSkills.filter((_, i) => i !== index);

    // Update the form
    formSetValue("skills", updatedSkills);
  };

  // Handle key press (add skill on Enter)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="bg-blue-100 p-5 rounded-md">
      <h2 className="font-bold pb-5">Skills</h2>

      {/* Skill input */}
      <div className="flex gap-x-2">
        <Input
          placeholder="Add new skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAddSkill}
          disabled={!newSkill.trim()}
        >
          Add
        </Button>
      </div>

      {/* Display selected skills */}
      <div className="flex flex-wrap gap-2 mt-5">
        {(formWatch("skills") || []).map((skill, index) => (
          <div
            key={index}
            className="flex items-center bg-white px-3 py-1 rounded-full"
          >
            <span className="mr-2">{skill}</span>
            <button
              type="button"
              onClick={() => handleRemoveSkill(index)}
              className="focus:outline-none"
            >
              <MdDelete size={16} className="text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSelector;
