import apiClient from "./axiosClient";

export interface Friend {
  id: string;
  ownerId: string;
  friendId: string;
  createdAt: string;
  friend: {
    id: string;
    mobileNumber: string;
    email: string | null;
    preferredLanguage: string;
  };
}

export interface Expense {
  id: string;
  lenderId: string;
  borrowerId: string;
  amount: number;
  description: string;
  emailSent: boolean;
  createdAt: string;
}

export const expensesApi = {
  addFriend: async (phoneNumber: string): Promise<Friend> => {
    const { data } = await apiClient.post("/friends", { phoneNumber });
    return data;
  },

  getFriends: async (): Promise<Friend[]> => {
    const { data } = await apiClient.get("/friends");
    return data;
  },

  addExpense: async (
    friendId: string,
    amount: number,
    description: string
  ): Promise<Expense & { emailSent: boolean }> => {
    const { data } = await apiClient.post("/expenses", { friendId, amount, description });
    return data;
  },
};
