// components/agents/AgentCard.tsx
'use client';

import { Agent } from './types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Edit,
  Trash2,
  Phone,
  Mail,
  DollarSign,
  MoreVertical,
  Eye,
  Hash,
  PhoneCall,
  Building,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AgentCardProps {
  agent: Agent;
  onEdit: (agent: Agent) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Agent['status']) => void;
}

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800 hover:bg-green-100',
  INACTIVE: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  SUSPENDED: 'bg-red-100 text-red-800 hover:bg-red-100',
};

export default function AgentCard({ agent, onEdit, onDelete, onStatusChange }: AgentCardProps) {
  const router = useRouter();
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 hover:scale-[1.02] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-300" />

      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-14 w-14 ring-2 ring-white dark:ring-gray-800 shadow-lg">
                <AvatarImage src={agent.profileImage} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                  {getInitials(agent.name)}
                </AvatarFallback>
              </Avatar>
              {/* Online status indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                  {agent.name}
                </h3>
                <Badge
                  variant="secondary"
                  className={`${statusColors[agent.status]} text-xs font-medium px-2 py-1 rounded-full border-0 shadow-sm`}
                >
                  {agent.status}
                </Badge>
              </div>

              {/* Department & Designation */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                  {agent.Designation}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {agent.Department}
                </p>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/dashboard/agents/${agent._id}/edit`);
                }}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Agent
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/dashboard/agents/${agent._id}`);
                }}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(agent._id)}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Agent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4 relative">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center text-sm group/item hover:text-blue-600 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mr-3 group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-900/50 transition-colors">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">{agent.email}</p>
              <p className="text-xs text-gray-500">Personal Email</p>
            </div>
          </div>

          {agent.officeEmail && (
            <div className="flex items-center text-sm group/item hover:text-green-600 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center mr-3 group-hover/item:bg-green-100 dark:group-hover/item:bg-green-900/50 transition-colors">
                <Building className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {agent.officeEmail}
                </p>
                <p className="text-xs text-gray-500">Office Email</p>
              </div>
            </div>
          )}

          <div className="flex items-center text-sm group/item hover:text-purple-600 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center mr-3 group-hover/item:bg-purple-100 dark:group-hover/item:bg-purple-900/50 transition-colors">
              <Phone className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white">{agent.phone}</p>
              <p className="text-xs text-gray-500">Mobile</p>
            </div>
          </div>

          {agent.workPhone && (
            <div className="flex items-center text-sm group/item hover:text-orange-600 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center mr-3 group-hover/item:bg-orange-100 dark:group-hover/item:bg-orange-900/50 transition-colors">
                <PhoneCall className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white">{agent.workPhone}</p>
                <p className="text-xs text-gray-500">Work Phone</p>
              </div>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {agent.totalSales.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Total Sales</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <Hash className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {agent.employee_code}
                </p>
                <p className="text-xs text-gray-500">Employee ID</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4 relative">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(agent)}
            className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200 group/btn"
          >
            <Edit className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/agents/${agent._id}`)}
            className="flex-1 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all duration-200 group/btn"
          >
            <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(agent._id)}
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 group/btn"
          >
            <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
