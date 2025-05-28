'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCw, AlertCircle, TrendingUp, FileDown, Settings } from 'lucide-react';

// Import components
import StatsCards from './_components/StatsCards';
// import StatusDistributionCard from './_components/StatusDistributionCard';
// import PurchaseDetailsModal from './_components/PurchaseDetailsModal';
import RecentActivityComponent from './_components/RecentActivityComponent';
import TopCoursesComponent from './_components/TopCoursesComponent';

// Import types and utilities
import { Purchase, PurchaseFilters, PurchaseStatus } from './_components/types';
import { downloadFile } from './_components/purchaseUtils';
import { purchaseApi } from './_components/purchaseApi';
import PurchaseFiltersComponent from './_components/PurchaseFilters';
import PurchaseTable from './_components/PurchaseTable';

const DEFAULT_FILTERS: PurchaseFilters = {
  page: 1,
  limit: 10,
  status: 'all',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  startDate: '',
  endDate: '',
};

const PurchaseManagementPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // State management
  const [filters, setFilters] = useState<PurchaseFilters>(DEFAULT_FILTERS);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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

    if (Object.keys(urlFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...urlFilters }));
    }
  }, [searchParams]);

  // Fetch purchases with React Query
  const {
    data: purchaseData,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['purchases', filters],
    queryFn: () => purchaseApi.getAllPurchases(filters),
    select: response => (response.success ? response.data : null),
    throwOnError: error => {
      console.error('Error fetching purchases:', error);
      toast.error('Failed to load purchase data. Please try again.');
      return false;
    },
  });

  // Update purchase status mutation
  const statusMutation = useMutation({
    mutationFn: ({ purchaseId, newStatus }: { purchaseId: string; newStatus: PurchaseStatus }) =>
      purchaseApi.updatePurchaseStatus(purchaseId, newStatus),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Update cache optimistically
        queryClient.setQueryData(['purchases', filters], (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            purchases: oldData.purchases.map((p: Purchase) =>
              p._id === variables.purchaseId ? { ...p, status: variables.newStatus } : p
            ),
          };
        });

        // Update selected purchase if it's the one being updated
        if (selectedPurchase?._id === variables.purchaseId) {
          setSelectedPurchase(prev => (prev ? { ...prev, status: variables.newStatus } : null));
        }

        toast.success(`Purchase status updated to ${variables.newStatus}`);

        // Refetch to update stats
        refetch();
      }
    },
    onError: error => {
      console.error('Error updating status:', error);
      toast.error('Failed to update purchase status. Please try again.');
    },
  });

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: () => purchaseApi.exportPurchases(filters),
    onMutate: () => {
      toast.info('Your download will start shortly.');
    },
    onSuccess: blob => {
      const filename = `purchases_${new Date().toISOString().split('T')[0]}.csv`;
      downloadFile(blob, filename);
      toast.success('Purchase data has been downloaded successfully.');
    },
    onError: error => {
      console.error('Error exporting data:', error);
      toast.error('Failed to export purchase data. Please try again.');
    },
  });

  // Update URL when filters change
  const updateFilters = (newFilters: Partial<PurchaseFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Update URL
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value.toString());
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Event handlers
  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  const handleViewDetails = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsDetailsModalOpen(true);
  };

  const handleStatusUpdate = (purchaseId: string, newStatus: PurchaseStatus) => {
    statusMutation.mutate({ purchaseId, newStatus });
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleRefresh = () => {
    refetch();
  };

  const closeModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedPurchase(null);
  };

  // Quick action handlers
  const handleFailedPayments = () => {
    updateFilters({ status: 'FAILED' });
  };

  const handleWeeklyReport = () => {
    updateFilters({
      status: 'all',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    });
  };

  // Extract data
  const purchases = purchaseData?.purchases || [];
  const pagination = purchaseData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  };
  const stats = purchaseData?.stats || null;

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
              disabled={isRefetching}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exportMutation.isPending}
              className="flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              {exportMutation.isPending ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
        {/* Stats Cards */}
        {stats && <StatsCards stats={stats.overall} loading={isLoading} />}
        {/* Filters */}
        <PurchaseFiltersComponent
          filters={filters}
          onFiltersChange={updateFilters}
          onExport={handleExport}
          totalCount={pagination.totalCount}
          loading={isLoading}
        />
        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6">
          {/* Purchase Table */}
          <div className="space-y-6">
            <PurchaseTable
              purchases={purchases}
              pagination={pagination}
              onPageChange={handlePageChange}
              onViewDetails={handleViewDetails}
              loading={isLoading}
            />
          </div>
          asasasasasaasas
          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {stats && (
              <>
                {/* <StatusDistributionCard
                  statusDistribution={stats.statusDistribution}
                  loading={isLoading}
                /> */}
                <RecentActivityComponent
                  recentActivity={stats.recentActivity}
                  loading={isLoading}
                />
                <TopCoursesComponent topCourses={stats.topCourses} loading={isLoading} />
              </>
            )}
          </div>
        </div>
        asasassaasasasasasasaas
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
                onClick={handleFailedPayments}
              >
                <AlertCircle className="w-6 h-6 text-red-500" />
                <span className="text-sm">Review Failed Payments</span>
                {stats && (
                  <span className="text-xs text-muted-foreground">
                    {stats.statusDistribution.FAILED?.count || 0} failed
                  </span>
                )}
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center gap-2 hover:bg-green-50"
                onClick={handleWeeklyReport}
              >
                <TrendingUp className="w-6 h-6 text-green-500" />
                <span className="text-sm">Weekly Report</span>
                <span className="text-xs text-muted-foreground">Last 7 days</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center gap-2 hover:bg-purple-50"
                onClick={handleExport}
                disabled={exportMutation.isPending}
              >
                <FileDown className="w-6 h-6 text-purple-500" />
                <span className="text-sm">
                  {exportMutation.isPending ? 'Exporting...' : 'Export Data'}
                </span>
                <span className="text-xs text-muted-foreground">Download CSV</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Purchase Details Modal */}
        {/* <PurchaseDetailsModal
          purchase={selectedPurchase}
          isOpen={isDetailsModalOpen}
          onClose={closeModal}
          // onStatusUpdate={handleStatusUpdate}
        /> */}
      </div>
    </div>
  );
};

export default PurchaseManagementPage;
