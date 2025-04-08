"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  UserSquare,
  Briefcase,
  GraduationCap,
  LandmarkIcon,
} from "lucide-react";
import { Lead } from "./type";

// Status badge rendering
export const renderStatusBadge = (status?: string) => {
  let badgeClass = "";
  switch (status) {
    case "contacted":
      badgeClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
      break;
    case "converted":
      badgeClass = "bg-green-100 text-green-800 border-green-200";
      break;
    case "rejected":
      badgeClass = "bg-red-100 text-red-800 border-red-200";
      break;
    default:
      badgeClass = "bg-gray-100 text-gray-800 border-gray-200";
  }

  return (
    <Badge variant="outline" className={badgeClass}>
      {status || "Pending"}
    </Badge>
  );
};

// Status color function - used in multiple components
export const getStatusColor = (status: string) => {
  switch (status) {
    case "NEW":
      return "bg-blue-500 text-white";
    case "Attempted to Contact":
      return "bg-amber-500 text-white";
    case "Not Contact":
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
export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Attempted to Contact":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Not Contact":
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

// Type badge rendering
export const renderTypeBadge = (type: string) => {
  let badgeClass = "";
  switch (type) {
    case "b2i":
      badgeClass = "bg-indigo-100 text-indigo-800 border-indigo-200";
      break;
    case "b2b":
      badgeClass = "bg-blue-100 text-blue-800 border-blue-200";
      break;
    case "b2c":
      badgeClass = "bg-green-100 text-green-800 border-green-200";
      break;
    case "b2g":
      badgeClass = "bg-orange-100 text-orange-800 border-orange-200";
      break;
    default:
      badgeClass = "bg-gray-100 text-gray-800 border-gray-200";
  }

  return (
    <Badge variant="outline" className={badgeClass}>
      {type.toUpperCase()}
    </Badge>
  );
};

// Category icon rendering
export const renderCategoryIcon = (category: string) => {
  switch (category) {
    case "individual_course":
      return <UserSquare className="h-5 w-5 text-blue-500" />;
    case "corporate_training":
      return <Briefcase className="h-5 w-5 text-purple-500" />;
    case "institutional":
      return <GraduationCap className="h-5 w-5 text-green-500" />;
    case "government":
      return <LandmarkIcon className="h-5 w-5 text-red-500" />;
    default:
      return <Building2 className="h-5 w-5 text-gray-500" />;
  }
};

// Get counts for each type
export const getLeadCounts = (leads: Lead[]) => {
  const counts = {
    all: leads.length,
    b2i: leads.filter((lead) => lead.type === "b2i").length,
    b2b: leads.filter((lead) => lead.type === "b2b").length,
    b2c: leads.filter((lead) => lead.type === "b2c").length,
    b2g: leads.filter((lead) => lead.type === "b2g").length,
  };
  return counts;
};

// Filter leads based on criteria
export const filterLeads = (leads: Lead[], filters: any, activeTab: string) => {
  return leads.filter((lead) => {
    // Filter by tab first
    if (activeTab !== "all" && lead.type !== activeTab) {
      return false;
    }

    // Then apply additional filters
    return (
      (filters.type === "" || lead.type === filters.type) &&
      (filters.subCategory === "" ||
        lead.subCategory === filters.subCategory) &&
      (filters.status === "" || lead.status === filters.status) &&
      (filters.searchQuery === "" ||
        lead.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        lead.query.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    );
  });
};
