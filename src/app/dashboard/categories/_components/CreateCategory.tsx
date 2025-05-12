'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BiSolidCategoryAlt, BiSolidEditAlt } from 'react-icons/bi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';
// import env from "@/lib/env";
import { useEffect, useState } from 'react';
import CreateCourse from './CreateCourse';
import { cn } from '@/lib/utils';
import { MdDelete } from 'react-icons/md';
import env from '@/lib/env';
import FileUploader from '@/components/global/FileUploader';
import Image from 'next/image';
import { set } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';

const createCategoryValidator = z.object({
  name: z.string().min(3, 'Name is required').max(100, 'Name must be less than 100 characters'),
  type: z.enum(['b2b', 'b2c', 'b2g', 'b2i']),
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
  isPublished: boolean;
  type: 'b2b' | 'b2c' | 'b2g' | 'b2i';
  __v: number;
}

interface logo {
  _id: string;
  viewUrl: string;
}

export default function CreateCategory({
  selectedType,
}: {
  selectedType: 'b2b' | 'b2c' | 'b2g' | 'b2i' | null;
}) {
  const clientQuery = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [scategory, setScategory] = useState<ICategories['categories'][number] | null>(null);

  const form = useForm<TCreateCategoryForm>({
    defaultValues: {
      type: selectedType ?? undefined,
    },
    resolver: zodResolver(createCategoryValidator),
  });

  const uploadCategory = useMutation({
    mutationKey: ['uploadCategory'],
    mutationFn: async (data: TCreateCategoryForm) => {
      const res = await axios.post(env?.BACKEND_URL + '/api/categories', data);
      return res.data.data;
    },
    onSuccess: () => {
      form.reset();
      toast.success('Category created successfully');
      setShow(false);
      categoryQuery.refetch();
      clientQuery.invalidateQueries({
        queryKey: ['categories', selectedType, searchParams],
      });
    },
    onError: error => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const deleteCategory = useMutation({
    mutationKey: ['deleteCategory'],
    mutationFn: async (id: string) => {
      const res = await axios.delete(env?.BACKEND_URL + `/api/categories/${id}`);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Category deleted successfully');
      categoryQuery.refetch();
    },
    onError: error => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const categoryQuery = useQuery<ICategories>({
    queryKey: ['categories', selectedType, searchParams],
    queryFn: async () => {
      const res = await axios.get(env?.BACKEND_URL + '/api/categories', {
        params: {
          limit: 100,
          page: 1,
          type: selectedType ?? undefined,
        },
      });
      const data = res.data.data as ICategories;
      setScategory(data.categories.find(e => e?._id === searchParams?.get('id')) ?? null);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!selectedType,
  });
  // console.log(selectedType, "selectedType");

  useEffect(() => {
    setScategory(null);
    if (selectedType) form.setValue('type', selectedType ?? undefined);
    if (!selectedType) toast.error('Please select a type');

    setScategory(
      categoryQuery?.data?.categories?.find(e => e?._id === searchParams?.get('id')) ?? null
    );
  }, [selectedType]);

  const updateCategory = useMutation({
    mutationKey: ['updateCategory'],
    mutationFn: async (data: { _id: string; isPublished: boolean }) => {
      const res = await axios.put(env?.BACKEND_URL + `/api/categories/${data?._id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      form.reset();
      toast.success('Category updated successfully');
      setShow(false);
      categoryQuery.refetch();
    },
    onError: error => {
      console.log(error);
      toast.error(error.message);
    },
  });

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
              <DialogTitle className="text-lg font-semibold">Create Category</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Add a new category to your collection.
              </DialogDescription>
            </DialogHeader>
            <form
              className="flex flex-col gap-y-6"
              onSubmit={form.handleSubmit(
                e => {
                  const isDuplicate = categoryQuery?.data?.categories?.some(
                    category => category.name.toLowerCase() === e.name.toLowerCase()
                  );
                  if (isDuplicate) {
                    toast.error('Category already exists');
                    return;
                  }
                  if (selectedType)
                    uploadCategory.mutate({
                      ...e,
                      type: selectedType ?? undefined,
                    });
                  if (!selectedType) toast.error('Please select a category type');
                },
                err => {
                  console.log(err);
                }
              )}
            >
              <Input
                {...form.register('name')}
                placeholder="Category Name"
                label="Name"
                error={form.formState.errors.name?.message}
              />

              <Button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all">
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className=" rounded-lg px-6">
        <div className="flex flex-wrap gap-4 mt-5">
          <div
            className={cn(
              'flex items-center justify-center px-4 hover:cursor-pointer py-3 border border-blue-500 rounded-lg shadow-md bg-white text-blue-700 font-medium transition-all hover:bg-blue-500 hover:text-white hover:shadow-lg hover:-translate-y-1',
              !scategory?._id && 'bg-blue-600 text-white border-blue-700 shadow-lg scale-[1.02]'
            )}
            onClick={() => setScategory(null)}
          >
            <p className="text-sm text-center">All</p>
          </div>
          {categoryQuery?.data?.categories?.map(category => (
            <ContextMenu>
              <ContextMenuTrigger>
                {' '}
                <div
                  key={category.slug}
                  className={cn(
                    'flex items-center justify-center px-4 hover:cursor-pointer py-3 border border-blue-500 rounded-lg shadow-md bg-white text-blue-700 font-medium transition-all hover:bg-blue-500 hover:text-white hover:shadow-lg hover:-translate-y-1',
                    category._id === scategory?._id &&
                      'bg-blue-600 text-white border-blue-700 shadow-lg scale-[1.02]'
                  )}
                  onClick={() => {
                    setScategory(category);
                    router.push(`/dashboard/categories?type=${selectedType}&id=${category._id}`);
                  }}
                >
                  <p className="text-sm text-center">{category.name}</p>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem className=" text-green-500 flex items-center gap-x-2">
                  {category?.isPublished ? (
                    <span
                      className="flex items-center gap-x-2 text-red-400"
                      onClick={() =>
                        updateCategory?.mutate({
                          _id: category._id,
                          isPublished: false,
                        })
                      }
                    >
                      Unpublish <AiOutlineCheckCircle size={20} />
                    </span>
                  ) : (
                    <span
                      onClick={() =>
                        updateCategory?.mutate({
                          _id: category._id,
                          isPublished: true,
                        })
                      }
                      className="flex items-center gap-x-2 text-green-400"
                    >
                      Publish <AiOutlineCloseCircle size={20} />
                    </span>
                  )}
                </ContextMenuItem>
                <ContextMenuItem className=" text-blue-500 flex items-center gap-x-2">
                  Edit <BiSolidEditAlt size={20} />
                </ContextMenuItem>
                <ContextMenuItem>
                  <button
                    className="text-red-500 flex item-center gap-x-2"
                    onClick={() => deleteCategory?.mutate(category._id)}
                  >
                    Delete <MdDelete size={20} />
                  </button>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
        {/* <div className="flex flex-wrap  gap-4 p-6  overflow-y-auto ">
          {categoryQuery?.data?.categories?.map((category) => (
            <div
              key={category.slug}
              className={cn(
                "flex justify-between  gap-4 rounded-full items-center p-4 bg-white border  shadow-md transition-all cursor-pointer relative hover:shadow-lg",
                category._id === scategory?._id &&
                  "bg-gradient-to-tr from-[#8E2DE2] to-[#4A00E0] text-white"
              )}
              onClick={() => {
                setScategory(category);
                router.push(
                  `/categories?type=${selectedType}&id=${category?._id}`
                );
              }}
            >
              <div className="flex items-center gap-x-4">
                <p className="text-lg font-medium capitalize">
                  {category.name}
                </p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
      {scategory && <CreateCourse category={scategory} />}
    </div>
  );
}
