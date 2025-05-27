'use client';
// app/agents/[id]/page.tsx

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Building,
  PhoneCall,
  Hash,
  Briefcase,
  User,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useAgent } from '../_components/use-agents';

const statusColors = {
  ACTIVE: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200',
  INACTIVE: 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200',
  SUSPENDED: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200',
};

const statusIcons = {
  ACTIVE: CheckCircle,
  INACTIVE: Clock,
  SUSPENDED: Activity,
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-32" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Skeleton className="h-[600px] w-full" />
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[400px] w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Agent not found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The agent you're looking for doesn't exist or has been removed.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/agents')}
              className="bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Agents
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[agent.status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/agents')}
            className="bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agents
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/agents/${agent._id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Agent
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-t-lg">
              <div className="relative mx-auto mb-6">
                <Avatar className="w-32 h-32 ring-4 ring-white shadow-2xl">
                  <AvatarImage src={agent.profileImage} className="object-cover" />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    {getInitials(agent.name)}
                  </AvatarFallback>
                </Avatar>
                {/* Status indicator */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <StatusIcon
                    className={`w-6 h-6 ${
                      agent.status === 'ACTIVE'
                        ? 'text-emerald-500'
                        : agent.status === 'INACTIVE'
                          ? 'text-gray-500'
                          : 'text-red-500'
                    }`}
                  />
                </div>
              </div>

              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {agent.name}
              </CardTitle>

              <Badge
                variant="secondary"
                className={`${statusColors[agent.status]} text-sm font-medium px-4 py-2 rounded-full border shadow-sm`}
              >
                {agent.status}
              </Badge>

              {/* Job Info */}
              <div className="mt-4 space-y-2">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {agent.Designation}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{agent.Department}</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Information
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Personal Email
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                        {agent.email}
                      </p>
                    </div>
                  </div>

                  {agent.officeEmail && (
                    <div className="flex items-start space-x-3 p-3 bg-green-50/50 dark:bg-green-950/20 rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                        <Building className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Office Email
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                          {agent.officeEmail}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3 p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Mobile Phone
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {agent.phone}
                      </p>
                    </div>
                  </div>

                  {agent.workPhone && (
                    <div className="flex items-start space-x-3 p-3 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                        <PhoneCall className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Work Phone
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {agent.workPhone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Employee Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Employee Details
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Employee Code</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {agent.employee_code}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Joined Date</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(agent.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDateTime(agent.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-t-lg">
                <CardTitle className="flex items-center text-xl">
                  <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-xl border border-emerald-100 dark:border-emerald-800">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-emerald-600 mb-2">
                      {agent.totalSales.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Sales
                    </p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-100 dark:border-blue-800">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mb-2">
                      {Math.floor(
                        (new Date().getTime() - new Date(agent.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Days Active
                    </p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-100 dark:border-purple-800">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Hash className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-lg font-bold text-purple-600 mb-2">{agent.employee_code}</p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Employee ID
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/50 dark:to-slate-950/50 rounded-t-lg">
                <CardTitle className="flex items-center text-xl">
                  <Activity className="w-6 h-6 mr-3 text-gray-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-100 dark:border-green-800">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          Profile Updated
                        </p>
                        <span className="text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                          {formatDateTime(agent.updatedAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Agent information was last modified
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 dark:text-white">Joined Team</p>
                        <span className="text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                          {formatDate(agent.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Agent was added to the system
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-100 dark:border-purple-800">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 dark:text-white">Status Active</p>
                        <span className="text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                          Current
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Agent is currently {agent.status.toLowerCase()} in the system
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
