'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import env from '@/lib/env';
import { draftCourseSchema } from '@/app/dashboard/categories/_components/validators';
import DraftCourseButton from './DraftButton';

interface CourseDetailsProps {
  courseId: string;
}

const CategoryDraftCreator = ({ courseId }: CourseDetailsProps) => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories', 'b2c'],
    queryFn: async () => {
      const res = await axios.get(`${env.BACKEND_URL}/api/categories`, {
        params: { limit: 100, page: 1, type: 'b2c' },
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch Course Details
  useEffect(() => {
    if (!courseId) return;
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`${env.BACKEND_URL}/api/v1/get-course/${courseId}`);
        setCourseDetails(response.data.course);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [courseId]);

  // Create Draft Course Mutation
  const createDraftMutation = useMutation({
    mutationFn: async (data: { data: z.infer<typeof draftCourseSchema>; _id: string }) => {
      const res = await axios.post(`${env.BACKEND_URL}/api/courses/draft`, {
        ...data.data,
        isPublished: false,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Draft course created successfully');
      queryClient.invalidateQueries({ queryKey: ['course-draft'] });
    },
    onError: error => {
      toast.error('Failed to create draft: ' + error.message);
    },
  });

  const handleCreateDraft = () => {
    if (!selectedCategory || !courseDetails) {
      toast.error('Please select a category and ensure course details are loaded');
      return;
    }

    const draftData: z.infer<typeof draftCourseSchema> = {
      type: 'b2c',
      title: courseDetails?.title || 'New Draft Course',
      category: [selectedCategory],
      description: courseDetails?.description || 'This is a draft description',
      isPublished: false,
    };

    createDraftMutation.mutate({
      data: draftData,
      _id: courseDetails?._id || '', // Use actual course ID if available
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Draft Course</h2>

      {/* Category Selection */}
      {isCategoriesLoading ? (
        <p>Loading categories...</p>
      ) : (
        <select
          className="w-full p-2 border rounded-lg mb-4"
          value={selectedCategory || ''}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="asasa">Select Category</option>
          {categories?.categories?.map((category: { _id: string; name: string }) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      )}

      {/* Course Details */}
      {loading ? (
        <p>Loading course details...</p>
      ) : courseDetails ? (
        <div className="mt-5 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold">{courseDetails?.title}</h3>
          <p className="text-sm text-gray-600">ID: {courseDetails?.id}</p>
          <p className="text-sm">{courseDetails?.description || 'No description available.'}</p>
        </div>
      ) : (
        <p>No course details available.</p>
      )}

      {/* Create Draft Button */}
      {/* <button
        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 mt-4"
        onClick={handleCreateDraft}
        disabled={createDraftMutation.isPending}
      >
        {createDraftMutation.isPending ? "Creating..." : "Create Draft"}
      </button> */}
      <DraftCourseButton
        courseDetails={courseDetails}
        selectedCategory={selectedCategory}
        createDraftMutation={createDraftMutation}
      />
    </div>
  );
};

export default CategoryDraftCreator;
