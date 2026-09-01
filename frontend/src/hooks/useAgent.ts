"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { agentApi, type AgentTool, type FieldSnapshot } from "@/api/agent.api";
import { PAGE_MANIFESTS } from "@/data/agentSiteMap";
import { useAgentRegistryStore } from "@/store/agentRegistryStore";
import { useFieldRegistryStore } from "@/store/fieldRegistryStore";
import { speak as libSpeak } from "@/lib/speech";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  /** Tool calls attached to this message (assistant only). */
  tools?: AgentTool[];
}

interface AgentState {
  /** Whether the agent panel is open. */
  isOpen: boolean;
  /** Whether a request is in flight. */
  isLoading: boolean;
  /** The conversation messages. */
  messages: ChatMessage[];
  /** The field currently being highlighted, or null. */
  highlightedField: string | null;
  /** If the agent asked for confirmation, this holds the question + resolve callback. */
  pendingConfirmation: { text: string; resolve: (confirmed: boolean) => void } | null;
}

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------

export function useAgent() {
  const router = useRouter();
  const { language } = useLanguage();
  const langCode = language?.split("-")[0] ?? "hi";

  const [state, setState] = useState<AgentState>({
    isOpen: false,
    isLoading: false,
    messages: [],
    highlightedField: null,
    pendingConfirmation: null,
  });

  // Keep a mutable ref to state so the async tool executor can read latest values
  const stateRef = useRef(state);
  stateRef.current = state;

  // ---- Actions ----

  const togglePanel = useCallback(() => {
    setState((s) => ({ ...s, isOpen: !s.isOpen }));
  }, []);

  const clearHighlight = useCallback(() => {
    setState((s) => ({ ...s, highlightedField: null }));
  }, []);

  /**
   * Execute a list of tool calls in order. Some are async (confirmation),
   * so we await each one sequentially.
   */
  const executeTools = useCallback(
    async (tools: AgentTool[]) => {
      for (const tool of tools) {
        switch (tool.type) {
          case "navigate": {
            // Show toast for visible navigation feedback
            toast.info("Navigating...", { duration: 1500 });
            router.push(tool.route!);
            // Wait a beat for the page to mount and register its fields
            await new Promise((r) => setTimeout(r, 800));
            break;
          }
          case "highlight_field": {
            setState((s) => ({ ...s, highlightedField: tool.fieldId! }));
            break;
          }
          case "fill_field": {
            // Fill the field via DOM — find the input by field id
            const fields = useFieldRegistryStore.getState().fields;
            const registered = fields[tool.fieldId!];
            if (registered?.ref.current) {
              const el = registered.ref.current as HTMLInputElement;
              // Use native input setter to trigger react-hook-form's onChange
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value"
              )?.set;
              if (nativeInputValueSetter) {
                nativeInputValueSetter.call(el, tool.value!);
              } else {
                el.value = tool.value!;
              }
              el.dispatchEvent(new Event("input", { bubbles: true }));
              el.dispatchEvent(new Event("change", { bubbles: true }));
            }
            break;
          }
          case "speak": {
            libSpeak(tool.text!, langCode);
            break;
          }
          case "ask_confirmation": {
            // Block until the user responds
            const confirmed = await new Promise<boolean>((resolve) => {
              setState((s) => ({
                ...s,
                pendingConfirmation: { text: tool.text!, resolve },
              }));
            });
            setState((s) => ({ ...s, pendingConfirmation: null }));

            if (!confirmed) {
              // Add a "declined" message and stop executing tools
              setState((s) => ({
                ...s,
                messages: [
                  ...s.messages,
                  { role: "user", content: "No, cancel that." },
                ],
              }));
              // Send the decline back to the agent so it can respond
              await sendQuery("No, cancel that.");
              return;
            }
            break;
          }
        }
      }
    },
    [router, langCode]
  );

  /**
   * Send a user query to the backend and process the response.
   * This is the core loop: query → LLM → tool execution.
   */
  const sendQuery = useCallback(
    async (query: string) => {
      // Use the static site map (all known routes) + current page's fields
      const pages = PAGE_MANIFESTS;
      const fieldRegistry = useFieldRegistryStore.getState().fields;

      // Build field snapshot (strip refs — they're client-only)
      const fieldSnapshot: Record<string, FieldSnapshot> = {};
      for (const [id, field] of Object.entries(fieldRegistry)) {
        fieldSnapshot[id] = {
          id: field.id,
          label: field.label,
          type: field.type,
          required: field.required,
        };
      }

      // Build conversation history
      const history = stateRef.current.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Add user message to UI
      const userMessage: ChatMessage = { role: "user", content: query };
      setState((s) => ({
        ...s,
        messages: [...s.messages, userMessage],
        isLoading: true,
      }));

      try {
        const response = await agentApi.chat(
          query,
          window.location.pathname,
          pages,
          fieldSnapshot,
          history
        );

        // Add assistant message with tool calls
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.reply,
          tools: response.tools,
        };
        setState((s) => ({
          ...s,
          messages: [...s.messages, userMessage, assistantMessage],
          isLoading: false,
        }));

        // Execute tool calls
        if (response.tools.length > 0) {
          await executeTools(response.tools);
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || "Agent request failed";
        toast.error(errorMsg);
        setState((s) => ({
          ...s,
          messages: [
            ...s.messages,
            userMessage,
            { role: "assistant", content: `Sorry, something went wrong: ${errorMsg}` },
          ],
          isLoading: false,
        }));
      }
    },
    [executeTools]
  );

  /**
   * Respond to a pending confirmation.
   */
  const respondConfirmation = useCallback(
    (confirmed: boolean) => {
      const pending = stateRef.current.pendingConfirmation;
      if (pending) {
        pending.resolve(confirmed);
      }
    },
    []
  );

  /**
   * Handle voice input via Web Speech API.
   */
  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Speech recognition is not supported in this browser");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language ?? "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      sendQuery(transcript);
    };

    recognition.onerror = (event: any) => {
      if (event.error !== "no-speech") {
        toast.error(`Voice recognition error: ${event.error}`);
      }
    };

    recognition.start();
    toast.info("Listening...", { duration: 2000 });
  }, [language, sendQuery]);

  return {
    ...state,
    togglePanel,
    sendQuery,
    startListening,
    clearHighlight,
    respondConfirmation,
  };
}
