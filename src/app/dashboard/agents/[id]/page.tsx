'use client';
// app/agents/[id]/page.tsx

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit, Mail, Phone, DollarSign, Calendar, Building } from 'lucide-react';
import { useAgent } from '../_components/use-agents';

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800 hover:bg-green-100',
  INACTIVE: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  SUSPENDED: 'bg-red-100 text-red-800 hover:bg-red-100',
};

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data, isLoading, error } = useAgent(params.id as string);

  const agent = data?.data;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-10 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[400px] w-full" />
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Agent not found</p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/agents')}
            className="mt-4"
          >
            Back to Agents
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" onClick={() => router.push('/dashboard/agents')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Agents
        </Button>
        <Button onClick={() => router.push(`/dashboard/agents/${agent._id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center pb-6">
            <Avatar className="w-32 h-32 mx-auto mb-4">
              <AvatarImage src={agent.profileImage} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {getInitials(agent.name)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl mb-2">{agent.name}</CardTitle>
            <Badge variant="secondary" className={`${statusColors[agent.status]} text-sm`}>
              {agent.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-muted-foreground break-all">{agent.email}</p>
                </div>
              </div>

              {agent.officeEmail && (
                <div className="flex items-start space-x-3">
                  <Building className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Office Email</p>
                    <p className="text-sm text-muted-foreground break-all">{agent.officeEmail}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-muted-foreground">{agent.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Joined</p>
                  <p className="text-sm text-muted-foreground">{formatDate(agent.createdAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {agent.totalSales.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                </div>

                <div className="text-center p-6 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    {Math.floor(
                      (new Date().getTime() - new Date(agent.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Days Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Agent profile updated</p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {formatDate(agent.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Agent joined the team</p>
                    <p className="text-xs text-muted-foreground">{formatDate(agent.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
