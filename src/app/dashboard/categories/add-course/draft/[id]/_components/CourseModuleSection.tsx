"use client";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdDelete, MdEdit, MdCheck } from "react-icons/md";
import { FaBookOpen, FaPlay, FaPlus } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TDraftCourseForm } from "../page";

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
  const [editingChapterIndex, setEditingChapterIndex] = useState<number | null>(
    null
  );
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(
    null
  );
  const [editChapterTitle, setEditChapterTitle] = useState("");
  const [editLessonTitle, setEditLessonTitle] = useState("");
  const [editLessonContent, setEditLessonContent] = useState("");

  const chapters = watch("curriculum.chapters") || [];

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-10 border border-gray-200 backdrop-blur-lg">
      <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
        <FaBookOpen className="text-blue-500 text-3xl" /> Course Module
      </h3>

      <div className="mt-6 space-y-4">
        {chapters.map((chapter, cIndex) => (
          <div
            key={cIndex}
            className="border-l-4 border-green-500 pl-4 p-3 bg-gray-50 rounded-lg"
          >
            <Accordion type="single" collapsible>
              <AccordionItem value={`item-${cIndex}`}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <MdDelete
                      size={20}
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => {
                        setValue(
                          "curriculum.chapters",
                          chapters.filter((_, idx) => idx !== cIndex)
                        );
                      }}
                    />
                    {editingChapterIndex === cIndex ? (
                      <input
                        value={editChapterTitle}
                        onChange={(e) => setEditChapterTitle(e.target.value)}
                        className="border p-1 rounded-md"
                      />
                    ) : (
                      <h4 className="font-semibold">{chapter.title}</h4>
                    )}
                    {editingChapterIndex === cIndex ? (
                      <MdCheck
                        size={20}
                        className="text-green-600 cursor-pointer"
                        onClick={() => {
                          const updated = [...chapters];
                          updated[cIndex].title = editChapterTitle;
                          setValue("curriculum.chapters", updated);
                          setEditingChapterIndex(null);
                        }}
                      />
                    ) : (
                      <MdEdit
                        size={20}
                        className="text-blue-500 cursor-pointer"
                        onClick={() => {
                          setEditingChapterIndex(cIndex);
                          setEditChapterTitle(chapter.title);
                        }}
                      />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mt-2 space-y-3">
                    {chapter.lessons.map((lesson, lIndex) => (
                      <div
                        key={lIndex}
                        className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg"
                      >
                        <FaPlay className="text-blue-500 text-lg" />
                        {editingLessonIndex === lIndex &&
                        editingChapterIndex === cIndex ? (
                          <div className="flex flex-col w-full gap-1">
                            <input
                              value={editLessonTitle}
                              onChange={(e) =>
                                setEditLessonTitle(e.target.value)
                              }
                              className="border p-1 rounded-md"
                            />
                            <input
                              value={editLessonContent}
                              onChange={(e) =>
                                setEditLessonContent(e.target.value)
                              }
                              className="border p-1 rounded-md"
                            />
                          </div>
                        ) : (
                          <span className="font-medium">
                            {lesson.title}:{" "}
                            <span className="text-gray-600">
                              {lesson.content}
                            </span>
                          </span>
                        )}
                        {editingLessonIndex === lIndex &&
                        editingChapterIndex === cIndex ? (
                          <MdCheck
                            size={20}
                            className="text-green-600 cursor-pointer"
                            onClick={() => {
                              const updated = [...chapters];
                              updated[cIndex].lessons[lIndex] = {
                                title: editLessonTitle,
                                content: editLessonContent,
                              };
                              setValue("curriculum.chapters", updated);
                              setEditingLessonIndex(null);
                              setEditingChapterIndex(null);
                            }}
                          />
                        ) : (
                          <MdEdit
                            size={18}
                            className="text-blue-500 cursor-pointer"
                            onClick={() => {
                              setEditingLessonIndex(lIndex);
                              setEditingChapterIndex(cIndex);
                              // @ts-expect-error
                              setEditLessonTitle(lesson?.title);
                              // @ts-expect-error
                              setEditLessonContent(lesson?.content);
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>

      <hr className="my-6 border-t-2 border-blue-400" />

      <div className="mt-6 border-l-4 border-blue-500 pl-4 p-4 bg-gray-50 rounded-lg">
        <Input
          label="New Module"
          placeholder="Enter Module title"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          className="p-3 rounded-lg border-gray-300"
        />

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

      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg"
          onClick={() => {
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
