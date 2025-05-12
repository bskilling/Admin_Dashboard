// app/admin/emi-leads/page.tsx
import { Suspense } from 'react';
import { EmiLeadsTable } from './_components/emi-leads-table';
import { EmiLeadsTableSkeleton } from './_components/emi-leads-table-skeleton';
import { EmiLeadsHeader } from './_components/emi-leads-header';

export default function EmiLeadsPage({
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
      <EmiLeadsHeader />

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
