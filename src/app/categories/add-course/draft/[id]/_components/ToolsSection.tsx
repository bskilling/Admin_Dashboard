"use client";

import { MdDelete } from "react-icons/md";
// import { Combobox } from "@/components/ui/combobox";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { TDraftCourseForm } from "../page";
import { Combobox } from "@/components/global/combox";

export default function ToolsSection({
  watch,
  setValue,
  tools,
  setTool,
  isLoading,
  data,
}: {
  watch: UseFormReturn<TDraftCourseForm>["watch"];
  setValue: UseFormReturn<TDraftCourseForm>["setValue"];
  tools: any[];
  setTool: React.Dispatch<React.SetStateAction<any[]>>;
  isLoading: boolean;
  data: any;
}) {
  return (
    <div className="bg-purple-100 p-5 rounded-md shadow-md mt-6">
      <h2 className="font-bold pb-5 text-lg">Tools</h2>
      {!isLoading && data && (
        <Combobox
          frameworks={data}
          nofound="No Tools found"
          placeholder="Add New Tool"
          key={"tools"}
          setAdd={(tool) => {
            const currentToolIds = watch("tools") || [];
            const toolsSet = new Set(currentToolIds);

            if (toolsSet.has(tool._id)) {
              toast.error("Tool already added");
              return;
            }

            toolsSet.add(tool._id);
            setValue("tools", Array.from(toolsSet));
            setTool((prev) => [...prev, tool]);
          }}
        />
      )}

      <div className="flex flex-col gap-y-5 mt-5">
        {tools?.map((tool, index) => (
          <div
            key={tool._id}
            className="flex gap-x-4 items-center bg-white p-2 rounded-md shadow-sm"
          >
            <Image
              width={40}
              height={40}
              src={tool.logo.viewUrl}
              alt={tool.title}
              className="w-10 h-10 object-cover rounded-md"
            />
            <p className="capitalize">{tool?.title}</p>
            <button
              type="button"
              onClick={() => {
                const updatedTools = watch("tools")?.filter(
                  (_, i) => i !== index
                );
                setValue("tools", updatedTools);
                setTool((prev) => prev.filter((t) => t._id !== tool._id));
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
