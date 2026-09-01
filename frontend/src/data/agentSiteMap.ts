/**
 * Static site map — every route the agent can navigate to.
 *
 * This is the LLM's source of truth for what pages exist.
 * It's always sent to the backend, regardless of which pages
 * are currently mounted in the DOM.
 */

export interface PageManifest {
  route: string;
  title: string;
  description: string;
}

export const PAGE_MANIFESTS: Record<string, PageManifest> = {
  "/dashboard": {
    route: "/dashboard",
    title: "Dashboard",
    description:
      "The main hub where a logged-in user sees all available banking features: expense recording, loan tracking, bank contact, and wallet. From here the user can navigate to any feature page or start KYC verification.",
  },
  "/dashboard/expenses": {
    route: "/dashboard/expenses",
    title: "Expense Record",
    description:
      "A page for recording money lent to or borrowed from friends. The user can add friends by phone number, then log an expense (amount and description) against a selected friend. Use this page when the user wants to track loans, lending, borrowing, or money given to someone.",
  },
  "/settings": {
    route: "/settings",
    title: "Settings",
    description:
      "User settings page where the user can view their profile (name, email, role) and change the app language. Use this when the user wants to change language or view their account details.",
  },
  "/kyc": {
    route: "/kyc",
    title: "KYC Verification",
    description:
      "Identity verification page using Account Aggregator. The user can verify their identity to unlock more features. Use this when the user wants to complete KYC or verify their identity.",
  },
};
