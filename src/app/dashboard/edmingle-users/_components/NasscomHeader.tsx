'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Users } from 'lucide-react';
import { toast } from 'sonner';
import { fetchEnrollments } from './enrollments';

// Replace this with your actual fetch logic
// const fetchEnrollments = async (): Promise<{ title: string }[]> => {
//   const res = await fetch('/api/enrollments'); // Adjust to your actual API route
//   if (!res.ok) throw new Error('Failed to fetch enrollments');
//   return res.json();
// };

// const TITLE_MAP = {
//   'Introduction of Cloud Computing': 'Cloud Computing',
//   'Introduction on Generative AI – Artificial intelligence and Machine Learning': 'AI & ML',
// };

export function NasscomHeader() {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['nasscom-enrollments'],
    queryFn: () => fetchEnrollments(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['nasscom-enrollments'] });
    toast.success('Stats refreshed');
  };

  const counts = {
    cloud: 0,
    ai: 0,
  };

  data?.data.enrollments.forEach(enrollment => {
    //   if (enrollment.enrollments. === 'Introduction of Cloud Computing') counts.cloud += 1;
    enrollment.enrollments.forEach(enrollment => {
      if (enrollment.courseId?.title === 'Introduction of Cloud Computing') counts.cloud += 1;
      if (
        enrollment.courseId?.title ===
        'Introduction on Generative AI – Artificial intelligence and Machine Learning'
      )
        counts.ai += 1;
    });
  });

  return (
    <div className="space-y-4 mb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">NASSCOM Enrollments</h1>
          <p className="text-muted-foreground">Live stats based on selected course titles</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-1">
          <RefreshCw className="w-4 h-4" />
          Refresh Stats
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : data?.data.pagination?.total}
            </div>
            {/* <p className="text-xs text-muted-foreground">+5.2% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Cloud Computing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : counts.cloud}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">AI & ML</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : counts.ai}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
