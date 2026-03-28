'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatusDistribution } from './types';
import { formatCurrency, getStatusConfig } from './purchaseUtils';

interface StatusDistributionProps {
  statusDistribution: StatusDistribution;
  loading?: boolean;
}

interface StatusItemProps {
  status: keyof StatusDistribution;
  data: StatusDistribution[keyof StatusDistribution];
  totalCount: number;
}

const StatusItem: React.FC<StatusItemProps> = ({ status, data, totalCount }) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${config.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant={config.variant} className="text-xs">
              {config.label}
            </Badge>
            <span className="text-sm font-medium">{data.count} purchases</span>
          </div>
          <div className="text-sm text-muted-foreground">{formatCurrency(data.totalAmount)}</div>
        </div>
      </div>

      <div className="text-right space-y-2">
        <div className="text-lg font-bold">{data.percentage.toFixed(1)}%</div>
        <div className="w-20">
          <Progress
            value={data.percentage}
            className="h-2"
            // Custom progress bar color based on status
            style={
              {
                '--progress-background': config.bgColor.replace('bg-', ''),
              } as React.CSSProperties
            }
          />
        </div>
      </div>
    </div>
  );
};

const StatusDistributionCard: React.FC<StatusDistributionProps> = ({
  statusDistribution,
  loading = false,
}) => {
  const totalCount = Object.values(statusDistribution).reduce((sum, item) => sum + item.count, 0);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
          <CardDescription>Breakdown of purchase statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(index => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-16 h-3 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="w-12 h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-20 h-2 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusOrder: (keyof StatusDistribution)[] = ['SUCCESS', 'PENDING', 'FAILED'];

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Status Distribution
          <span className="text-sm font-normal text-muted-foreground">{totalCount} total</span>
        </CardTitle>
        <CardDescription>
          Breakdown of purchase statuses and their revenue contribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusOrder.map(status => (
            <StatusItem
              key={status}
              status={status}
              data={statusDistribution[status]}
              totalCount={totalCount}
            />
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Success Rate</div>
              <div className="font-semibold text-green-600">
                {statusDistribution.SUCCESS.percentage.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Failure Rate</div>
              <div className="font-semibold text-red-600">
                {statusDistribution.FAILED.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusDistributionCard;
