"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { toast } from "sonner";
import { FilterOptions, Lead } from "./_components/type";
import LeadsTableView from "./_components/LeadTableView";
import LeadsFilter from "./_components/LeadFilter";
import LeadsTabs from "./_components/LeadTabs";
import {
  filterLeads,
  getLeadCounts,
  renderCategoryIcon,
  renderStatusBadge,
  renderTypeBadge,
} from "./_components/leadUtils";

// Backend URL
const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "https://backendbskilling-production-20ff.up.railway.app";

export default function AdminLeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [filters, setFilters] = useState<FilterOptions>({
    type: "",
    subCategory: "",
    status: "",
    searchQuery: "",
  });

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Fetch leads data
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/lead`);
        // Process leads data
        const processedLeads = response.data.data.map((lead: any) => ({
          ...lead,
          status: lead.status || "NEW",
          notes: lead.notes || [],
        }));
        setLeads(processedLeads);
        setError("");
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError("Failed to fetch leads. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Update lead status
  const handleStatusChange = async (id: string, status: string) => {
    try {
      await axios.put(`${backendUrl}/api/lead/${id}`, {
        status: status,
      });

      // Update local state
      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead._id === id ? { ...lead, status: status as any } : lead
        )
      );

      toast(`Lead status has been updated to ${status}`);
    } catch (err) {
      console.error("Error updating lead status:", err);
      toast.error("Failed to update lead status. Please try again.");
    }
  };

  // Add comment to lead
  const handleAddComment = async (id: string, comment: string) => {
    try {
      await axios.put(`${backendUrl}/api/lead/${id}`, {
        comment: comment,
      });

      // Update local state
      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead._id === id ? { ...lead, comment: comment } : lead
        )
      );

      toast("Your comment has been updated successfully");
    } catch (err) {
      console.error("Error updating comment:", err);
      toast.error("Failed to update comment. Please try again.");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: "",
      subCategory: "",
      status: "",
      searchQuery: "",
    });
  };

  // Filter leads based on criteria
  const filteredLeads = filterLeads(leads, filters, activeTab);

  // Get counts for each type
  const counts = getLeadCounts(leads);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Leads
          </h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4 max-w-[100vw]">
      {/* Filter Component */}
      <LeadsFilter
        filters={filters}
        setFilters={setFilters}
        isFilterMenuOpen={isFilterMenuOpen}
        setIsFilterMenuOpen={setIsFilterMenuOpen}
        resetFilters={resetFilters}
      />

      {/* Tabs Component */}
      <LeadsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
        filteredLeads={filteredLeads}
        onStatusChange={handleStatusChange}
        onAddComment={handleAddComment}
        renderStatusBadge={renderStatusBadge}
        renderTypeBadge={renderTypeBadge}
        renderCategoryIcon={renderCategoryIcon}
      />
    </div>
  );
}
