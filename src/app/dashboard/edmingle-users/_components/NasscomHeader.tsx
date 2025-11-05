'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, RefreshCw, Users } from 'lucide-react';
import { toast } from 'sonner';
import { fetchEnrollments } from './enrollments';
import { useRouter, useSearchParams } from 'next/navigation';

export function NasscomHeader() {
  const CLOUD_ID = '67f4f4510547cfbc81ceb9f6';
  const AI_ID = '67f4f46a0547cfbc81cebceb';

  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['nasscom-enrollments'],
    queryFn: () => fetchEnrollments(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['nasscom-enrollments'] });
    toast.success('Stats refreshed');
  };

  const handleFilterClick = (key: string, value: string | undefined | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === 'All') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  const courseFilter = searchParams.get('course');

  const counts = {
    cloud: 0,
    ai: 0,
  };

  data?.data.enrollments.forEach(group => {
    group.enrollments.forEach(enrollment => {
      if (enrollment.courseId?._id === CLOUD_ID) counts.cloud += 1;
      if (enrollment.courseId?._id === AI_ID) counts.ai += 1;
    });
  });

  return (
    <div className="space-y-4 mb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">NASSCOM Enrollments</h1>
          <p className="text-muted-foreground">Live stats filtered by course</p>
        </div>
        <Button onClick={refreshData} variant="outline" className="gap-1">
          <RefreshCw className="w-4 h-4" />
          Refresh Stats
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <Card className="relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : data?.data.pagination?.total}
            </div>
          </CardContent>
        </Card>

        {/* Cloud */}
        <Card
          onClick={() => handleFilterClick('course', CLOUD_ID)}
          className={`cursor-pointer rounded-2xl shadow p-4 relative ${
            courseFilter === CLOUD_ID ? 'bg-blue-100 border border-blue-400' : ''
          }`}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium">Cloud Computing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : counts.cloud}</div>
            {courseFilter === CLOUD_ID && (
              <Check className="absolute top-3 right-3 text-blue-500 w-5 h-5" />
            )}
          </CardContent>
        </Card>

        {/* AI & ML */}
        <Card
          onClick={() => handleFilterClick('course', AI_ID)}
          className={`cursor-pointer rounded-2xl shadow p-4 relative ${
            courseFilter === AI_ID ? 'bg-purple-100 border border-purple-400' : ''
          }`}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium">AI & ML</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : counts.ai}</div>
            {courseFilter === AI_ID && (
              <Check className="absolute top-3 right-3 text-purple-500 w-5 h-5" />
            )}
          </CardContent>
        </Card>

        {/* All (Clear Filter) */}
        <Card
          onClick={() => handleFilterClick('course', undefined)}
          className={`cursor-pointer rounded-2xl shadow p-4 relative ${
            !courseFilter ? 'bg-green-100 border border-green-400' : ''
          }`}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium">All Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : counts.cloud + counts.ai}</div>
            {!courseFilter && <Check className="absolute top-3 right-3 text-green-500 w-5 h-5" />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
