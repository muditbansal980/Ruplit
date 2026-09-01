"use client";

import { useEffect, useRef } from "react";
import { useFieldRegistryStore } from "@/store/fieldRegistryStore";

interface FieldHighlighterProps {
  /** The field id to highlight. Set to null to clear all highlights. */
  fieldId: string | null;
  /** How long the highlight lasts in ms (default: 4000). */
  duration?: number;
}

/**
 * Invisible component that scrolls to a target field and applies a
 * pulsing blue outline. Renders nothing — it operates on existing
 * DOM elements via refs stored in the field registry.
 *
 * Usage:
 * ```tsx
 * <FieldHighlighter fieldId={highlightedField} />
 * ```
 */
export function FieldHighlighter({ fieldId, duration = 4000 }: FieldHighlighterProps) {
  const fields = useFieldRegistryStore((s) => s.fields);
  const previousFieldId = useRef<string | null>(null);

  useEffect(() => {
    // Clear highlight from previous field
    if (previousFieldId.current) {
      const prevEl = fields[previousFieldId.current]?.ref.current;
      if (prevEl) {
        prevEl.classList.remove("agent-highlight");
      }
    }

    if (!fieldId) {
      previousFieldId.current = null;
      return;
    }

    const registered = fields[fieldId];
    if (!registered?.ref.current) {
      console.warn(`[FieldHighlighter] Field "${fieldId}" not found in registry`);
      return;
    }

    const el = registered.ref.current;

    // Scroll into view smoothly
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Apply highlight
    el.classList.add("agent-highlight");
    previousFieldId.current = fieldId;

    // Focus the input if it's focusable
    if ("focus" in el && typeof (el as HTMLInputElement).focus === "function") {
      (el as HTMLInputElement).focus();
    }

    // Remove highlight after duration
    const timer = setTimeout(() => {
      el.classList.remove("agent-highlight");
      previousFieldId.current = null;
    }, duration);

    return () => {
      clearTimeout(timer);
      el.classList.remove("agent-highlight");
    };
  }, [fieldId, fields, duration]);

  return null; // No DOM output — operates on existing elements via refs
}
