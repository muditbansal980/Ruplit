import apiClient from "./axiosClient";

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
};
