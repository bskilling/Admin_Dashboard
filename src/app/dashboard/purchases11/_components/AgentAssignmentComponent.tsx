import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  User,
  Phone,
  Mail,
  CheckCircle,
  X,
  Loader2,
  UserPlus,
  Filter,
  Users,
  Building,
  Badge,
} from 'lucide-react';
import { agentAPI, apiClient } from '../../agents/_components/agent';
import { Agent, AgentFilters } from '../../agents/_components/types';
import { Purchase } from './types';
import { toast } from 'sonner';

// Purchase assignment API
const purchaseAPI = {
  assignAgentToPurchase: async ({
    purchaseId,
    agentId,
  }: {
    purchaseId: string;
    agentId: string;
  }) => {
    const { data } = await apiClient.put(`/purchase-details/${purchaseId}/assign-agent`, {
      agentId,
    });
    return data;
  },
};

interface AgentAssignmentProps {
  purchase: Purchase;
  onAssignmentComplete?: () => void;
}

const AgentAssignmentComponent: React.FC<AgentAssignmentProps> = ({
  purchase,
  onAssignmentComplete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'INACTIVE' | 'SUSPENDED'>('ACTIVE');

  const queryClient = useQueryClient();

  // Fetch agents with filters
  const agentFilters: AgentFilters = {
    status: statusFilter,
    search: searchTerm,
    limit: 50, // Get more agents for selection
    sortBy: 'name',
    sortOrder: 'asc',
  };

  const {
    data: agentsData,
    isLoading: agentsLoading,
    error,
  } = useQuery({
    queryKey: ['agents', agentFilters],
    queryFn: () => agentAPI.getAgents(agentFilters),
    enabled: isOpen,
  });

  // Assignment mutation
  const assignmentMutation = useMutation({
    mutationFn: purchaseAPI.assignAgentToPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      setIsOpen(false);
      setSelectedAgent(null);
      setSearchTerm('');
      onAssignmentComplete?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error assigning agent');
    },
  });

  const agents = agentsData?.data?.agents || [];

  const handleAssign = () => {
    if (selectedAgent) {
      assignmentMutation.mutate({
        purchaseId: purchase._id,
        agentId: selectedAgent._id,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (!isOpen) {
    return (
      <div className="space-y-1">
        <div
          onClick={() => setIsOpen(true)}
          className="font-mono text-sm font-medium cursor-pointer hover:bg-blue-50 hover:text-blue-600 px-2 py-1 rounded transition-all duration-200 inline-block border-2 border-transparent hover:border-blue-200"
        >
          {purchase.agentDetails?.name ?? (
            <span className="text-gray-400 hover:text-blue-600 flex items-center space-x-1">
              <UserPlus className="w-4 h-4" />
              <span>Assign Agent</span>
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Users className="w-6 h-6 text-blue-600" />
                <span>Assign Agent</span>
              </h2>
              <p className="text-gray-600 mt-1">Select an agent to assign to this purchase</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents by name, email, department..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={e =>
                  setStatusFilter(e.target.value as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED')
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">Active Agents</option>
                <option value="INACTIVE">Inactive Agents</option>
                <option value="SUSPENDED">Suspended Agents</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Loading State */}
          {agentsLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading agents...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <X className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Agents</h3>
              <p className="text-gray-500">Please try again later</p>
            </div>
          )}

          {/* Agents Grid */}
          {!agentsLoading && !error && (
            <>
              {agents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agents.map(agent => (
                    <div
                      key={agent._id}
                      onClick={() => setSelectedAgent(agent)}
                      className={`
                        relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]
                        ${
                          selectedAgent?._id === agent._id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }
                        ${agent.status !== 'ACTIVE' ? 'opacity-75' : ''}
                      `}
                    >
                      {/* Selection Indicator */}
                      {selectedAgent?._id === agent._id && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        </div>
                      )}

                      {/* Agent Info */}
                      <div className="space-y-3">
                        {/* Avatar and Name */}
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {agent.profileImage ? (
                              <img
                                src={agent.profileImage}
                                alt={agent.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              getInitials(agent.name)
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{agent.name}</div>
                            {agent.employee_code && (
                              <div className="text-xs text-gray-500">ID: {agent.employee_code}</div>
                            )}
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-3 h-3 mr-2" />
                            <span className="truncate">{agent.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-3 h-3 mr-2" />
                            <span>{agent.phone}</span>
                          </div>
                        </div>

                        {/* Department & Designation */}
                        {(agent.Department || agent.Designation) && (
                          <div className="space-y-1">
                            {agent.Designation && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Badge className="w-3 h-3 mr-2" />
                                <span>{agent.Designation}</span>
                              </div>
                            )}
                            {agent.Department && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Building className="w-3 h-3 mr-2" />
                                <span>{agent.Department}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Status and Sales */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}
                          >
                            {agent.status}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {agent.totalSales} sales
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedAgent ? (
                <span>
                  Selected: <strong>{selectedAgent.name}</strong>
                </span>
              ) : (
                <span>Select an agent to assign</span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedAgent || assignmentMutation.isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {assignmentMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Assigning...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Assign Agent</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentAssignmentComponent;
