// app/api/enrollments.ts
import env from '@/lib/env';
import axios from 'axios';

export interface IPagination {
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ICategory {
  _id: string;
  name: string;
  type: 'b2i' | 'b2b' | 'b2c' | 'b2g';
  slug: string;
  logo: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICourseData {
  _id: string;
  title: string;
  description: string;
  banner: {
    _id: string;
    viewUrl: string;
  };
  previewImage: {
    _id: string;
    viewUrl: string;
  };
  type: 'b2i' | 'b2b' | 'b2c' | 'b2g';
  category: ICategory[];
  isPaid: boolean;
}

export interface IEnrollment {
  courseId: ICourseData;
  externalBundleId: number;
  externalEnrollmentId: number;
  paymentId: number;
  status: 'pending' | 'enrolled' | 'failed';
  enrolledAt: string;
}

export interface IEdmingleUser {
  _id: string;
  email: string;
  name: string;
  contactNumber: string;
  externalUserId?: number;
  enrollments: IEnrollment[];
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentsResponse {
  success: boolean;
  message: string;
  data: {
    enrollments: IEdmingleUser[];
    pagination: IPagination;
  };
}

export const fetchEnrollments = async (
  page: number = 1,
  limit: number = 10
): Promise<EnrollmentsResponse> => {
  try {
    const response = await axios.get(env?.BACKEND_URL + '/api/edmingle/users', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch enrollments');
  }
};
