// lib/api/axios.ts
import axios from 'axios';
import {
  Agent,
  CreateAgentData,
  UpdateAgentData,
  AgentFilters,
  AgentResponse,
  SingleAgentResponse,
} from './types';
const API_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001') + '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add auth token if available
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      // router.push('/login');
    }
    return Promise.reject(error);
  }
);

// lib/api/agents.ts

export const agentAPI = {
  getAgents: async (filters: AgentFilters = {}): Promise<AgentResponse> => {
    const { data } = await apiClient.get('/agents', { params: filters });
    return data;
  },

  getAgent: async (id: string): Promise<SingleAgentResponse> => {
    const { data } = await apiClient.get(`/agents/${id}`);
    return data;
  },

  createAgent: async (agentData: CreateAgentData): Promise<SingleAgentResponse> => {
    const { data } = await apiClient.post('/agents', agentData);
    return data;
  },

  updateAgent: async ({
    id,
    data: agentData,
  }: {
    id: string;
    data: UpdateAgentData;
  }): Promise<SingleAgentResponse> => {
    const { data } = await apiClient.put(`/agents/${id}`, agentData);
    return data;
  },

  deleteAgent: async (id: string): Promise<SingleAgentResponse> => {
    const { data } = await apiClient.delete(`/agents/${id}`);
    return data;
  },

  updateAgentStatus: async ({
    id,
    status,
  }: {
    id: string;
    status: Agent['status'];
  }): Promise<SingleAgentResponse> => {
    const { data } = await apiClient.patch(`/agents/${id}/status`, { status });
    return data;
  },
};

// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});
