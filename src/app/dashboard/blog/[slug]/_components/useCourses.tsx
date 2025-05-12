// hooks/useCourses.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import env from '@/lib/env';
// types.ts
export type CourseType = 'b2b' | 'b2c' | 'b2g' | 'b2i';

export interface Course {
  _id: string;
  title: string;
  type: CourseType;
  category: string;
  // other course fields
}

export interface CourseQueryParams {
  limit?: number;
  page?: number;
  category?: string;
  type?: CourseType;
  isPublished?: boolean;
}

export interface CourseListResponse {
  courses: Course[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export const useCourses = (params: CourseQueryParams = {}) => {
  return useQuery<CourseListResponse>({
    queryKey: ['courses', params],
    queryFn: async () => {
      const res = await axios.get(env.BACKEND_URL + '/api/courses', {
        params: {
          limit: 100,
          page: 1,
          ...params,
        },
      });
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourseCategories = (type?: CourseType) => {
  return useQuery({
    queryKey: ['courseCategories', type],
    queryFn: async () => {
      const res = await axios.get(env.BACKEND_URL + '/api/categories', {
        params: { type },
      });
      return res.data.data;
    },
    enabled: !!type,
  });
};
