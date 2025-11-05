// hooks/use-agents.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Agent, AgentFilters, CreateAgentData, UpdateAgentData } from './types';
import { agentAPI } from './agent';
import { toast } from 'sonner';

// Query Keys
export const agentKeys = {
  all: ['agents'] as const,
  lists: () => [...agentKeys.all, 'list'] as const,
  list: (filters: AgentFilters) => [...agentKeys.lists(), filters] as const,
  details: () => [...agentKeys.all, 'detail'] as const,
  detail: (id: string) => [...agentKeys.details(), id] as const,
};

// Get Agents Query
export const useAgents = (filters: AgentFilters = {}) => {
  return useQuery({
    queryKey: agentKeys.list(filters),
    queryFn: () => agentAPI.getAgents(filters),
  });
};

// Get Single Agent Query
export const useAgent = (id: string) => {
  return useQuery({
    queryKey: agentKeys.detail(id),
    queryFn: () => agentAPI.getAgent(id),
    enabled: !!id,
  });
};

// Create Agent Mutation
export const useCreateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAgentData) => agentAPI.createAgent(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      toast.success(`Agent created successfully. ID: ${data.data._id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error creating agent');
    },
  });
};

// Update Agent Mutation
export const useUpdateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAgentData }) =>
      agentAPI.updateAgent({ id, data }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.id) });
      toast.success(`Agent updated successfully. ID: ${data.data?._id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error updating agent');
    },
  });
};

// Delete Agent Mutation
export const useDeleteAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => agentAPI.deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      toast.success('Agent deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error deleting agent');
    },
  });
};

// Update Agent Status Mutation
export const useUpdateAgentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Agent['status'] }) =>
      agentAPI.updateAgentStatus({ id, status }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.id) });
      toast.success(`Agent status updated successfully. ID: ${data.data?._id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error updating agent status');
    },
  });
};
