"use client";

import env from "@/lib/env";
import { useMutation, useQuery } from "@tanstack/react-query";
// import { Link, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { FaPlusSquare } from "react-icons/fa";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IAllCourses, publishedCourseSchema } from "./types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ICourse } from "../add-course/draft/_components/types";
import { ICategories } from "./CreateCategory";

// interface ICourses {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   courses: any[];
//   pagination: Pagination;
// }
// interface Pagination {
//   totalItems: number;
//   totalPages: number;
//   currentPage: number;
//   itemsPerPage: number;
// }

export default function CreateCourse({
  category,
}: {
  category: ICategories["categories"][number];
}) {
  const navigate = useRouter();
  const [isPublished, setIsPublished] = useState<boolean | undefined>(false);
  const { data } = useQuery<{ courses: ICourse[] }>({
    queryKey: ["courses", category?._id, isPublished],
    queryFn: async () => {
      const res = await axios.get(env?.BACKEND_URL + "/api/courses", {
        params: {
          limit: 100,
          page: 1,
          category: category?._id ?? undefined,
          isPublished: isPublished,
        },
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
  const [allErrors, setErrors] = useState<any>();

  const createDraftMutation = useMutation({
    mutationFn: async (data: { category: string; type: string }) => {
      console.log(data);
      const res = await axios.post(
        env.BACKEND_URL + "/api/courses/draft",
        data
      );
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success("Draft course created successfully");
      navigate.push(`/dashboard/categories/add-course/draft/${data.data._id}`);
      // Handle additional success logic
      // ({
      //   to: "/categories/add-course/draft/$id",
      //   params: {
      //     id: data.data._id,
      //   },
      // });
    },
    onError: (error) => {
      toast.error("Failed to create draft: " + error.message);
    },
  });

  const publishCourse = useMutation({
    mutationFn: async (data: ICourse) => {
      const res = await axios.post(
        env.BACKEND_URL + "/api/courses" + `/${data?._id}` + "/publish",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Published course created successfully");
      // Handle additional success logic
    },
    onError: (error) => {
      toast.error("Failed to create draft: " + error.message);
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (data: ICourse) => {
      const res = await axios.delete(
        env.BACKEND_URL + "/api/courses" + `/${data?._id}`
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Course Deleted successfully");
      // Handle additional success logic
    },
    onError: (error) => {
      toast.error("Failed to delete draft: " + error.message);
    },
  });

  return (
    <div className="w-full mx-auto px-6 py-5">
      <Card className="mt-6 border border-gray-300 shadow-lg rounded-xl bg-white dark:bg-gray-900">
        <CardHeader>
          {/* Top Switch Toggle */}
          <div className="flex items-center justify-end gap-3">
            <Label
              htmlFor="airplane-mode"
              className="text-gray-700 dark:text-gray-300"
            >
              Published
            </Label>
            <Switch
              id="airplane-mode"
              checked={isPublished}
              onCheckedChange={(checked) => setIsPublished(checked)}
            />
          </div>

          {/* Main Title */}
          <CardTitle className="text-3xl font-bold text-center capitalize text-gray-900 dark:text-white mt-4">
            {category?.name} Courses
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 gap-8 mt-8">
            {data?.courses.map((category) => (
              <Card
                key={category._id}
                className="relative min-h-96 border border-gray-200 rounded-lg shadow-md transition-all hover:shadow-xl hover:scale-[1.02] dark:border-gray-700 dark:bg-gray-800"
              >
                <Link
                  href={`/dashboard/categories/add-course/draft/${category?._id}`}
                >
                  <CardHeader className="p-0 relative">
                    {/* Status Button */}
                    <Button
                      className={cn(
                        "absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-lg shadow-sm",
                        category?.isPublished
                          ? "bg-green-600 text-white"
                          : "bg-orange-500 text-white"
                      )}
                    >
                      {category?.isPublished ? "Published" : "Draft"}
                    </Button>

                    {/* Course Image */}
                    {category?.previewImage?.viewUrl ? (
                      <img
                        src={category?.previewImage?.viewUrl}
                        alt="Preview image"
                        className="w-full h-56 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-56 bg-gray-200 dark:bg-gray-700 rounded-t-lg">
                        <img
                          src="/images/placeholder.png"
                          alt="Placeholder"
                          className="h-24 w-24 object-cover"
                        />
                      </div>
                    )}

                    {/* Course Title & Description */}
                    <CardTitle className="px-4 py-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {category?.title || "No Name"}
                    </CardTitle>
                    <CardDescription className="px-4 text-gray-600 dark:text-gray-400 text-sm">
                      {category?.description || "No Description"}
                    </CardDescription>
                  </CardHeader>
                </Link>

                {/* Card Footer Buttons */}
                <CardFooter className="w-full flex justify-between gap-4 p-4">
                  <Link
                    href={`/dashboard/categories/add-course/draft/${category?._id}`}
                  >
                    <Button variant="secondary" className="w-full">
                      Edit
                    </Button>
                  </Link>

                  {/* Delete Dialog */}
                  <Dialog>
                    <DialogTrigger>
                      <Button className="w-full" variant="destructive">
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. It will permanently
                          delete the course.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose>
                          <Button
                            className="w-full"
                            onClick={() => deleteCourse.mutate(category)}
                            variant="destructive"
                          >
                            Delete
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Publish Dialog */}
                  <Dialog>
                    <DialogTrigger>
                      <Button>Publish</Button>
                    </DialogTrigger>
                    <DialogContent className="w-[80vw]">
                      <DialogHeader>
                        <DialogTitle>Confirm Publishing</DialogTitle>
                        <DialogDescription>
                          This will publish the course.
                        </DialogDescription>
                      </DialogHeader>

                      {/* Error Display */}
                      {allErrors && allErrors.length > 0 && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                          <h3 className="font-semibold">Fix these errors:</h3>
                          <ul className="list-disc list-inside mt-2">
                            {
                              //@ts-ignore
                              allErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))
                            }
                          </ul>
                        </div>
                      )}

                      <Button
                        className="w-full mt-4"
                        onClick={() => {
                          const newCat = {
                            ...category,
                            banner: category?.banner?._id,
                            previewImage: category?.previewImage?._id,
                            logoUrl: category?.logoUrl?._id,
                          };
                          // @ts-ignore
                          publishCourse.mutate(newCat);
                        }}
                      >
                        Publish
                      </Button>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}

            {/* Add New Course Button */}
            <Dialog>
              <DialogTrigger className="min-h-96 hover:bg-gradient-to-br hover:text-white from-blue-700 to-black rounded-lg transition-all">
                <div className="h-full border-dashed border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer p-6 hover:bg-blue-700 hover:text-white">
                  <p className="text-center text-lg font-bold">
                    Create New Course
                  </p>
                  <FaPlusSquare size={30} className="text-center mt-3" />
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to create a new course for
                    <span className="capitalize text-base pl-2 font-bold text-purple-600 underline">
                      {category?.name}
                    </span>
                    ?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-5">
                  <DialogClose>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() =>
                      createDraftMutation.mutate({
                        category: category._id,
                        type: category.type,
                      })
                    }
                  >
                    Create Course
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// export default function CreateDraftCourse() {

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">Create Draft Course</Button>
//       </DialogTrigger>
//       <DialogContent className="max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Create New Course Draft</DialogTitle>
//         </DialogHeader>

//       </DialogContent>
//     </Dialog>
//   );
// }
