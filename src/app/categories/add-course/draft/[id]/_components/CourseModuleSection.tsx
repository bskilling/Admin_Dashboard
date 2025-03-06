"use client";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
import { PlayIcon } from "@heroicons/react/24/outline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TDraftCourseForm } from "../page";
import { FaBookOpen, FaPlay, FaPlus } from "react-icons/fa";

export default function CourseModuleSection({
  watch,
  setValue,
}: {
  watch: UseFormReturn<TDraftCourseForm>["watch"];
  setValue: UseFormReturn<TDraftCourseForm>["setValue"];
}) {
  const [chapter, setChapter] = useState("");
  const [lesson, setLesson] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessons, setLessons] = useState<{ title: string; content: string }[]>(
    []
  );

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-10 border border-gray-200 backdrop-blur-lg">
      {/* Section Heading */}
      <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
        <FaBookOpen className="text-blue-500 text-3xl" /> Course Module
      </h3>

      {/* Chapters List */}
      <div className="mt-6 space-y-4">
        {watch("curriculum.chapters")?.map((chapter) => (
          <div
            key={chapter.title}
            className="border-l-4 border-green-500 pl-4 p-3 bg-gray-50 rounded-lg"
          >
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <h4 className="font-semibold flex items-center gap-4">
                    <MdDelete
                      size={20}
                      className="text-red-500 cursor-pointer hover:text-red-700 transition"
                      onClick={() => {
                        const chapters = watch("curriculum.chapters") || [];
                        setValue(
                          "curriculum.chapters",
                          chapters.filter(
                            (item) => item.title !== chapter?.title
                          )
                        );
                      }}
                    />
                    {chapter.title}
                  </h4>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mt-2 space-y-3">
                    {chapter.lessons?.map((lesson) => (
                      <div
                        key={lesson.title}
                        className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg"
                      >
                        <FaPlay className="text-blue-500 text-lg" />
                        <span className="font-medium">
                          {lesson.title}:{" "}
                          <span className="text-gray-600">
                            {lesson.content}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>

      {/* Divider */}
      <hr className="my-6 border-t-2 border-blue-400" />

      {/* Add New Chapter */}
      <div className="mt-6 border-l-4 border-blue-500 pl-4 p-4 bg-gray-50 rounded-lg">
        <Input
          label="New Module"
          placeholder="Enter Module title"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          className="p-3 rounded-lg border-gray-300"
        />

        {/* Lessons Section */}
        <div className="mt-6">
          {lessons?.map((lesson, lessonIndex) => (
            <div
              key={lesson?.title}
              className="flex items-center gap-x-3 bg-white p-3 rounded-lg shadow-sm"
            >
              <span className="text-gray-600 font-bold">
                L{lessonIndex + 1}.
              </span>
              <div>
                <p className="font-semibold">{lesson?.title}</p>
                <p className="text-gray-500">{lesson?.content}</p>
              </div>
            </div>
          ))}

          {/* Add Lesson Inputs */}
          <div className="mt-6 flex gap-x-4">
            <Input
              label="Lesson Title"
              placeholder="Enter lesson title"
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              className="p-3 rounded-lg border-gray-300"
            />
            <Input
              label="Lesson Content"
              placeholder="Enter content"
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
              className="p-3 rounded-lg border-gray-300"
            />
          </div>

          {/* Add Lesson Button */}
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={() => {
                setLessons([
                  ...lessons,
                  { title: lesson, content: lessonContent },
                ]);
                setLesson("");
                setLessonContent("");
              }}
            >
              <FaPlus /> Add Lesson
            </Button>
          </div>
        </div>
      </div>

      {/* Confirm Module Button */}
      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg"
          onClick={() => {
            const chapters = watch("curriculum.chapters") || [];
            setValue("curriculum.chapters", [
              ...chapters,
              { title: chapter, lessons: [...lessons] },
            ]);
            setLessons([]);
            setChapter("");
          }}
        >
          Confirm Module
        </Button>
      </div>
    </div>
  );
}
