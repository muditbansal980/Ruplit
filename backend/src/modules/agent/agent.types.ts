/**
 * Tool schema for the AI navigation agent.
 *
 * These are the ONLY actions the LLM can request. The frontend runtime
 * executes them — the LLM's raw text never triggers navigation or DOM
 * changes directly.
 */

// ------------------------------------------------------------------
// Tool definitions (what the LLM can call)
// ------------------------------------------------------------------

export interface NavigateTool {
  type: "navigate";
  route: string;
}

export interface HighlightFieldTool {
  type: "highlight_field";
  fieldId: string;
}

export interface FillFieldTool {
  type: "fill_field";
  fieldId: string;
  value: string;
}

export interface SpeakTool {
  type: "speak";
  text: string;
}

export interface AskConfirmationTool {
  type: "ask_confirmation";
  text: string;
}

export type AgentTool =
  | NavigateTool
  | HighlightFieldTool
  | FillFieldTool
  | SpeakTool
  | AskConfirmationTool;

// ------------------------------------------------------------------
// Request / response shapes for POST /api/agent/chat
// ------------------------------------------------------------------

/** What the frontend sends to the backend. */
export interface AgentChatRequest {
  /** The user's natural-language query (text or voice transcript). */
  query: string;

  /** The current client-side route. */
  currentRoute: string;

  /** Snapshot of all currently-mounted page manifests (the site map). */
  pageRegistry: Record<string, { route: string; title: string; description: string }>;

  /**
   * Snapshot of all fields on the current page (without refs — those
   * are client-only). The backend includes this in the system prompt
   * so the LLM knows what inputs exist.
   */
  fieldRegistry: Record<string, { id: string; label: string; type: string; required: boolean }>;

  /** Conversation history for multi-turn context (optional on first turn). */
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

/** What the backend returns. */
export interface AgentChatResponse {
  /** Text reply from the LLM (shown in the chat panel). */
  reply: string;

  /** Zero or more tool calls the LLM wants the frontend to execute. */
  tools: AgentTool[];
}
