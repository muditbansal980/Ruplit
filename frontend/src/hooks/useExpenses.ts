"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expensesApi, type Friend, type Expense } from "@/api/expenses.api";
import { toast } from "sonner";

export function useFriends() {
  return useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: expensesApi.getFriends,
  });
}

export function useAddFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (phoneNumber: string) => expensesApi.addFriend(phoneNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Friend added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to add friend");
    },
  });
}

export function useExpenses() {
  // Expenses are fetched as part of friends list or could be a separate endpoint
  // For now, we'll use the friends endpoint which includes expense data
  return useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: expensesApi.getFriends,
  });
}

export function useAddExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      friendId,
      amount,
      description,
    }: {
      friendId: string;
      amount: number;
      description: string;
    }) => expensesApi.addExpense(friendId, amount, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Expense added! Email notification sent.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to add expense");
    },
  });
}
