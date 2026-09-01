import apiClient from "./axiosClient";

export interface SignupResponse {
  user: {
    id: string;
    mobileNumber: string;
    email: string | null;
    preferredLanguage: string;
    role: string;
  };
  token: string;
}

export interface LoginResponse {
  member?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  admin?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export interface MeResponse {
  id: string;
  email?: string;
  mobileNumber?: string;
  name?: string;
  role: string;
  preferredLanguage?: string;
  kycStatus?: string;
}

export const authApi = {
  sendOtp: async (email: string, purpose: string = "signup"): Promise<{ message: string }> => {
    const { data } = await apiClient.post("/auth/send-otp", { email, purpose });
    return data;
  },

  verifyOtp: async (email: string, code: string, purpose: string = "signup"): Promise<{ verified: boolean }> => {
    const { data } = await apiClient.post("/auth/verify-otp", { email, code, purpose });
    return data;
  },

  signup: async (mobileNumber: string, email: string): Promise<SignupResponse> => {
    const { data } = await apiClient.post("/auth/signup", { mobileNumber, email });
    return data;
  },

  teamLogin: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await apiClient.post("/team/login", { email, password });
    return data;
  },

  adminLogin: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await apiClient.post("/admin/login", { email, password });
    return data;
  },

  getMe: async (): Promise<MeResponse> => {
    const { data } = await apiClient.get("/auth/me");
    return data;
  },
};
