"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
// import env from "@/lib/env";
import { useState } from "react";
import CreateCourse from "./CreateCourse";
import { cn } from "@/src/lib/utils";
import { MdDelete } from "react-icons/md";
import env from "@/src/lib/env";
import FileUploader from "@/src/components/global/FileUploader";
import Image from "next/image";

const createCategoryValidator = z.object({
  name: z
    .string()
    .min(3, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  logo: z.string().length(24, "Logo is required"),
});

type TCreateCategoryForm = z.infer<typeof createCategoryValidator>;

interface ICategories {
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

export default function CreateCategory() {
  const [show, setShow] = useState(false);
  const [scategory, setScategory] = useState<string | null>(null);

  const form = useForm<TCreateCategoryForm>({
    defaultValues: undefined,
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
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(env?.BACKEND_URL + "/api/categories", {
        params: {
          limit: 100,
          page: 1,
        },
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="p-6">
      <div className="flex w-full justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Manage Categories</h2>
        <Dialog open={show} onOpenChange={setShow}>
          <DialogTrigger>
            <Button className="flex items-center gap-x-3 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all">
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
              onSubmit={form.handleSubmit((e) => {
                const isDuplicate = categoryQuery?.data?.categories?.some(
                  (category) =>
                    category.name.toLowerCase() === e.name.toLowerCase()
                );
                if (isDuplicate) {
                  toast.error("Category already exists");
                  return;
                }
                uploadCategory.mutate(e);
              })}
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
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoryQuery?.data?.categories?.map((category) => (
          <div
            key={category.slug}
            className={cn(
              "flex flex-col items-center p-4 bg-white border rounded-lg shadow-md transition-all cursor-pointer relative hover:shadow-lg",
              category.slug === scategory &&
                "bg-gradient-to-tr from-[#8E2DE2] to-[#4A00E0] text-white"
            )}
            onClick={() => setScategory(category.slug)}
          >
            <Image
              width={200}
              height={200}
              src={category?.logo?.viewUrl}
              alt={category?.slug}
              className="w-20 h-20 rounded-full object-cover mb-3"
            />
            <p className="text-lg font-medium capitalize">{category.name}</p>
            <p className="text-sm text-gray-500">{category?.slug}</p>
            <button
              className="absolute top-3 right-3 text-red-600 hover:text-red-800 transition-all"
              onClick={() => deleteCategory?.mutate(category._id)}
            >
              <MdDelete size={20} />
            </button>
          </div>
        ))}
      </div>
      {scategory && <CreateCourse category={scategory} />}
    </div>
  );
}
