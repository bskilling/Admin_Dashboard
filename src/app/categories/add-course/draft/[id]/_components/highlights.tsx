"use client";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { TDraftCourseForm } from "../page";

export default function HighlightsSection({
  watch,
  setValue,
}: {
  watch: UseFormReturn<TDraftCourseForm>["watch"];
  setValue: UseFormReturn<TDraftCourseForm>["setValue"];
}) {
  const [currentHighlight, setCurrentHighlight] = useState("");

  return (
    <div className="">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-900 rounded-lg p-6 shadow-lg border border-blue-300">
        <h2 className="font-bold text-2xl text-blue-800 mb-4 flex items-center gap-2">
          🔥 Key Highlights
        </h2>

        <div className="flex flex-col gap-4">
          {
            // @ts-ignore
            watch("highlights") && watch("highlights")?.length > 0 ? (
              watch("highlights")?.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border border-gray-300 p-4 rounded-lg shadow-md bg-white transition hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <IoCheckmarkCircle size={24} className="text-green-500" />
                    <p className="text-[15px] font-medium text-gray-800">
                      {field}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedHighlights =
                        watch("highlights")?.filter((_, i) => i !== index) ||
                        [];
                      setValue("highlights", updatedHighlights);
                    }}
                    className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <MdDelete size={22} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-center">
                No highlights added yet.
              </p>
            )
          }

          {/* Add New Highlight Input */}
          <div className="flex items-center gap-3 border border-gray-300 p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition">
            <Input
              value={currentHighlight}
              placeholder="Enter a highlight..."
              onChange={(e) => setCurrentHighlight(e.target.value)}
              className="flex-1 text-[14px] !border-none focus:ring-0"
            />
            <button
              type="button"
              onClick={() => {
                if (currentHighlight.trim().length < 5) {
                  return toast.error("Please enter a valid highlight");
                }
                const highlights = watch("highlights") || [];
                setValue("highlights", [...highlights, currentHighlight]);
                setCurrentHighlight("");
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition"
            >
              ➕ Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
