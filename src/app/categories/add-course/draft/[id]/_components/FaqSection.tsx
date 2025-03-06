"use client";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { TDraftCourseForm } from "../page";

type TFaq = {
  question: string;
  answer: string;
};

export default function FaqSection({
  watch,
  register,
  setValue,
}: {
  watch: UseFormReturn<TDraftCourseForm>["watch"];
  register: UseFormReturn<TDraftCourseForm>["register"];
  setValue: UseFormReturn<TDraftCourseForm>["setValue"];
}) {
  const [faq, setFaq] = useState<TFaq>({ question: "", answer: "" });

  return (
    <section className="relative w-[80vw] mx-auto bg-white/80 shadow-lg rounded-xl p-6 flex flex-col gap-6 border border-gray-200 backdrop-blur-md">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
        💡 FAQ Section
      </h2>

      {/* FAQ List */}
      <div className="space-y-4">
        {watch("faqs")?.map((field, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg flex items-center justify-between"
          >
            <Accordion type="single" collapsible>
              <AccordionItem value={`faq-${index}`} className="w-full">
                <AccordionTrigger className="text-md font-medium px-2 py-1 rounded-md hover:bg-gray-100 transition">
                  <div className="flex justify-between items-center w-full">
                    <p className="flex items-center gap-3">
                      <span className="text-gray-700 font-medium">
                        {index + 1}.
                      </span>{" "}
                      {field.question}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-4 mt-1 text-gray-600 text-sm">
                  {field.answer}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <MdDelete
              size={18}
              className="text-red-500 hover:text-red-600 cursor-pointer transition hover:scale-110"
              onClick={() => {
                const faqs = watch("faqs") || [];
                setValue(
                  "faqs",
                  faqs.filter((_, i) => i !== index)
                );
              }}
            />
          </div>
        ))}
      </div>

      {/* Add New FAQ */}
      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow border border-gray-200">
        <input
          placeholder="Question"
          value={faq.question}
          onChange={(e) => setFaq({ ...faq, question: e.target.value })}
          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm placeholder-gray-400 focus:ring-1 focus:ring-gray-300"
        />
        <input
          placeholder="Answer"
          value={faq.answer}
          onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm placeholder-gray-400 focus:ring-1 focus:ring-gray-300"
        />
        <button
          onClick={() => {
            const faqs = watch("faqs") || [];
            if (!faq.question.length || !faq.answer.length) {
              return toast.error("Fill all fields");
            }
            setValue("faqs", [...faqs, faq]);
            setFaq({ question: "", answer: "" });
          }}
          className="bg-[#00C6FF] text-white px-4 py-2 rounded-lg text-sm font-medium transition hover:scale-105"
        >
          ➕
        </button>
      </div>
    </section>
  );
}
