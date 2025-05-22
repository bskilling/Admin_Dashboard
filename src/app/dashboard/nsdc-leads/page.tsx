// app/nsdc-lead/page.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getZohoNsdcLeads, pushLeadsToZoho } from './_components/service';
import { DataTable } from './_components/leads.table';
import { StatsHeader } from './_components/stats-header';
import { PaginationControls } from './_components/pagination-controls';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NsdcLeadPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const filters = {
    course: searchParams.get('course') || undefined,
    status: searchParams.get('status') || undefined,
    zohoResponseCode: searchParams.get('zohoResponseCode') || undefined,
  };
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['nsdcLeads', page, limit, filters],
    queryFn: () => getZohoNsdcLeads({ page, limit, ...filters }),
    staleTime: 60 * 60 * 1000,
  });

  const { mutate: pushToZoho } = useMutation({
    mutationFn: pushLeadsToZoho,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nsdcLeads'] });
      toast.success('Leads pushed to Zoho CRM successfully');
    },
    onError: error => {
      toast.error('Failed to push leads to Zoho CRM');
      console.error('Push to Zoho error:', error);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading leads</div>;

  const leads = data?.data?.leads || [];
  const total = data?.data?.total || 0;

  return (
    <div className="container mx-auto py-10 pt-0 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">NSDC Leads</h1>
        <button
          onClick={() => pushToZoho()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Push to Zoho CRM
        </button>
      </div>

      <StatsHeader />

      <Button
        onClick={() => refetch()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Refresh Leads
      </Button>
      <DataTable data={leads} />
      <PaginationControls page={page} limit={limit} total={total} />
    </div>
  );
}
