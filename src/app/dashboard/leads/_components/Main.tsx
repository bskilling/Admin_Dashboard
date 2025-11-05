'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { XCircle, RefreshCw } from 'lucide-react';
import { FilterOptions, Lead } from './types';
import { LeadTabs, EmptyState } from './LeadComponents';
import LeadFilter from './LeadFilter';
import LeadTable from './LeadTable';
import { fetchLeads, updateStatusWithNote, updateLeadComment } from './leadApi';

const AdminLeadsDashboard: React.FC = () => {
  // State
  const [leads, setLeads] = useState<Lead[]>([]);
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
  const [counts, setCounts] = useState({
    all: 0,
    b2i: 0,
    b2b: 0,
    b2c: 0,
    b2g: 0,
  });
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'b2i',
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
      const newNote = {
        text,
        status,
        addedBy: 'Admin',
        createdAt: new Date().toISOString(),
      };

      await updateStatusWithNote(id, status, text);

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

  // Fetch leads data with filters
  const fetchLeadsData = useCallback(
    async (page = 1, limit = 20) => {
      try {
        setLoading(true);

        // Build filter parameters
        const filterParams: any = {};

        // Add type filter from active tab
        if (activeTab !== 'all') {
          filterParams.type = activeTab;
        }

        // Add additional filters from filter state
        if (filters.type && filters.type !== 'all' && filters.type !== 'rr') {
          filterParams.type = filters.type;
        }
        if (filters.status && filters.status !== 'rr') {
          filterParams.status = filters.status;
        }
        if (filters.subCategory && filters.subCategory !== 'rr') {
          filterParams.subCategory = filters.subCategory;
        }
        if (filters.category && filters.category !== 'rr') {
          filterParams.category = filters.category;
        }
        if (filters.courseId) {
          filterParams.courseId = filters.courseId;
        }
        if (filters.searchQuery) {
          filterParams.search = filters.searchQuery;
        }

        const response = await fetchLeads(page, limit, filterParams);

        // Process leads data
        const processedLeads = response.data.leads.map((lead: any) => ({
          ...lead,
          status: lead.status || 'NEW',
          notes: lead.notes || [],
        }));

        setLeads(processedLeads);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalLeads: response.data.pagination.totalLeads,
          pageSize: limit, // Use the limit parameter
        });

        // Update counts from API response
        if (response.data.counts) {
          setCounts(response.data.counts);
        }

        setStaleTime(new Date());
        setError('');
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError('Failed to fetch leads. Please try again later.');
      } finally {
        setLoading(false);
      }
    },
    [activeTab, filters]
  );

  // Initial data load
  useEffect(() => {
    fetchLeadsData(1, 20);
  }, []);

  // Fetch data when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Fetch data when filters change (with debounce for search)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      fetchLeadsData(1, pagination.pageSize);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [activeTab, filters]);

  // Check data staleness
  const isDataStale = useCallback(() => {
    if (!staleTime) return true;

    const now = new Date();
    const staleDurationMinutes = 5;
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

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize: newPageSize,
      currentPage: 1, // Reset to first page when changing page size
    }));
    fetchLeadsData(1, newPageSize);
    toast.success(`Showing ${newPageSize} items per page`);
  };

  // Update lead status with note
  const handleStatusChange = async (id: string, status: string, note: string) => {
    try {
      await updateStatusWithNote(id, status, note);

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
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

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
      <LeadTabs activeTab={activeTab} setActiveTab={handleTabChange} counts={counts} />

      {/* TabsContent */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsContent value={activeTab} className="m-0">
          <LeadTable
            leads={leads}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
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
