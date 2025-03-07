"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
// import env from "@/lib/env";
import { useEffect, useState } from "react";
import CreateCourse from "./CreateCourse";
import { cn } from "@/lib/utils";
import { MdDelete } from "react-icons/md";
import env from "@/lib/env";
import FileUploader from "@/components/global/FileUploader";
import Image from "next/image";
import { set } from "date-fns";

const createCategoryValidator = z.object({
  name: z
    .string()
    .min(3, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  logo: z.string().length(24, "Logo is required"),
  type: z.enum(["b2b", "b2c", "b2g", "b2i"]),
});

type TCreateCategoryForm = z.infer<typeof createCategoryValidator>;

export interface ICategories {
  categories: Category[];
  pagination: Pagination;
}
interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}
interface Category {
  _id: string;
  name: string;
  slug: string;
  logo: logo;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface logo {
  _id: string;
  viewUrl: string;
}

export default function CreateCategory({
  selectedType,
}: {
  selectedType: "b2b" | "b2c" | "b2g" | "b2i" | null;
}) {
  const [show, setShow] = useState(false);
  const [scategory, setScategory] = useState<
    ICategories["categories"][number] | null
  >(null);

  const form = useForm<TCreateCategoryForm>({
    defaultValues: {
      type: selectedType ?? undefined,
    },
    resolver: zodResolver(createCategoryValidator),
  });

  const uploadCategory = useMutation({
    mutationKey: ["uploadCategory"],
    mutationFn: async (data: TCreateCategoryForm) => {
      const res = await axios.post(env?.BACKEND_URL + "/api/categories", data);
      return res.data.data;
    },
    onSuccess: () => {
      form.reset();
      toast.success("Category created successfully");
      setShow(false);
      categoryQuery.refetch();
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const deleteCategory = useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: async (id: string) => {
      const res = await axios.delete(
        env?.BACKEND_URL + `/api/categories/${id}`
      );
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Category deleted successfully");
      categoryQuery.refetch();
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const categoryQuery = useQuery<ICategories>({
    queryKey: ["categories", selectedType],
    queryFn: async () => {
      const res = await axios.get(env?.BACKEND_URL + "/api/categories", {
        params: {
          limit: 100,
          page: 1,
          type: selectedType ?? undefined,
        },
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!selectedType,
  });
  // console.log(selectedType, "selectedType");

  useEffect(() => {
    setScategory(null);
    if (selectedType) form.setValue("type", selectedType ?? undefined);
    if (!selectedType) toast.error("Please select a type");
  }, [selectedType]);

  return (
    <div className="">
      <div className="flex w-full justify-end items-center pr-8">
        <Dialog open={show} onOpenChange={setShow}>
          <DialogTrigger disabled={!selectedType}>
            <Button
              disabled={!selectedType}
              className="flex items-center gap-x-3 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              <BiSolidCategoryAlt size={24} /> Create New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-lg p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Create Category
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Add a new category to your collection.
              </DialogDescription>
            </DialogHeader>
            <form
              className="flex flex-col gap-y-6"
              onSubmit={form.handleSubmit(
                (e) => {
                  const isDuplicate = categoryQuery?.data?.categories?.some(
                    (category) =>
                      category.name.toLowerCase() === e.name.toLowerCase()
                  );
                  if (isDuplicate) {
                    toast.error("Category already exists");
                    return;
                  }
                  if (selectedType)
                    uploadCategory.mutate({
                      ...e,
                      type: selectedType ?? undefined,
                    });
                  if (!selectedType)
                    toast.error("Please select a category type");
                },
                (err) => {
                  console.log(err);
                }
              )}
            >
              <Input
                {...form.register("name")}
                placeholder="Category Name"
                label="Name"
                error={form.formState.errors.name?.message}
              />
              <div>
                <FileUploader
                  setFileId={(id) => {
                    if (id) form.setValue("logo", id);
                  }}
                  title="Upload Logo"
                  purpose="category"
                />
                {form?.formState.errors.logo?.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.logo.message}
                  </p>
                )}
              </div>
              <Button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all">
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className=" rounded-lg">
        <div className="flex flex-wrap  gap-4 p-6  overflow-y-auto ">
          {categoryQuery?.data?.categories?.map((category) => (
            <div
              key={category.slug}
              className={cn(
                "flex justify-between  gap-4 rounded-full items-center p-4 bg-white border  shadow-md transition-all cursor-pointer relative hover:shadow-lg",
                category._id === scategory?._id &&
                  "bg-gradient-to-tr from-[#8E2DE2] to-[#4A00E0] text-white"
              )}
              onClick={() => setScategory(category)}
            >
              <div className="flex items-center gap-x-4">
                {/* <Image
                  width={200}
                  height={200}
                  src={category?.logo?.viewUrl}
                  alt={category?.slug}
                  className="w-8 h-8 rounded-full object-cover mb-3"
                /> */}
                <p className="text-lg font-medium capitalize">
                  {category.name}
                </p>
              </div>
              <Dialog>
                <DialogTrigger className=" text-red-500">
                  <MdDelete size={20} />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-x-4">
                    <DialogClose>
                      <Button variant={"outline"}>Cancel</Button>
                    </DialogClose>
                    <DialogClose>
                      <Button
                        onClick={() => deleteCategory?.mutate(category._id)}
                      >
                        Delete <MdDelete size={20} />
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>
      {scategory && <CreateCourse category={scategory} />}
    </div>
  );
}
