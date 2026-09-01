"use client";

import { useCallback, useEffect } from "react";
import type { FieldManifest } from "@/types/agent";
import { useFieldRegistryStore } from "@/store/fieldRegistryStore";

/**
 * Call this hook in a component that renders an input field.
 * It returns a **callback ref** you must attach to the real DOM element
 * (the <input>, <select>, etc.) so the agent can scroll to and highlight it.
 *
 * The field is registered the moment the DOM element mounts and removed
 * when it unmounts — same lifecycle as `useRegisterPage`.
 *
 * @example
 * ```tsx
 * const phoneRef = useRegisterField({
 *   id: "friend-phone",
 *   label: "Friend's phone number",
 *   type: "tel",
 *   required: true,
 * });
 *
 * return <input ref={phoneRef} ... />;
 * ```
 */
export function useRegisterField(manifest: FieldManifest) {
  const registerField = useFieldRegistryStore((s) => s.registerField);
  const unregisterField = useFieldRegistryStore((s) => s.unregisterField);

  // Register on mount, unregister on unmount.
  useEffect(() => {
    // We can't attach a ref here (no DOM node yet), so registration
    // happens via the callback ref below. This effect only handles
    // cleanup in the case where the callback ref never fired (edge
    // case: component mounts but the element is never rendered).
    return () => {
      unregisterField(manifest.id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manifest.id, unregisterField]);

  // Callback ref: fires when the DOM element mounts/unmounts.
  const callbackRef = useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        registerField({ ...manifest, ref: { current: node } });
      } else {
        unregisterField(manifest.id);
      }
    },
    // manifest.id is the stable key; registerField/unregisterField
    // are Zustand selectors (stable references).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [manifest.id, registerField, unregisterField]
  );

  return callbackRef;
}
