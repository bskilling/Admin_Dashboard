'use client';

import env from '@/lib/env';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaPlusSquare, FaFileImport } from 'react-icons/fa';
import { IoMdSearch } from 'react-icons/io';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IAllCourses, publishedCourseSchema } from './types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ICourse } from '../add-course/draft/_components/types';
import { ICategories } from './CreateCategory';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BulkUpdateDatesDialog from './BulkUpdateDatesDialog';
import { CalendarDays } from 'lucide-react';

// Define types for category types
const categoryTypes = [
  { value: 'b2c', label: 'B2C' },
  { value: 'b2b', label: 'B2B' },
  { value: 'b2g', label: 'B2G' },
  { value: 'b2i', label: 'B2I' },
];

export default function CreateCourse({
  category,
}: {
  category: ICategories['categories'][number];
}) {
  const categoryQuery = useQueryClient();
  const navigate = useRouter();
  const [isPublished, setIsPublished] = useState<boolean | undefined>(false);
  const [allErrors, setAllErrors] = useState<string[]>([]); // Initialize as empty array

  // Import functionality states
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedCategoryType, setSelectedCategoryType] = useState<string>('b2c');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourseToImport, setSelectedCourseToImport] = useState<ICourse | null>(null);

  const { data } = useQuery<{ courses: ICourse[] }>({
    queryKey: ['courses', category?._id, isPublished],
    queryFn: async () => {
      const res = await axios.get(env?.BACKEND_URL + '/api/courses', {
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

  // Get all categories based on type
  const { data: categoriesData } = useQuery<{
    categories: ICategories['categories'];
  }>({
    queryKey: ['categories', selectedCategoryType],
    queryFn: async () => {
      const res = await axios.get(env?.BACKEND_URL + '/api/categories', {
        params: {
          type: selectedCategoryType,
        },
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: importModalOpen, // Only fetch when import modal is open
  });

  // Get courses from selected category for import
  const { data: importableCoursesData, refetch: refetchImportableCourses } = useQuery<{
    courses: ICourse[];
  }>({
    queryKey: ['importable-courses', selectedCategoryId, searchQuery],
    queryFn: async () => {
      if (!selectedCategoryId) return { courses: [] };

      const res = await axios.get(env?.BACKEND_URL + '/api/courses', {
        params: {
          limit: 100,
          page: 1,
          category: selectedCategoryId,
          title: searchQuery.length > 0 ? searchQuery : undefined,
        },
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!selectedCategoryId && importModalOpen,
  });

  // Effect to clear selected course when changing category
  useEffect(() => {
    setSelectedCourseToImport(null);
  }, [selectedCategoryId]);

  // Effect to refetch when search query changes
  useEffect(() => {
    if (selectedCategoryId && importModalOpen) {
      const timer = setTimeout(() => {
        refetchImportableCourses();
      }, 500); // Debounce search

      return () => clearTimeout(timer);
    }
  }, [searchQuery, refetchImportableCourses, selectedCategoryId, importModalOpen]);

  const createDraftMutation = useMutation({
    mutationFn: async (data: { category: [string]; type: string }) => {
      console.log(data);
      const res = await axios.post(env.BACKEND_URL + '/api/courses/draft', data);
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success('Draft course created successfully');
      navigate.push(`/dashboard/categories/add-course/draft/${data.data._id}`);
    },
    onError: error => {
      toast.error('Failed to create draft: ' + error.message);
    },
  });

  // Import course mutation - creates a new draft using data from existing course

  // Import course mutation - creates a new draft using data from existing course
  const importCourseMutation = useMutation({
    mutationFn: async (courseToImport: ICourse) => {
      // Prepare the course data for import
      // We remove the _id and change the category to the current one
      const importData = {
        title: courseToImport.title,
        description: courseToImport.description,
        slug: courseToImport.slug,
        isPaid: courseToImport.isPaid,
        variant: courseToImport.variant,
        highlights: courseToImport.highlights,
        skills: courseToImport.skills,
        whyJoin: courseToImport.whyJoin,
        durationHours: courseToImport.durationHours,
        videoUrl: courseToImport.videoUrl,
        price: courseToImport.price,
        certification: courseToImport.certification,
        partnerShip: courseToImport.partnerShip,
        previewImage: courseToImport.previewImage?._id,
        banner: courseToImport.banner?._id,
        logoUrl: courseToImport.logoUrl?._id,
        category: [category._id], // Set to current category
        type: category.type, // Set to current type
        overview: courseToImport.overview,
        outcomes: courseToImport.outcomes,
        curriculum: courseToImport.curriculum,
        faqs: courseToImport.faqs,
        tools: courseToImport.tools,
        // Ensure the imported course starts as a draft
        isPublished: false,
      };

      const res = await axios.post(env.BACKEND_URL + '/api/courses/draft', importData);
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success('Course imported successfully');

      setImportModalOpen(false);
      navigate.push(`/dashboard/categories/add-course/draft/${data.data._id}`);
    },
    onError: error => {
      toast.error('Failed to import course: ' + error.message);
    },
  });

  const publishCourse = useMutation({
    mutationFn: async (data: ICourse) => {
      const res = await axios.post(
        env.BACKEND_URL + '/api/courses' + `/${data?._id}` + '/publish',
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Course published successfully');
      // Reset errors on success
      setAllErrors([]);
    },
    onError: (error: any) => {
      // Extract errors from response
      const errorResponse = error?.response?.data;

      if (errorResponse?.errors && Array.isArray(errorResponse.errors)) {
        setAllErrors(errorResponse.errors);
      } else if (errorResponse?.message) {
        setAllErrors([errorResponse.message]);
      } else {
        setAllErrors(['Failed to publish course. Please try again.']);
      }

      toast.error('Failed to publish course');
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (data: ICourse) => {
      const res = await axios.delete(env.BACKEND_URL + '/api/courses' + `/${data?._id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Course deleted successfully');
    },
    onError: error => {
      toast.error('Failed to delete course: ' + error.message);
    },
  });

  // Clear errors when opening a new dialog
  const handlePublishDialogOpen = () => {
    setAllErrors([]);
  };

  return (
    <div className="w-full mx-auto px-6 py-5">
      <Card className="mt-6 border border-gray-300 shadow-lg rounded-xl bg-white dark:bg-gray-900">
        <CardHeader>
          {/* Top Controls */}
          <div className="flex items-center justify-between gap-3">
            {/* Published Toggle */}
            <div className="flex items-center gap-3">
              <Label htmlFor="airplane-mode" className="text-gray-700 dark:text-gray-300">
                Published
              </Label>
              <Switch
                id="airplane-mode"
                checked={isPublished}
                onCheckedChange={checked => setIsPublished(checked)}
              />
            </div>
            <BulkUpdateDatesDialog category={category}>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50"
              >
                <CalendarDays size={16} />
                <span>Update Dates</span>
              </Button>
            </BulkUpdateDatesDialog>
            {/* Import Button */}
            <Button
              variant="outline"
              className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={() => setImportModalOpen(true)}
            >
              <FaFileImport size={16} />
              <span>Import Course</span>
            </Button>
          </div>

          {/* Main Title */}
          <CardTitle className="text-3xl font-bold text-center capitalize text-gray-900 dark:text-white mt-4">
            {category?.name} Courses
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 gap-8 mt-8">
            {data?.courses.map(category => (
              <Card
                key={category._id}
                className="relative min-h-96 border border-gray-200 rounded-lg shadow-md transition-all hover:shadow-xl hover:scale-[1.02] dark:border-gray-700 dark:bg-gray-800"
              >
                <Link href={`/dashboard/categories/add-course/draft/${category?._id}`}>
                  <CardHeader className="p-0 relative">
                    {/* Status Button */}
                    <Button
                      className={cn(
                        'absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-lg shadow-sm',
                        category?.isPublished
                          ? 'bg-green-600 text-white'
                          : 'bg-orange-500 text-white'
                      )}
                    >
                      {category?.isPublished ? 'Published' : 'Draft'}
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
                      {category?.title || 'No Name'}
                    </CardTitle>
                    <CardDescription className="px-4 text-gray-600 dark:text-gray-400 text-sm">
                      {category?.description || 'No Description'}
                    </CardDescription>
                  </CardHeader>
                </Link>

                {/* Card Footer Buttons */}
                <CardFooter className="w-full flex justify-between gap-4 p-4">
                  <Link href={`/dashboard/categories/add-course/draft/${category?._id}`}>
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
                          This action cannot be undone. It will permanently delete the course.
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
                  <Dialog onOpenChange={handlePublishDialogOpen}>
                    <DialogTrigger>
                      <Button>Publish</Button>
                    </DialogTrigger>
                    <DialogContent className="w-[80vw]">
                      <DialogHeader>
                        <DialogTitle>Confirm Publishing</DialogTitle>
                        <DialogDescription>This will publish the course.</DialogDescription>
                      </DialogHeader>

                      {/* Error Display - Fixed */}
                      {allErrors.length > 0 && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4">
                          <h3 className="font-semibold">Fix these errors:</h3>
                          <ul className="list-disc list-inside mt-2">
                            {allErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
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
                          // @ts-expect-error
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
                  <p className="text-center text-lg font-bold">Create New Course</p>
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
                        category: [category._id],
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

      {/* Import Course Modal */}
      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent className="w-[90vw] max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">Import Course</DialogTitle>
            <DialogDescription>
              Import a course from another category to {category?.name} (
              {category?.type.toUpperCase()})
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs defaultValue="browse" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="w-full flex justify-center mb-4">
                <TabsTrigger value="browse" className="flex-1">
                  Browse Courses
                </TabsTrigger>
                <TabsTrigger value="search" className="flex-1">
                  Search Courses
                </TabsTrigger>
              </TabsList>

              <TabsContent value="browse" className="flex-1 flex flex-col overflow-hidden">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Category Type Selection */}
                  <div>
                    <Label htmlFor="categoryType" className="mb-2 block">
                      Category Type
                    </Label>
                    <Select
                      value={selectedCategoryType}
                      onValueChange={value => {
                        setSelectedCategoryType(value);
                        setSelectedCategoryId('');
                      }}
                    >
                      <SelectTrigger id="categoryType">
                        <SelectValue placeholder="Select category type" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <Label htmlFor="category" className="mb-2 block">
                      Category
                    </Label>
                    <Select
                      value={selectedCategoryId}
                      onValueChange={setSelectedCategoryId}
                      disabled={!categoriesData?.categories?.length}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesData?.categories?.map(cat => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Course List */}
                <div className="flex-1 overflow-y-auto border rounded-lg p-2">
                  {!selectedCategoryId ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Select a category to view courses</p>
                    </div>
                  ) : importableCoursesData?.courses?.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No courses found in this category</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {importableCoursesData?.courses?.map(course => (
                        <Card
                          key={course._id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedCourseToImport?._id === course._id
                              ? 'ring-2 ring-blue-500 shadow-lg'
                              : ''
                          }`}
                          onClick={() => setSelectedCourseToImport(course)}
                        >
                          <CardHeader className="p-3 pb-0">
                            <div className="h-36 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                              {course?.previewImage?.viewUrl ? (
                                <img
                                  src={course.previewImage.viewUrl}
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-gray-400 flex items-center justify-center">
                                  <img
                                    src="/images/placeholder.png"
                                    alt="Placeholder"
                                    className="h-16 w-16 object-cover"
                                  />
                                </div>
                              )}
                            </div>
                            <CardTitle className="text-lg font-medium">{course.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {course.description || 'No description available'}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="search" className="flex-1 flex flex-col overflow-hidden">
                <div className="mb-4">
                  <Label htmlFor="searchQuery" className="mb-2 block">
                    Search Courses
                  </Label>
                  <div className="relative">
                    <Input
                      id="searchQuery"
                      placeholder="Enter course title..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <IoMdSearch size={20} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Category Type Selection */}
                  <div>
                    <Label htmlFor="searchCategoryType" className="mb-2 block">
                      Category Type
                    </Label>
                    <Select
                      value={selectedCategoryType}
                      onValueChange={value => {
                        setSelectedCategoryType(value);
                        setSelectedCategoryId('');
                      }}
                    >
                      <SelectTrigger id="searchCategoryType">
                        <SelectValue placeholder="Select category type" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <Label htmlFor="searchCategory" className="mb-2 block">
                      Category
                    </Label>
                    <Select
                      value={selectedCategoryId}
                      onValueChange={setSelectedCategoryId}
                      disabled={!categoriesData?.categories?.length}
                    >
                      <SelectTrigger id="searchCategory">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesData?.categories?.map(cat => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search Results */}
                <div className="flex-1 overflow-y-auto border rounded-lg p-2">
                  {!selectedCategoryId ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Select a category to search courses</p>
                    </div>
                  ) : importableCoursesData?.courses?.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No courses found matching your search</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {importableCoursesData?.courses?.map(course => (
                        <Card
                          key={course._id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedCourseToImport?._id === course._id
                              ? 'ring-2 ring-blue-500 shadow-lg'
                              : ''
                          }`}
                          onClick={() => setSelectedCourseToImport(course)}
                        >
                          <div className="flex p-3">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mr-3 overflow-hidden flex-shrink-0">
                              {course?.previewImage?.viewUrl ? (
                                <img
                                  src={course.previewImage.viewUrl}
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-gray-400 flex items-center justify-center">
                                  <img
                                    src="/images/placeholder.png"
                                    alt="Placeholder"
                                    className="h-12 w-12 object-cover"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium mb-1">{course.title}</h3>
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {course.description || 'No description available'}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div>
              {selectedCourseToImport && (
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Selected:</span> {selectedCourseToImport.title}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setImportModalOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={!selectedCourseToImport}
                onClick={() => {
                  if (selectedCourseToImport) {
                    importCourseMutation.mutate(selectedCourseToImport);
                  }
                }}
              >
                Import Course
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
