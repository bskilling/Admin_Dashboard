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
    mutationFn: async (data: any) => {
      const res = await axios.post(
        env.BACKEND_URL + "/api/courses/draft",
        data
      );
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success("Draft course created successfully");
      navigate.push(`/categories/add-course/draft/${data.data._id}`);
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

  return (
    <div className="">
      <Card className="mt-5">
        <CardHeader>
          <div className="flex items-center space-x-2 w-full  justify-end">
            <Switch
              id="airplane-mode"
              checked={isPublished}
              onCheckedChange={(checked) => setIsPublished(checked)}
            />
            <Label htmlFor="airplane-mode">Published</Label>
          </div>

          <CardTitle className="text-2xl text-center capitalize">
            {category?.name} Courses
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 gap-8 mt-10">
            {data?.courses.map((category) => (
              <Card key={category._id} className="relative min-h-96">
                <Link
                  key={category._id}
                  href={`/dashboard/categories/add-course/draft/${category?._id}`}
                >
                  <CardHeader className="space-y-1 p-0">
                    <Button
                      className={cn(
                        "absolute top-0 left-0 bg-purple-900",
                        !category?.isPublished && "bg-orange-500"
                      )}
                    >
                      {category?.isPublished ? "Published" : "Draft"}
                    </Button>

                    {category?.previewImage?.viewUrl ? (
                      <Image
                        src={category?.previewImage?.viewUrl}
                        alt={"Preview image"}
                        width={100}
                        height={100}
                        className="w-full h-52 object-cover"
                      />
                    ) : (
                      <Image
                        src={"/images/placeholder.png"}
                        alt=""
                        width={100}
                        height={100}
                        className=" h-40 w-40 m-auto object-cover p-3"
                      />
                    )}
                    <CardTitle className="px-3 py-2">
                      {category?.title || "No Name"}
                    </CardTitle>
                    <CardDescription className="px-3">
                      <p>{category?.description || "No Description"}</p>
                    </CardDescription>
                  </CardHeader>
                </Link>

                <CardContent></CardContent>
                <CardFooter className="w-full flex justify-between gap-x-4">
                  <Link
                    key={category._id}
                    href={`/dashboard/categories/add-course/draft/${category?._id}`}
                  >
                    <Button variant={"secondary"} className="w-full">
                      Edit
                    </Button>
                  </Link>
                  {/* <Button className="w-full">Delete</Button> */}
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        onClick={() => {
                          try {
                            console.log(category);
                            const newCat = {
                              ...category,
                              banner: category?.banner?._id,
                              previewImage: category?.previewImage?._id,
                              logoUrl: category?.logoUrl?._id,
                            };
                            const data =
                              publishedCourseSchema.safeParse(newCat);
                            console.log("data====", data);

                            if (data.success) {
                              setErrors(null);
                            } else {
                              // Extract & format errors
                              const formattedErrors = Object.entries(
                                data.error.format()
                              )
                                .map(([key, value]) => {
                                  if (key !== "_errors") {
                                    return `${key}: ${(
                                      value as any
                                    )._errors.join(", ")}`;
                                  }
                                })
                                .filter(Boolean); // Remove undefined values

                              console.log("Formatted Errors:", formattedErrors);
                              setErrors(formattedErrors);
                            }
                          } catch (error) {
                            console.log("erro====", error);
                            setErrors([
                              "Unexpected error occurred. Please try again.",
                            ]);
                          }
                        }}
                      >
                        Publish
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="w-[80vw]">
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This will publish the course
                        </DialogDescription>
                      </DialogHeader>

                      {/* Error Display Section */}
                      {allErrors && allErrors.length > 0 && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                          <h3 className="font-semibold">
                            Please fix the following errors:
                          </h3>
                          <ul className="list-disc list-inside mt-2">
                            {
                              // @ts-ignore
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
                          console.log(newCat);
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
            {
              <Dialog>
                <DialogTrigger className="min-h-96 hover:bg-gradient-to-br hover:text-white hover:bg-blue-700 to-black rounded-md">
                  {" "}
                  <div className="h-full  border-dotted border-2 rounded-md flex flex-col items-center justify-center cursor-pointer">
                    <p className="text-center text-xl font-bold hover:text-white">
                      Create New Course
                    </p>
                    <FaPlusSquare
                      size={30}
                      className="hover:text-white text-center mt-3"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      Do you want create a new course for this category{" "}
                      <span className="capitalize text-base pl-2 font-bold text-purple-600 underline">
                        {category?.name}
                      </span>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-x-5">
                    <DialogClose>
                      <Button variant={"outline"}>
                        <p>Cancel</p>
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={() => {
                        createDraftMutation.mutate({
                          category: category,
                        });
                      }}
                    >
                      <p>Create Course</p>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            }
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
