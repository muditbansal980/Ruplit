/**
 * A machine-readable description of a page in the application.
 *
 * These manifests are consumed by an AI navigation agent that receives
 * natural-language requests from users (e.g. "I want to record money
 * I lent to a friend") and decides which page to navigate to.
 *
 * The `description` field is written for an LLM to read — it will be
 * injected directly into a prompt, so it should explain what the page
 * does in plain, unambiguous English.
 */
export interface PageManifest {
  /** The client-side route, e.g. "/dashboard" or "/dashboard/expenses". */
  route: string;

  /** Short human-readable title for the page, shown in debug UI. */
  title: string;

  /**
   * Plain-English description written for an LLM.
   *
   * Explain what the page lets the user do, what forms or actions it
   * contains, and when an agent should navigate here. Be specific about
   * the use-case so the model can match it against user intent.
   */
  description: string;
}

/** Map of route → manifest for every currently-mounted page. */
export type PageRegistry = Record<string, PageManifest>;

// ------------------------------------------------------------------
// Field registry types
// ------------------------------------------------------------------

/**
 * A machine-readable description of a single input field on a page.
 *
 * The AI agent uses this to know what the user can fill in and how
 * to refer to each field in its guidance.
 */
export interface FieldManifest {
  /** Stable id matching the DOM, e.g. "friend-phone", "amount". */
  id: string;

  /** Human-readable label shown to the user, e.g. "Friend's phone number". */
  label: string;

  /** HTML input type hint: "text", "number", "tel", etc. */
  type: string;

  /** Whether the field must be filled before submission. */
  required: boolean;
}

/**
 * A field that is currently mounted in the DOM.
 *
 * Extends FieldManifest with a ref the agent can use to scroll to
 * and highlight the real DOM element.
 */
export interface RegisteredField extends FieldManifest {
  ref: React.RefObject<HTMLElement | null>;
}

/** Map of fieldId → registered field for all inputs on the current page. */
export type FieldRegistry = Record<string, RegisteredField>;
