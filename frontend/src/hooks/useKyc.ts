"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kycApi, type KycRequest } from "@/api/kyc.api";
import { toast } from "sonner";

export function useKycRequests(scope: "live" | "mine" | "review-queue") {
  const queryFn = {
    live: kycApi.getLiveRequests,
    mine: kycApi.getMyAccepted,
    "review-queue": kycApi.getReviewQueue,
  }[scope];

  return useQuery<KycRequest[]>({
    queryKey: ["kyc", scope],
    queryFn,
  });
}

export function useSubmitKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mode,
      mobileNumber,
    }: {
      mode: "ASSISTED" | "SELF";
      mobileNumber?: string;
    }) => kycApi.createRequest(mode, mobileNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
      toast.success("KYC request submitted!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to submit KYC request");
    },
  });
}

export function useUploadAadhar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, file }: { requestId: string; file: File }) =>
      kycApi.uploadAadhar(requestId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
      toast.success("Aadhar photo uploaded!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to upload");
    },
  });
}

export function useAcceptKycRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => kycApi.acceptRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
      toast.success("Request accepted!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to accept request");
    },
  });
}

export function useRejectKycRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => kycApi.rejectRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
      toast.success("Request rejected");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to reject request");
    },
  });
}

export function useVerifyKycRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => kycApi.verifyRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
      toast.success("Request verified!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to verify");
    },
  });
}
