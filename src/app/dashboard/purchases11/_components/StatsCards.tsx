'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, CreditCard, ArrowUp, ArrowDown } from 'lucide-react';
import { OverallStats } from './types';
import { formatCurrency, calculatePercentageChange } from './purchaseUtils';

interface StatsCardsProps {
  stats: OverallStats;
  previousStats?: OverallStats;
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: {
    percentage: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded mt-2 animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change && (
          <div className="flex items-center text-xs mt-2">
            {change.isPositive ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={change.isPositive ? 'text-green-600' : 'text-red-600'}>
              {change.percentage.toFixed(1)}%
            </span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StatsCards: React.FC<StatsCardsProps> = ({ stats, previousStats, loading = false }) => {
  const getChangeData = (current: number, previous?: number) => {
    if (!previous) return undefined;
    return calculatePercentageChange(current, previous);
  };

  const statsConfig = [
    {
      title: 'Total Purchases',
      value: stats.totalPurchases.toLocaleString('en-IN'),
      icon: Users,
      change: getChangeData(stats.totalPurchases, previousStats?.totalPurchases),
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      change: getChangeData(stats.totalRevenue, previousStats?.totalRevenue),
    },
    {
      title: 'Average Order Value',
      value: formatCurrency(stats.averageOrderValue),
      icon: CreditCard,
      change: getChangeData(stats.averageOrderValue, previousStats?.averageOrderValue),
    },
    {
      title: 'Growth Rate',
      value: previousStats
        ? `${calculatePercentageChange(stats.totalPurchases, previousStats.totalPurchases).percentage.toFixed(1)}%`
        : 'N/A',
      icon: TrendingUp,
      change: undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          change={stat.change}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default StatsCards;
