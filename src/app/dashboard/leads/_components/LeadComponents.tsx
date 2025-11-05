// LeadComponents.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Briefcase, GraduationCap, UserSquare, LandmarkIcon } from 'lucide-react';
import { getStatusBadgeColor, getTypeBadgeColor } from './leadUtils';
import { Lead, LeadCounts } from './types';

// Status Badge Component
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  return (
    <Badge variant="outline" className={getStatusBadgeColor(status)}>
      {status}
    </Badge>
  );
};

// Type Badge Component
export const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
  return (
    <Badge variant="outline" className={getTypeBadgeColor(type)}>
      {type.toUpperCase()}
    </Badge>
  );
};

// Lead Tabs Component
export const LeadTabs: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
  counts: LeadCounts;
}> = ({ activeTab, setActiveTab, counts }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          All{' '}
          <Badge variant="outline" className="ml-1">
            {counts.all}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="b2i" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          B2I{' '}
          <Badge variant="outline" className="ml-1">
            {counts.b2i}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="b2b" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          B2B{' '}
          <Badge variant="outline" className="ml-1">
            {counts.b2b}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="b2c" className="flex items-center gap-2">
          <UserSquare className="h-4 w-4" />
          B2C{' '}
          <Badge variant="outline" className="ml-1">
            {counts.b2c}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="b2g" className="flex items-center gap-2">
          <LandmarkIcon className="h-4 w-4" />
          B2G{' '}
          <Badge variant="outline" className="ml-1">
            {counts.b2g}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

// Empty State Component
export const EmptyState: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
        <Users className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-medium text-slate-900 mb-2">No leads found</h3>
      <p className="text-slate-600 max-w-md mx-auto">{message}</p>
    </div>
  );
};
