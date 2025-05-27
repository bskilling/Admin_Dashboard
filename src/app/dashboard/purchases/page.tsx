'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCw, AlertCircle, TrendingUp, FileDown, Settings } from 'lucide-react';

// Import our components
import StatsCards from './_components/StatsCards';
import StatusDistributionCard from './_components/StatusDistributionCard';
import PurchaseFiltersComponent from './_components/PurchaseFilters';
import PurchaseTable from './_components/PurchaseTable';
import PurchaseDetailsModal from './_components/PurchaseDetailsModal';
import RecentActivityComponent from './_components/RecentActivityComponent';
import TopCoursesComponent from './_components/TopCoursesComponent';

// Import types and utilities
import {
  Purchase,
  PurchaseFilters,
  PurchaseStats,
  Pagination,
  PurchaseStatus,
} from './_components/types';
// import { purchaseApi } from '@/lib/api/purchaseApi';
import { downloadFile } from './_components/purchaseUtils';
import { purchaseApi } from './_components/purchaseApi';

const PurchaseManagementPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stats, setStats] = useState<PurchaseStats | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });

  const [filters, setFilters] = useState<PurchaseFilters>({
    page: 1,
    limit: 10,
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    startDate: '',
    endDate: '',
  });

  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters: Partial<PurchaseFilters> = {};

    searchParams.forEach((value, key) => {
      if (key === 'page' || key === 'limit') {
        urlFilters[key] = parseInt(value);
      } else if (key === 'sortOrder') {
        urlFilters[key] = value as 'asc' | 'desc';
      } else {
        urlFilters[key as keyof PurchaseFilters] = value as any;
      }
    });

    setFilters(prev => ({ ...prev, ...urlFilters }));
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: Partial<PurchaseFilters>) => {
      const params = new URLSearchParams();

      Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '') {
          params.set(key, value.toString());
        }
      });

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [filters, router]
  );

  // Fetch purchases data
  const fetchData = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        setRefreshing(!showLoading);

        const response = await purchaseApi.getAllPurchases(filters);

        if (response.success) {
          setPurchases(response.data.purchases);
          setPagination(response.data.pagination);
          setStats(response.data.stats);
        } else {
          throw new Error('Failed to fetch purchases');
        }
      } catch (error) {
        console.error('Error fetching purchases:', error);
        toast.error('Failed to load purchase data. Please try again.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters]
  );

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (newFilters: Partial<PurchaseFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      updateURL(updatedFilters);
    },
    [filters, updateURL]
  );

  // Handle page changes
  const handlePageChange = useCallback(
    (page: number) => {
      handleFiltersChange({ page });
    },
    [handleFiltersChange]
  );

  // Handle purchase details view
  const handleViewDetails = useCallback((purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsDetailsModalOpen(true);
  }, []);

  // Handle status update
  const handleStatusUpdate = useCallback(
    async (purchaseId: string, newStatus: PurchaseStatus) => {
      try {
        const response = await purchaseApi.updatePurchaseStatus(purchaseId, newStatus);

        if (response.success) {
          // Update the purchase in the list
          setPurchases(prev =>
            prev.map(p => (p._id === purchaseId ? { ...p, status: newStatus } : p))
          );

          // Update selected purchase if it's the one being updated
          if (selectedPurchase?._id === purchaseId) {
            setSelectedPurchase(prev => (prev ? { ...prev, status: newStatus } : null));
          }

          toast.success(`Purchase status updated to ${newStatus}`);

          // Refresh stats
          fetchData(false);
        }
      } catch (error) {
        console.error('Error updating status:', error);
        toast(`Failed to update purchase status. Please try again.',`);
      }
    },
    [selectedPurchase, fetchData]
  );

  // Handle export
  const handleExport = useCallback(async () => {
    try {
      toast(`Your download will start shortly.`);

      const blob = await purchaseApi.exportPurchases(filters);
      const filename = `purchases_${new Date().toISOString().split('T')[0]}.csv`;
      downloadFile(blob, filename);

      toast(`Purchase data has been downloaded successfully.`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error(`Failed to export purchase data. Please try again.`);
    }
  }, [filters]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-6 w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Purchase Management</h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage all course purchases with detailed insights
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && <StatsCards stats={stats.overall} loading={loading} />}

        {/* Filters */}
        <PurchaseFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onExport={handleExport}
          totalCount={pagination.totalCount}
          loading={loading}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Left Column - Purchase Table */}
          <div className=" space-y-6">
            <PurchaseTable
              purchases={purchases}
              pagination={pagination}
              onPageChange={handlePageChange}
              onViewDetails={handleViewDetails}
              loading={loading}
            />
          </div>

          {/* Right Column - Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Distribution */}
            {stats && (
              <StatusDistributionCard
                statusDistribution={stats.statusDistribution}
                loading={loading}
              />
            )}

            {/* Recent Activity */}
            {stats && (
              <RecentActivityComponent recentActivity={stats.recentActivity} loading={loading} />
            )}

            {/* Top Courses */}
            {stats && <TopCoursesComponent topCourses={stats.topCourses} loading={loading} />}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center gap-2 hover:bg-blue-50"
                onClick={() => handleFiltersChange({ status: 'FAILED' })}
              >
                <AlertCircle className="w-6 h-6 text-red-500" />
                <span className="text-sm">Review Failed Payments</span>
                {stats && (
                  <span className="text-xs text-muted-foreground">
                    {stats.statusDistribution.FAILED.count} failed
                  </span>
                )}
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center gap-2 hover:bg-green-50"
                onClick={() =>
                  handleFiltersChange({
                    status: 'all',
                    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split('T')[0],
                    endDate: new Date().toISOString().split('T')[0],
                  })
                }
              >
                <TrendingUp className="w-6 h-6 text-green-500" />
                <span className="text-sm">Weekly Report</span>
                <span className="text-xs text-muted-foreground">Last 7 days</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center gap-2 hover:bg-purple-50"
                onClick={handleExport}
              >
                <FileDown className="w-6 h-6 text-purple-500" />
                <span className="text-sm">Export Data</span>
                <span className="text-xs text-muted-foreground">Download CSV</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Details Modal */}
        <PurchaseDetailsModal
          purchase={selectedPurchase}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedPurchase(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
};

export default PurchaseManagementPage;
