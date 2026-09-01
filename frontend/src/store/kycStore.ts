"use client";

import { create } from "zustand";

interface KycState {
  mode: "ASSISTED" | "SELF" | null;
  mobileNumber: string;
  uploadedFile: File | null;
  setMode: (mode: "ASSISTED" | "SELF") => void;
  setMobileNumber: (number: string) => void;
  setUploadedFile: (file: File | null) => void;
  reset: () => void;
}

export const useKycStore = create<KycState>((set) => ({
  mode: null,
  mobileNumber: "",
  uploadedFile: null,
  setMode: (mode) => set({ mode }),
  setMobileNumber: (mobileNumber) => set({ mobileNumber }),
  setUploadedFile: (uploadedFile) => set({ uploadedFile }),
  reset: () => set({ mode: null, mobileNumber: "", uploadedFile: null }),
}));
