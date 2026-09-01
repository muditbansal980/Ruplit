import apiClient from "./axiosClient";

export interface KycRequest {
  id: string;
  userId: string | null;
  mobileNumber: string;
  mode: "ASSISTED" | "SELF";
  status: "PENDING" | "IN_REVIEW" | "VERIFIED" | "REJECTED";
  aadharImageUrl: string | null;
  assignedTeamMemberId: string | null;
  createdAt: string;
  user?: {
    id: string;
    mobileNumber: string;
    email: string | null;
  };
  assignedTeamMember?: {
    id: string;
    name: string;
    email: string;
  };
}

export const kycApi = {
  createRequest: async (mode: "ASSISTED" | "SELF", mobileNumber?: string): Promise<KycRequest> => {
    const { data } = await apiClient.post("/kyc/request", { mode, mobileNumber });
    return data;
  },

  uploadAadhar: async (requestId: string, file: File): Promise<KycRequest> => {
    const formData = new FormData();
    formData.append("aadhar", file);
    const { data } = await apiClient.post(`/kyc/${requestId}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  getLiveRequests: async (): Promise<KycRequest[]> => {
    const { data } = await apiClient.get("/kyc/live");
    return data;
  },

  acceptRequest: async (requestId: string): Promise<KycRequest> => {
    const { data } = await apiClient.post(`/kyc/${requestId}/accept`);
    return data;
  },

  rejectRequest: async (requestId: string): Promise<KycRequest> => {
    const { data } = await apiClient.post(`/kyc/${requestId}/reject`);
    return data;
  },

  getMyAccepted: async (): Promise<KycRequest[]> => {
    const { data } = await apiClient.get("/kyc/mine");
    return data;
  },

  getReviewQueue: async (): Promise<KycRequest[]> => {
    const { data } = await apiClient.get("/kyc/review-queue");
    return data;
  },

  verifyRequest: async (requestId: string): Promise<KycRequest> => {
    const { data } = await apiClient.post(`/kyc/${requestId}/verify`);
    return data;
  },

  getUserKycStatus: async (userId: string): Promise<any> => {
    const { data } = await apiClient.get(`/kyc/status/${userId}`);
    return data;
  },
};
