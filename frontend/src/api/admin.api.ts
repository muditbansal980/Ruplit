import apiClient from "./axiosClient";

export interface User {
  id: string;
  email: string | null;
  mobileNumber: string;
  preferredLanguage: string;
  kycStatus: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    lentExpenses: number;
    borrowedExpenses: number;
  };
}

export interface PaginatedUsers {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserDetail extends User {
  lentExpenses: any[];
  borrowedExpenses: any[];
  kycRequests: any[];
  stats: {
    totalLent: number;
    totalBorrowed: number;
    totalExpenses: number;
    kycRequests: number;
  };
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  emailSent: boolean;
  createdAt: string;
  lender: {
    id: string;
    email: string | null;
    mobileNumber: string;
  };
  borrower: {
    id: string;
    email: string | null;
    mobileNumber: string;
  };
}

export interface PaginatedExpenses {
  expenses: Expense[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: string;
  actorId: string | null;
  actorRole: string;
  details: any;
  createdAt: string;
}

export interface TeamStats {
  id: string;
  name: string;
  email: string;
  accepted: number;
  completed: number;
  rejected: number;
}

export const adminApi = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    kycStatus?: string;
  }): Promise<PaginatedUsers> => {
    const { data } = await apiClient.get("/admin/users", { params });
    return data;
  },

  getUserById: async (id: string): Promise<UserDetail> => {
    const { data } = await apiClient.get(`/admin/users/${id}`);
    return data;
  },

  getActivities: async (limit?: number): Promise<Activity[]> => {
    const { data } = await apiClient.get("/admin/activities", {
      params: limit ? { limit } : undefined,
    });
    return data;
  },

  getTeamStats: async (): Promise<TeamStats[]> => {
    const { data } = await apiClient.get("/admin/team-stats");
    return data;
  },

  getAllKycRequests: async (): Promise<any[]> => {
    const { data } = await apiClient.get("/admin/kyc-requests");
    return data;
  },

  getAllExpenses: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedExpenses> => {
    const { data } = await apiClient.get("/admin/expenses", { params });
    return data;
  },

  getAllTeamMembers: async (): Promise<TeamMember[]> => {
    const { data } = await apiClient.get("/admin/team-members");
    return data;
  },

  addTeamMember: async (payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<TeamMember> => {
    const { data } = await apiClient.post("/admin/team-members", payload);
    return data;
  },
};
