"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import _ from "lodash";
import { Input } from "@/components/ui/input";
import { FaEdit } from "react-icons/fa";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import env from "@/lib/env";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CourseDetails from "./_components/CourseDetails";

export default function Migration() {
  const [categoriesData, setCategoriesData] = useState<
    Record<string, Course[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState(""); // New category input
  const [editingCategory, setEditingCategory] = useState(""); // Editing input
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [currentEditing, setCurrentEditing] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${env.BACKEND_URL}/api/v1/get-course-title`,
          { withCredentials: true }
        );

        const training: Course[] = response?.data?.courses || [];

        if (training.length) {
          const groupedData = _.groupBy(training, "category");
          setCategoriesData(groupedData);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Add a new category
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    setCategoriesData((prev) => ({
      ...prev,
      [newCategory]: [],
    }));
    setNewCategory("");
  };

  // Update category name before adding
  const handleEditCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingCategory(e.target.value);
  };

  // Select a category and show related courses
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const uploadCategory = useMutation({
    mutationKey: ["uploadCategory"],
    mutationFn: async (data: string) => {
      const res = await axios.post(env?.BACKEND_URL + "/api/categories", {
        name: data,
        type: "b2c",
      });
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Category created successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold">Courses by Category</h2>

      {/* Add New Category */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter new category"
          className="border p-2 rounded"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

      {/* Display Categories */}
      <div className="mt-5 grid grid-cols-3 gap-4">
        {Object.keys(categoriesData).map((category) => (
          <div
            key={category}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedCategory === category ? "bg-blue-200" : "bg-gray-100"
            }`}
            onClick={() => handleSelectCategory(category)}
          >
            {/* <h2 className="text-lg font-semibold">{category}</h2> */}
            <h3 className="font-semibold inline-flex gap-x-5 items-center">
              <span>{category}</span>
              <Dialog>
                <DialogTrigger onClick={() => setCurrentEditing(category)}>
                  <FaEdit className="ml-2" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    type="text"
                    name="name"
                    value={currentEditing ?? ""}
                    onChange={(e) => setCurrentEditing(e.target.value)}
                    placeholder="Edit category before adding"
                    className="border p-2 rounded w-full"
                  />
                  <DialogClose disabled={!currentEditing}>
                    <Button
                      onClick={() => {
                        if (currentEditing)
                          uploadCategory.mutate(currentEditing);
                      }}
                    >
                      <span>Confirm</span>
                    </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </h3>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="mt-5">
          <h3 className="text-lg font-semibold">
            Courses in {selectedCategory}:
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {categoriesData[selectedCategory]?.map((course) => (
              <>
                <CourseDetails courseId={course._id} />
                {/* <li key={course._id}>{course.title}</li> */}
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// types.ts
export interface Skill {
  _id: string;
  title: string;
}
export interface Objective {
  _id: string;
  title: string;
}
export interface Prereqisite {
  _id: string;
  title: string;
}
export interface Resource {
  _id: string;
  title: string;
}
export interface Benifit {
  _id: string;
  title: string;
}
export interface SectionPart {
  title: string;
  _id: string;
}
export interface FAQ {
  _id: string;
  question: string;
  answer: string;
}
// Define the type for each curriculum module
export interface CurriculumModule {
  title: string;
  videoSection: string;
  section_parts: SectionPart[];
  _id: string;
}

export interface TrainingMetadataTypes {
  preview_video?: string;
  overview?: string;
  skills_covered?: Skill[];
  objectives?: Objective[];
  prerequisites?: Prereqisite[];
  key_features?: Objective[];
  outcomes?: Objective[];
  resources?: Resource[];
  benefits?: Benifit[];
  curriculum?: CurriculumModule[];
  certification_text?: string;
  certification_image?: string;
  FAQs?: FAQ[];
}

export interface TrainingBatchTypes {
  description: string;
  batch_name: string;
  isPaid: boolean;
  trainer: string;
  start_time: string;
  enrollment_end_date: string;
  end_date: string;
  _id: string;
}

export interface Coursedetailstype {
  title: string;
  category: string;
  price: string;
  description?: string;
  ratings?: string;
  enrolledStudents?: string;
  reviews?: string;
  lastUpdated?: string;
  level?: string;
  duration?: number;
  language?: string;
  assessment_required?: boolean;
  training_metadata?: TrainingMetadataTypes;
  training_batches?: TrainingBatchTypes;
  tabContents?: { [key: number]: string };
}
export interface Course {
  _id: string;
  title: string;
  level: string;
  category: string;
  language: string;
  owned_by: string;
  endorsed_by: string;
  price: number;
  currency: string;
  coupon_code: string;
  discount: number;
  preview_image_uri: string;
  isPaid: boolean;
  training_mode: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  __v: number;
}
