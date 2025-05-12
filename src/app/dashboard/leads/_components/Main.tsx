'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { XCircle, RefreshCw } from 'lucide-react';
import { FilterOptions, Lead } from './types';
import { filterLeads, getLeadCounts } from './leadUtils';
import { LeadTabs, EmptyState } from './LeadComponents';
import LeadFilter from './LeadFilter';
import LeadTable from './LeadTable';
import { fetchLeads, updateStatusWithNote, updateLeadComment } from './leadApi';

const AdminLeadsDashboard: React.FC = () => {
  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLeads: 0,
    pageSize: 20,
  });
  const [filters, setFilters] = useState<FilterOptions>({
    type: '',
    subCategory: '',
    status: '',
    searchQuery: '',
    category: '',
    courseId: '',
  });
  const [staleTime, setStaleTime] = useState<Date | null>(null);
  // Add note to lead
  const handleAddNote = async (id: string, text: string, status: string) => {
    try {
      // Create the note object
      const newNote = {
        text,
        status,
        addedBy: 'Admin',
        createdAt: new Date().toISOString(),
      };

      await updateStatusWithNote(id, status, text);

      // Update local state
      setLeads(currentLeads =>
        currentLeads.map(lead =>
          lead._id === id
            ? {
                ...lead,
                notes: [newNote, ...lead.notes],
                updatedAt: new Date().toISOString(),
              }
            : lead
        )
      );

      toast.success('Note added successfully');
    } catch (err) {
      console.error('Error adding note:', err);
      toast.error('Failed to add note. Please try again.');
    }
  };
  // Fetch leads data
  const fetchLeadsData = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const response = await fetchLeads(page, limit);

      // Process leads data - ensure notes array exists and proper status
      const processedLeads = response.data.leads.map((lead: any) => ({
        ...lead,
        status: lead.status || 'NEW',
        notes: lead.notes || [],
      }));

      setLeads(processedLeads);
      setPagination(response.data.pagination);
      setStaleTime(new Date());
      setError('');
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to fetch leads. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchLeadsData();
  }, [fetchLeadsData]);

  // Apply filters when leads, filters, or active tab changes
  useEffect(() => {
    const filtered = filterLeads(leads, filters, activeTab);
    setFilteredLeads(filtered);
  }, [leads, filters, activeTab]);

  // Check data staleness
  const isDataStale = useCallback(() => {
    if (!staleTime) return true;

    const now = new Date();
    const staleDurationMinutes = 5; // Consider data stale after 5 minutes
    const diffMs = now.getTime() - staleTime.getTime();
    const diffMinutes = Math.floor(diffMs / 1000 / 60);

    return diffMinutes >= staleDurationMinutes;
  }, [staleTime]);

  // Handle refresh
  const handleRefresh = () => {
    fetchLeadsData(pagination.currentPage, pagination.pageSize);
    toast.success('Data refreshed');
  };

  // Handle pagination change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchLeadsData(newPage, pagination.pageSize);
  };

  // Update lead status with note
  const handleStatusChange = async (id: string, status: string, note: string) => {
    try {
      await updateStatusWithNote(id, status, note);

      // Update local state
      setLeads(currentLeads =>
        currentLeads.map(lead =>
          lead._id === id
            ? {
                ...lead,
                status,
                notes: [
                  {
                    text: note,
                    status,
                    addedBy: 'Admin',
                    createdAt: new Date().toISOString(),
                  },
                  ...lead.notes,
                ],
                updatedAt: new Date().toISOString(),
              }
            : lead
        )
      );

      toast.success(`Lead status updated to ${status}`);
    } catch (err) {
      console.error('Error updating lead status:', err);
      toast.error('Failed to update lead status. Please try again.');
    }
  };

  // Add comment to lead
  const handleAddComment = async (id: string, comment: string) => {
    try {
      await updateLeadComment(id, comment);

      // Update local state
      setLeads(currentLeads =>
        currentLeads.map(lead =>
          lead._id === id ? { ...lead, comment, updatedAt: new Date().toISOString() } : lead
        )
      );

      toast.success('Comment saved successfully');
    } catch (err) {
      console.error('Error updating comment:', err);
      toast.error('Failed to update comment. Please try again.');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: '',
      subCategory: '',
      status: '',
      searchQuery: '',
      category: '',
      courseId: '',
    });
  };

  // Get counts for each type
  const counts = getLeadCounts(leads);

  // Loading state
  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Error state
  if (error && leads.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Leads</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={handleRefresh} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4 max-w-[100vw]">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lead Management</h1>
        <div className="flex items-center gap-2">
          {isDataStale() && <p className="text-amber-500 text-sm">Data may be outdated</p>}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {loading && <p className="text-sm text-slate-500">Loading...</p>}
        </div>
      </div>

      {/* Filter Component */}
      <LeadFilter
        filters={filters}
        setFilters={setFilters}
        isFilterMenuOpen={isFilterMenuOpen}
        setIsFilterMenuOpen={setIsFilterMenuOpen}
        resetFilters={resetFilters}
      />

      {/* Tabs Component */}
      <LeadTabs activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />

      {/* TabsContent */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value={activeTab} className="m-0">
          <LeadTable
            leads={filteredLeads}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onAddComment={handleAddComment}
            onStatusChange={handleStatusChange}
            onAddNote={handleAddNote}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminLeadsDashboard;
