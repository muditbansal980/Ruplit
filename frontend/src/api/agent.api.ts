import apiClient from "./axiosClient";

/** Tool call returned by the backend (same shape as the backend types). */
export interface AgentTool {
  type: "navigate" | "highlight_field" | "fill_field" | "speak" | "ask_confirmation";
  route?: string;
  fieldId?: string;
  value?: string;
  text?: string;
}

/** What the backend returns. */
export interface AgentChatResponse {
  reply: string;
  tools: AgentTool[];
}

/** Field manifest snapshot (without the ref — client-only). */
export interface FieldSnapshot {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

export const agentApi = {
  /**
   * Send a user query to the agent endpoint.
   *
   * @param query        - The user's natural-language request.
   * @param currentRoute - The current client-side route.
   * @param pageRegistry - Snapshot of all mounted page manifests.
   * @param fieldRegistry - Snapshot of all fields on the current page.
   * @param history      - Optional conversation history for multi-turn.
   */
  chat: async (
    query: string,
    currentRoute: string,
    pageRegistry: Record<string, { route: string; title: string; description: string }>,
    fieldRegistry: Record<string, FieldSnapshot>,
    history?: Array<{ role: "user" | "assistant"; content: string }>
  ): Promise<AgentChatResponse> => {
    const { data } = await apiClient.post("/agent/chat", {
      query,
      currentRoute,
      pageRegistry,
      fieldRegistry,
      history,
    });
    return data;
  },
};
