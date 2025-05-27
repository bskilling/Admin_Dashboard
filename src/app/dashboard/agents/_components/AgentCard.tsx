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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, Phone, Mail, DollarSign, MoreVertical } from 'lucide-react';
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
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={agent.profileImage} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(agent.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-none">{agent.name}</h3>
              <Badge variant="secondary" className={statusColors[agent.status]}>
                {agent.status}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  //   onEdit(agent);
                  router.push(`/dashboard/agents/${agent._id}/edit`);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onDelete(agent._id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{agent.email}</span>
        </div>

        {agent.officeEmail && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{agent.officeEmail}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-muted-foreground">
          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{agent.phone}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="font-medium">Sales: {agent.totalSales.toLocaleString()}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex w-full justify-between">
          <Button variant="outline" size="sm" onClick={() => onEdit(agent)} className="flex-1 mr-2">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(agent._id)}
            className="flex-1 ml-2"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
