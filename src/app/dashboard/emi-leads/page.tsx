// app/admin/emi-leads/page.tsx
import { Suspense } from 'react';
import { EmiLeadsTable } from './_components/emi-leads-table';
import { EmiLeadsTableSkeleton } from './_components/emi-leads-table-skeleton';
import { EmiLeadsHeader } from './_components/emi-leads-header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default async function EmiLeadsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    sort?: string;
    order?: string;
    startDate?: string;
    endDate?: string;
    courseType?: string;
    categoryId?: string;
  };
}) {
  let data: any = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emi-leads`, {
      cache: 'no-store', // disables caching to always fetch latest data
    });

    if (!res.ok) {
      throw new Error('Failed to fetch EMI leads');
    }
    let res1 = await res.json();
    data = res1.data;
    console.log(data, 'hahahaah datat dataa');
  } catch (error) {
    console.error(error);
    return <div>Error loading EMI leads</div>;
  }

  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ['emiLeads'],
  //   queryFn: async () => {
  //     const params = new URLSearchParams();
  //     params.append('page', page.toString());
  //     params.append('limit', limit.toString());

  //     if (search) params.append('search', search);
  //     if (status) params.append('status', status);
  //     if (sort) params.append('sort', sort);
  //     if (order) params.append('order', order);
  //     if (startDate) params.append('startDate', startDate);
  //     if (endDate) params.append('endDate', endDate);
  //     if (courseType) params.append('courseType', courseType);
  //     if (categoryId) params.append('categoryId', categoryId);

  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emi-leads?${params.toString()}`
  //     );
  //     return response.data;
  //   },
  // });
  // Parse query parameters with defaults
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;
  const search = searchParams.search || '';
  const status = searchParams.status || '';
  const sort = searchParams.sort || 'createdAt';
  const order = searchParams.order || 'desc';
  const startDate = searchParams.startDate || '';
  const endDate = searchParams.endDate || '';
  const courseType = searchParams.courseType || '';
  const categoryId = searchParams.categoryId || '';

  return (
    <div className="container mx-auto py-6 space-y-6">
      <EmiLeadsHeader
        in_conversion={
          data?.emiForms?.filter((lead: any) => lead.status === 'In-conversation').length || 0
        }
        newLeads={data?.emiForms?.filter((lead: any) => lead.status === 'NEW').length || 0}
        total={data?.emiForms?.length || 0}
        converted={data?.emiForms?.filter((lead: any) => lead.status === 'Converted').length || 0}
      />

      <Suspense fallback={<EmiLeadsTableSkeleton />}>
        <EmiLeadsTable
          page={page}
          limit={limit}
          search={search}
          status={status}
          sort={sort}
          order={order}
          startDate={startDate}
          endDate={endDate}
          courseType={courseType}
          categoryId={categoryId}
        />
      </Suspense>
    </div>
  );
}
