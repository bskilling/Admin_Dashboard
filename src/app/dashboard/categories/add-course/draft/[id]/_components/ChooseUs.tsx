"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MdDelete } from "react-icons/md";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { TDraftCourseForm } from "../page";
import { toast } from "sonner";

interface WhyChooseProgramProps {
  watch: UseFormReturn<TDraftCourseForm>["watch"];
  setValue: UseFormReturn<TDraftCourseForm>["setValue"];
}

export default function WhyChooseProgram({
  watch,
  setValue,
}: WhyChooseProgramProps) {
  const whyJoinList = watch("whyJoin") || [];
  const [whyJoin, setWhyJoin] = useState("");

  return (
    <div className="bg-white shadow-2xl rounded-xl border border-gray-200 p-6 w-[80vw]  m-auto ">
      <h2 className="text-2xl font-bold text-gray-900">
        Why Choose this Program?
      </h2>

      {/* Why Join List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
        {whyJoinList.map((reason: string, index: number) => (
          <div
            key={index}
            className="flex flex-col bg-gray-100 border border-gray-300 p-4 min-h-32 rounded-xl shadow-md relative group"
          >
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                const updatedList = whyJoinList.filter((_, i) => i !== index);
                setValue("whyJoin", updatedList);
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MdDelete size={18} />
            </Button>
            <p className="text-gray-800 font-medium">{reason}</p>
          </div>
        ))}
      </div>

      {/* Add New Reason */}
      <div className="mt-6">
        <Textarea
          value={whyJoin}
          placeholder="Add a reason why someone should join"
          onChange={(e) => setWhyJoin(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
        />
        <Button
          type="button"
          variant="default"
          className="mt-4 w-full text-lg font-semibold py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
          onClick={() => {
            if (whyJoin.trim().length < 5)
              return toast.error("Please enter a valid reason.");
            setValue("whyJoin", [...whyJoinList, whyJoin]);
            setWhyJoin("");
          }}
        >
          Add Reason
        </Button>
      </div>
    </div>
  );
}
