// leadApi.ts
import axios from "axios";
import { Lead, Note } from "./types";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "https://backendbskilling-production-20ff.up.railway.app";

// Create a reusable axios instance with default config
const api = axios.create({
  baseURL: `${backendUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchLeads = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/lead?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }
};

export const updateLeadStatus = async (leadId: string, status: string) => {
  try {
    const response = await api.put(`/lead/${leadId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating lead status:", error);
    throw error;
  }
};

export const updateLeadComment = async (leadId: string, comment: string) => {
  try {
    const response = await api.put(`/lead/${leadId}`, { comment });
    return response.data;
  } catch (error) {
    console.error("Error updating lead comment:", error);
    throw error;
  }
};

export const addLeadNote = async (leadId: string, note: Partial<Note>) => {
  try {
    const response = await api.put(`/lead/${leadId}`, { notes: note });
    return response.data;
  } catch (error) {
    console.error("Error adding lead note:", error);
    throw error;
  }
};

// Combined operation to update status and add note in one request
export const updateStatusWithNote = async (
  leadId: string,
  status: string,
  noteText: string,
  addedBy: string = "Admin"
) => {
  try {
    // Create the note object
    const note = {
      text: noteText,
      status,
      addedBy,
    };

    // Send both status and note in a single request
    const response = await api.put(`/lead/${leadId}`, {
      status,
      notes: note,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating status with note:", error);
    throw error;
  }
};
