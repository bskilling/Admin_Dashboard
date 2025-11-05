// app/nsdc-lead/_components/stats-header.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronDownIcon, ChevronUpIcon, FilterX } from 'lucide-react';

interface StatItem {
  _id: string;
  count: number;
}

const bgColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
];

export const StatsHeader = () => {
  const [courseStats, setCourseStats] = useState<StatItem[]>([]);
  const [zohoCodeStats, setZohoCodeStats] = useState<StatItem[]>([]);
  const [statusStats, setStatusStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showZoho, setShowZoho] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchStats = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/nsdc-lead/stats');
      const json = await res.json();
      if (json.success) {
        setCourseStats(json.data.courseStats);
        setZohoCodeStats(json.data.zohoCodeStats);
        setStatusStats(json.data.statusStats);
      }
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);
  const handleFilterClick = (key: string, value: string | undefined | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'All' || value === undefined || value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`?${params.toString()}`);
  };
  const clearFilters = () => {
    router.push('?');
  };

  if (loading) {
    return <div className="text-center py-4">Loading stats...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={fetchStats} variant={'outline'}>
          Refresh Stats
        </Button>
        <Button variant="ghost" onClick={() => setShowZoho(!showZoho)}>
          All Stats{' '}
          {showZoho ? (
            <ChevronUpIcon className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDownIcon className="ml-1 h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {/* Clear Filters Card */}
        <Card
          onClick={clearFilters}
          className="cursor-pointer rounded-2xl shadow p-4 bg-red-100 hover:bg-red-200 transition"
        >
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-sm mb-1">Filters</div>
              <div className="font-semibold text-lg">Clear All</div>
            </div>
            <FilterX className="w-5 h-5 text-red-500" />
          </CardContent>
        </Card>

        {/* 'All Courses' card */}
        <Card
          onClick={() => handleFilterClick('course', undefined)}
          className={`cursor-pointer rounded-2xl shadow p-4 relative ${bgColors[3 % bgColors.length]}`}
        >
          <CardContent>
            <div className="text-sm mb-1">Course</div>
            <div className="font-semibold text-lg truncate">All</div>
            <div className="text-xl font-bold">
              {statusStats.reduce((total, stat) => total + stat.count, 0)}
            </div>
            {!searchParams.get('course') && (
              <Check className="absolute top-2 right-2 w-5 h-5 text-green-600" />
            )}
          </CardContent>
        </Card>

        {/* Course cards */}
        {courseStats.map(({ _id, count }, i) => (
          <Card
            key={_id}
            onClick={() => {
              if (searchParams.get('course') === _id) {
                handleFilterClick('course', undefined);
                return;
              }
              handleFilterClick('course', _id);
            }}
            className={`cursor-pointer rounded-2xl shadow p-4 relative ${bgColors[i % bgColors.length]}`}
          >
            <CardContent>
              <div className="text-sm mb-1">Course</div>
              <div className="font-semibold text-lg truncate">
                {_id.includes('Generative')
                  ? 'Generative AI'
                  : _id.includes('Cloud')
                    ? 'Cloud Computing'
                    : _id}
              </div>
              <div className="text-xl font-bold">{count}</div>
              {searchParams.get('course') === _id && (
                <Check className="absolute top-2 right-2 w-5 h-5 text-green-600" />
              )}
            </CardContent>
          </Card>
        ))}

        {/* Status and Zoho filters */}
        {showZoho && (
          <>
            {statusStats.map(({ _id, count }, i) => (
              <Card
                key={_id}
                onClick={() => {
                  if (searchParams.get('status') === _id) {
                    handleFilterClick('status', undefined);
                    return;
                  }
                  handleFilterClick('status', _id);
                }}
                className={`cursor-pointer rounded-2xl shadow p-4 relative ${bgColors[(i + 4) % bgColors.length]}`}
              >
                <CardContent>
                  <div className="text-sm mb-1">Status</div>
                  <div className="font-semibold text-lg truncate capitalize">{_id}</div>
                  <div className="text-xl font-bold">{count}</div>
                  {searchParams.get('status') === _id && (
                    <Check className="absolute top-2 right-2 w-5 h-5 text-green-600" />
                  )}
                </CardContent>
              </Card>
            ))}
            {zohoCodeStats.map(({ _id, count }, i) => (
              <Card
                key={_id}
                onClick={() => {
                  if (searchParams.get('zohoResponseCode') === _id) {
                    handleFilterClick('zohoResponseCode', undefined);
                    return;
                  }
                  handleFilterClick('zohoResponseCode', _id);
                }}
                className={`cursor-pointer rounded-2xl shadow p-4 relative ${bgColors[(i + 2) % bgColors.length]}`}
              >
                <CardContent>
                  <div className="text-sm mb-1">Zoho Response</div>
                  <div className="font-semibold text-lg truncate">{_id}</div>
                  <div className="text-xl font-bold">{count}</div>
                  {searchParams.get('zohoResponseCode') === _id && (
                    <Check className="absolute top-2 right-2 w-5 h-5 text-green-600" />
                  )}
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
