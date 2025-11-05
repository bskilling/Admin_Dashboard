import axios from 'axios';
import { Lead, Note } from './types';

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backendbskilling-production-20ff.up.railway.app';

// Create a reusable axios instance with default config
const api = axios.create({
  baseURL: `${backendUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchLeads = async (page = 1, limit = 20, filters: Record<string, any> = {}) => {
  try {
    // Build query parameters
    const params: any = {
      page,
      limit,
    };

    // Add filters to params if they exist
    if (filters.type && filters.type !== 'all') {
      params.type = filters.type;
    }
    if (filters.status) {
      params.status = filters.status;
    }
    if (filters.subCategory) {
      params.subCategory = filters.subCategory;
    }
    if (filters.category) {
      params.category = filters.category;
    }
    if (filters.courseId) {
      params.courseId = filters.courseId;
    }
    if (filters.search) {
      params.search = filters.search;
    }

    const response = await api.get('/lead', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};

export const updateLeadStatus = async (leadId: string, status: string) => {
  try {
    const response = await api.put(`/lead/${leadId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }
};

export const updateLeadComment = async (leadId: string, comment: string) => {
  try {
    const response = await api.put(`/lead/${leadId}`, { comment });
    return response.data;
  } catch (error) {
    console.error('Error updating lead comment:', error);
    throw error;
  }
};

export const addLeadNote = async (leadId: string, note: Partial<Note>) => {
  try {
    const response = await api.put(`/lead/${leadId}`, { notes: note });
    return response.data;
  } catch (error) {
    console.error('Error adding lead note:', error);
    throw error;
  }
};

// Combined operation to update status and add note in one request
export const updateStatusWithNote = async (
  leadId: string,
  status: string,
  noteText: string,
  addedBy: string = 'Admin'
) => {
  try {
    const note = {
      text: noteText,
      status,
      addedBy,
    };

    const response = await api.put(`/lead/${leadId}`, {
      status,
      notes: [note],
    });

    return response.data;
  } catch (error) {
    console.error('Error updating status with note:', error);
    throw error;
  }
};
