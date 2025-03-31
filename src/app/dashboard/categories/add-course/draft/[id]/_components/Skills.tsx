"use client";
import { useState } from "react";
import { MdDelete, MdEdit, MdAdd, MdCheck, MdClose } from "react-icons/md";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { TDraftCourseForm } from "../page";
import { motion, AnimatePresence } from "framer-motion";

const SkillsSelector = ({
  formWatch,
  formSetValue,
}: {
  formWatch: UseFormReturn<TDraftCourseForm>["watch"];
  formSetValue: UseFormReturn<TDraftCourseForm>["setValue"];
}) => {
  const [newSkill, setNewSkill] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

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

    // Show success toast
    toast.success("Skill added successfully");
  };

  // Handle removing a skill
  const handleRemoveSkill = (index: number) => {
    // Get current skills
    const currentSkills = formWatch("skills") || [];

    // Get the skill name for the toast
    const skillName = currentSkills[index];

    // Remove skill at the specified index
    const updatedSkills = currentSkills.filter((_, i) => i !== index);

    // Update the form
    formSetValue("skills", updatedSkills);

    // Show success toast
    toast.success(`"${skillName}" removed successfully`);
  };

  // Start editing a skill
  const handleStartEdit = (index: number) => {
    const currentSkills = formWatch("skills") || [];
    setEditingIndex(index);
    setEditValue(currentSkills[index]);
  };

  // Save edited skill
  const handleSaveEdit = () => {
    if (editingIndex === null) return;

    const trimmedValue = editValue.trim();
    if (!trimmedValue) {
      toast.error("Skill cannot be empty");
      return;
    }

    const currentSkills = formWatch("skills") || [];

    // Check if the edited skill would be a duplicate (excluding the current one being edited)
    const isDuplicate = currentSkills.some(
      (skill, idx) =>
        idx !== editingIndex &&
        skill.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("Skill already exists");
      return;
    }

    // Update the skill at the specific index
    const updatedSkills = [...currentSkills];
    updatedSkills[editingIndex] = trimmedValue;

    // Update the form
    formSetValue("skills", updatedSkills);

    // Reset editing state
    setEditingIndex(null);
    setEditValue("");

    // Show success toast
    toast.success("Skill updated successfully");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  // Handle key press (add skill on Enter)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Handle key press when editing (save on Enter, cancel on Escape)
  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const skills = formWatch("skills") || [];

  return (
    <div className="bg-slate-50 p-6 rounded-lg shadow-md border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <span className="bg-blue-100 text-blue-700 p-1 rounded-md mr-2">
          <MdAdd size={20} />
        </span>
        Skills
      </h2>

      {/* Skill input */}
      <div className="flex gap-x-2 mb-5">
        <Input
          placeholder="Add new skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-white"
        />
        <Button
          type="button"
          onClick={handleAddSkill}
          disabled={!newSkill.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Skill
        </Button>
      </div>

      {/* Display selected skills */}
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-3">
          <AnimatePresence>
            {skills.map((skill, index) => (
              <motion.div
                key={`${skill}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center ${
                  editingIndex === index
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white hover:bg-blue-50"
                } border px-3 py-1.5 rounded-full shadow-sm`}
              >
                {editingIndex === index ? (
                  <div className="flex items-center">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleEditKeyPress}
                      className="py-0 h-6 w-auto min-w-[100px] text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      autoFocus
                    />
                    <div className="flex ml-2">
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="text-green-600 hover:text-green-800 focus:outline-none"
                        title="Save"
                      >
                        <MdCheck size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="text-red-500 hover:text-red-700 ml-1 focus:outline-none"
                        title="Cancel"
                      >
                        <MdClose size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="mr-2 text-sm font-medium text-slate-700">
                      {skill}
                    </span>
                    <div className="flex">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(index)}
                        className="text-blue-500 hover:text-blue-700 focus:outline-none p-1"
                        title="Edit"
                      >
                        <MdEdit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="text-red-500 hover:text-red-700 focus:outline-none p-1"
                        title="Remove"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-4 bg-slate-100 rounded-md text-slate-500 italic">
          No skills added yet. Add skills to help students understand what
          they'll learn.
        </div>
      )}

      {skills.length > 0 && (
        <div className="mt-4 text-xs text-slate-500">
          {skills.length} skill{skills.length !== 1 ? "s" : ""} added
        </div>
      )}
    </div>
  );
};

export default SkillsSelector;
