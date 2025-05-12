// app/nsdc-lead/page.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getZohoNsdcLeads, pushLeadsToZoho } from './_components/service';
import { DataTable } from './_components/leads.table';

export default function NsdcLeadPage() {
  const queryClient = useQueryClient();

  // Fetch leads data
  const {
    data: leads,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['nsdcLeads'],
    queryFn: getZohoNsdcLeads,
  });

  // Mutation for pushing leads to Zoho
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

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">NSDC Leads</h1>
        <button
          onClick={() => pushToZoho()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Push to Zoho CRM
        </button>
      </div>

      {/* <FilterControls /> */}
      {/* <DataTable data={leads || []} /> */}
    </div>
  );
}
