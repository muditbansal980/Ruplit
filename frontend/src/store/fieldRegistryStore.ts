"use client";

import { create } from "zustand";
import type { FieldRegistry, RegisteredField } from "@/types/agent";

interface FieldRegistryState {
  /** Map of fieldId → registered field for all inputs on the current page. */
  fields: FieldRegistry;

  /** Add or update a field entry (merges — never replaces the whole map). */
  registerField: (field: RegisteredField) => void;

  /** Remove a single field entry by id. */
  unregisterField: (id: string) => void;
}

export const useFieldRegistryStore = create<FieldRegistryState>()((set) => ({
  fields: {},

  registerField: (field) =>
    set((state) => ({
      fields: { ...state.fields, [field.id]: field },
    })),

  unregisterField: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.fields;
      return { fields: rest };
    }),
}));
