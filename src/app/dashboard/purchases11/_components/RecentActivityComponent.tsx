'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import { RecentActivity } from './types';
import { formatCurrency, formatDateShort, calculatePercentageChange } from './purchaseUtils';

interface RecentActivityProps {
  recentActivity: RecentActivity[];
  loading?: boolean;
}

interface ActivityItemProps {
  activity: RecentActivity;
  previousActivity?: RecentActivity;
  maxRevenue: number;
}

const ActivityItemSkeleton = () => (
  <div className="flex items-center justify-between p-3 rounded-lg border">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="space-y-2">
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-16 h-3 bg-gray-100 rounded animate-pulse"></div>
      </div>
    </div>
    <div className="text-right space-y-2">
      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-12 h-3 bg-gray-100 rounded animate-pulse"></div>
    </div>
  </div>
);

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, previousActivity, maxRevenue }) => {
  const progressPercentage = maxRevenue > 0 ? (activity.revenue / maxRevenue) * 100 : 0;

  const getChangeIndicator = () => {
    if (!previousActivity) return null;

    const change = calculatePercentageChange(activity.revenue, previousActivity.revenue);

    if (change.percentage < 1) {
      return (
        <div className="flex items-center text-xs text-gray-500">
          <Minus className="w-3 h-3 mr-1" />
          <span>No change</span>
        </div>
      );
    }

    return (
      <div
        className={`flex items-center text-xs ${
          change.isPositive ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {change.isPositive ? (
          <ArrowUp className="w-3 h-3 mr-1" />
        ) : (
          <ArrowDown className="w-3 h-3 mr-1" />
        )}
        <span>{change.percentage.toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="group hover:bg-accent/50 transition-colors rounded-lg">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            {activity.count > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                {activity.count}
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            <div className="font-medium text-sm">{formatDateShort(activity._id)}</div>
            <div className="text-xs text-muted-foreground">
              {activity.count} purchase{activity.count !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <div className="text-right space-y-1">
          <div className="font-semibold text-sm">{formatCurrency(activity.revenue)}</div>
          {getChangeIndicator()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-3 pb-3">
        <Progress value={progressPercentage} className="h-1.5" />
      </div>
    </div>
  );
};

const RecentActivityComponent: React.FC<RecentActivityProps> = ({
  recentActivity,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Purchase activity in the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <ActivityItemSkeleton key={index} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recentActivity || recentActivity.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Purchase activity in the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">No purchases found in the last 7 days</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxRevenue = Math.max(...recentActivity.map(item => item.revenue));
  const totalRevenue = recentActivity.reduce((sum, item) => sum + item.revenue, 0);
  const totalPurchases = recentActivity.reduce((sum, item) => sum + item.count, 0);

  // Calculate trend
  const firstHalf = recentActivity.slice(0, Math.ceil(recentActivity.length / 2));
  const secondHalf = recentActivity.slice(Math.ceil(recentActivity.length / 2));

  const firstHalfRevenue = firstHalf.reduce((sum, item) => sum + item.revenue, 0);
  const secondHalfRevenue = secondHalf.reduce((sum, item) => sum + item.revenue, 0);

  const trend = calculatePercentageChange(secondHalfRevenue, firstHalfRevenue);

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Recent Activity
          </div>
          <div
            className={`flex items-center gap-1 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trend.percentage.toFixed(1)}%</span>
          </div>
        </CardTitle>
        <CardDescription>Purchase activity in the last 7 days</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{totalPurchases}</div>
            <div className="text-xs text-muted-foreground">Total Purchases</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-2">
          {recentActivity.map((activity, index) => (
            <ActivityItem
              key={activity._id}
              activity={activity}
              previousActivity={recentActivity[index + 1]}
              maxRevenue={maxRevenue}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Average: {formatCurrency(totalRevenue / recentActivity.length)} per day
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityComponent;
