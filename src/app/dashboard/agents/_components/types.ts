export interface Agent {
  _id: string;
  name: string;
  email: string;
  officeEmail?: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  totalSales: number;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  Designation?: string;
  Department?: string;
  employee_code?: string;
  workPhone?: string;
  noOfSales?: number;
}

export interface CreateAgentData {
  name: string;
  email: string;
  officeEmail?: string;
  phone: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  profileImage?: string;
}

export interface UpdateAgentData extends Partial<CreateAgentData> {}

export interface AgentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  sortBy?: 'name' | 'email' | 'totalSales' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface AgentResponse {
  success: boolean;
  message: string;
  data: {
    agents: Agent[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalAgents: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface SingleAgentResponse {
  success: boolean;
  message: string;
  data: Agent;
}
