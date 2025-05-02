// leadUtils.ts
import { Lead, LeadCounts, FilterOptions, Note } from "./types";
import {
  Building2,
  UserSquare,
  Briefcase,
  GraduationCap,
  LandmarkIcon,
} from "lucide-react";

// Status color function
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "NEW":
      return "bg-blue-500 text-white";
    case "Attempted to Contact":
      return "bg-amber-500 text-white";
    case "Not Contacted":
      return "bg-gray-500 text-white";
    case "In-conversation":
      return "bg-purple-500 text-white";
    case "Prospect":
      return "bg-emerald-500 text-white";
    case "Not-Eligible":
      return "bg-red-400 text-white";
    case "Not-Interested":
      return "bg-pink-500 text-white";
    case "Spam":
      return "bg-orange-500 text-white";
    case "Opportunity":
      return "bg-teal-500 text-white";
    case "Contact-in-Future":
      return "bg-indigo-500 text-white";
    case "Closed-Won":
      return "bg-green-600 text-white";
    case "Closed-Lost":
      return "bg-red-600 text-white";
    default:
      return "bg-slate-500 text-white";
  }
};

// For badge variants
export const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Attempted to Contact":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Not Contacted":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "In-conversation":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Prospect":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Not-Eligible":
      return "bg-red-100 text-red-800 border-red-200";
    case "Not-Interested":
      return "bg-pink-100 text-pink-800 border-pink-200";
    case "Spam":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Opportunity":
      return "bg-teal-100 text-teal-800 border-teal-200";
    case "Contact-in-Future":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "Closed-Won":
      return "bg-green-100 text-green-800 border-green-200";
    case "Closed-Lost":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

// Type badge color
export const getTypeBadgeColor = (type: string): string => {
  switch (type) {
    case "b2i":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "b2b":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "b2c":
      return "bg-green-100 text-green-800 border-green-200";
    case "b2g":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Category icon rendering
export const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case "individual_course":
      return { icon: UserSquare, color: "text-blue-500" };
    case "corporate_training":
      return { icon: Briefcase, color: "text-purple-500" };
    case "institutional":
      return { icon: GraduationCap, color: "text-green-500" };
    case "government":
      return { icon: LandmarkIcon, color: "text-red-500" };
    default:
      return { icon: Building2, color: "text-gray-500" };
  }
};

// Get counts for each type
export const getLeadCounts = (leads: Lead[]): LeadCounts => {
  return {
    all: leads.length,
    b2i: leads.filter((lead) => lead.type === "b2i").length,
    b2b: leads.filter((lead) => lead.type === "b2b").length,
    b2c: leads.filter((lead) => lead.type === "b2c").length,
    b2g: leads.filter((lead) => lead.type === "b2g").length,
  };
};

// Filter leads based on criteria
export const filterLeads = (
  leads: Lead[],
  filters: FilterOptions,
  activeTab: string
): Lead[] => {
  return leads.filter((lead) => {
    // Filter by tab first (type filter)
    if (activeTab !== "all" && lead.type !== activeTab) {
      return false;
    }

    // Then apply additional filters
    const matchesType = filters.type === "" || lead.type === filters.type;
    const matchesSubCategory =
      filters.subCategory === "" || lead.subCategory === filters.subCategory;
    const matchesStatus =
      filters.status === "" || lead.status === filters.status;
    const matchesCategory =
      !filters.category || lead.course?.category?._id === filters.category;
    const matchesCourse =
      !filters.courseId || lead.course?._id === filters.courseId;

    const matchesSearch =
      filters.searchQuery === "" ||
      lead.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      lead.query.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      (lead.course?.title &&
        lead.course.title
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()));

    return (
      matchesType &&
      matchesSubCategory &&
      matchesStatus &&
      matchesSearch &&
      matchesCategory &&
      matchesCourse
    );
  });
};

// Format date nicely
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dateString;
  }
};

// Sort notes by date (most recent first)
export const sortNotesByDate = (notes: Note[]): Note[] => {
  return [...notes].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};
