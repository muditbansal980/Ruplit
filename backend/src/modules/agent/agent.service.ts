import Groq from "groq-sdk";
import { env } from "../../config/env.js";
import type {
  AgentChatRequest,
  AgentChatResponse,
  AgentTool,
  NavigateTool,
  FillFieldTool,
  HighlightFieldTool,
  SpeakTool,
  AskConfirmationTool,
} from "./agent.types.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

// ------------------------------------------------------------------
// Tool definitions (sent to Groq so it knows what it can call)
// ------------------------------------------------------------------

const TOOL_DEFINITIONS = [
  {
    type: "function" as const,
    function: {
      name: "navigate",
      description:
        "Navigate the user to a specific page in the app. Use this when the user's request matches a page in the site map. The route MUST be one of the known routes listed in the site map — never invent a route.",
      parameters: {
        type: "object",
        properties: {
          route: {
            type: "string",
            description:
              "The exact route string from the site map, e.g. \"/dashboard/expenses\"",
          },
        },
        required: ["route"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "highlight_field",
      description:
        "Highlight and scroll to a specific input field on the current page. Use this after navigating to guide the user's attention to the next field they should fill.",
      parameters: {
        type: "object",
        properties: {
          fieldId: {
            type: "string",
            description:
              "The field id from the current page's field list, e.g. \"friend-phone\"",
          },
        },
        required: ["fieldId"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "fill_field",
      description:
        "Fill a field with a value the user explicitly provided. ONLY use this when the user clearly stated a value for this specific field in their message. Never guess or invent a value.",
      parameters: {
        type: "object",
        properties: {
          fieldId: {
            type: "string",
            description: "The field id to fill, e.g. \"amount\"",
          },
          value: {
            type: "string",
            description:
              "The exact value the user provided, as a string (e.g. \"500\" for amount)",
          },
        },
        required: ["fieldId", "value"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "speak",
      description:
        "Read text aloud to the user using text-to-speech. Use this to give verbal instructions, especially for guidance steps.",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description:
              "The text to speak aloud. Write it in the same language the user is using (Hindi/Hinglish if they spoke in Hindi).",
          },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "ask_confirmation",
      description:
        "Ask the user to confirm before taking an action (submitting a form, making a payment, etc.). NEVER submit or perform a destructive action without calling this first.",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description:
              "The confirmation question to show the user, e.g. \"Do you want to submit this expense of ₹500 to your friend?\"",
          },
        },
        required: ["text"],
      },
    },
  },
];

// ------------------------------------------------------------------
// System prompt builder
// ------------------------------------------------------------------

function buildSystemPrompt(req: AgentChatRequest): string {
  const siteMap = Object.values(req.pageRegistry)
    .map((p) => `- ${p.route} — ${p.title}: ${p.description}`)
    .join("\n");

  const currentFields = Object.values(req.fieldRegistry)
    .map((f) => `- ${f.id} (${f.label}, type: ${f.type}, required: ${f.required})`)
    .join("\n");

  return `You are the AI assistant inside BankSaathi, a banking-assistance app for Indian users. You help users navigate the app and fill forms by breaking their request into step-by-step actions.

## Rules (non-negotiable)
1. You can ONLY affect the app through tool calls — never try to act outside your tools.
2. For "navigate", you MUST use a route from the Site Map below. Never invent a route.
3. For "fill_field", you MUST only use values the user explicitly stated. Never guess or make up values.
4. Before any submit or irreversible action, you MUST call "ask_confirmation".
5. After a "navigate" call, follow up with a "highlight_field" on the first required field on the new page, and a "speak" giving verbal guidance.
6. Respond in the same language the user uses. If they speak Hindi/Hinglish, reply in Hindi/Hinglish. If they speak English, reply in English.
7. Keep spoken guidance concise — one short sentence per "speak" call.
8. When the user provides a value for a field, call "fill_field" AND "speak" (to confirm what was filled), then "highlight_field" on the next required field.

## Site Map (all known pages)
${siteMap || "(no pages currently mounted)"}

## Current Page: ${req.currentRoute}
${currentFields ? `### Fields on this page\n${currentFields}` : "(no registered fields on this page)"}`;
}

// ------------------------------------------------------------------
// Response validation
// ------------------------------------------------------------------

function validateToolCall(
  tool: AgentTool,
  knownRoutes: string[],
  knownFieldIds: string[]
): AgentTool | null {
  switch (tool.type) {
    case "navigate": {
      const t = tool as NavigateTool;
      if (!knownRoutes.includes(t.route)) {
        console.warn(`[agent] Rejected navigate to unknown route: ${t.route}`);
        return null;
      }
      return t;
    }
    case "highlight_field": {
      const t = tool as HighlightFieldTool;
      if (!knownFieldIds.includes(t.fieldId)) {
        console.warn(`[agent] Rejected highlight on unknown field: ${t.fieldId}`);
        return null;
      }
      return t;
    }
    case "fill_field": {
      const t = tool as FillFieldTool;
      if (!knownFieldIds.includes(t.fieldId)) {
        console.warn(`[agent] Rejected fill on unknown field: ${t.fieldId}`);
        return null;
      }
      // Ensure value is not empty — the LLM must only fill with user-provided values.
      if (!t.value || t.value.trim() === "") {
        console.warn(`[agent] Rejected fill_field with empty value`);
        return null;
      }
      return t;
    }
    case "speak":
    case "ask_confirmation":
      // These are always safe to pass through.
      return tool;
    default:
      return null;
  }
}

// ------------------------------------------------------------------
// Main entry point
// ------------------------------------------------------------------

export async function chat(req: AgentChatRequest): Promise<AgentChatResponse> {
  const knownRoutes = Object.keys(req.pageRegistry);
  const knownFieldIds = Object.keys(req.fieldRegistry);

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: buildSystemPrompt(req) },
  ];

  // Add conversation history
  if (req.history) {
    for (const msg of req.history) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  // Add the current user query
  messages.push({ role: "user", content: req.query });

  console.log("[agent] Calling Groq with", messages.length, "messages,", TOOL_DEFINITIONS.length, "tools defined");
  console.log("[agent] GROQ_API_KEY present:", !!env.GROQ_API_KEY, "length:", (env.GROQ_API_KEY || "").length);

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages,
      tools: TOOL_DEFINITIONS,
      tool_choice: "auto",
      temperature: 0.3,
      max_tokens: 1024,
    });
  } catch (groqErr: any) {
    console.error("[agent] Groq API error:", groqErr.message);
    throw new Error(`LLM call failed: ${groqErr.message}`);
  }

  const choice = completion.choices[0];
  const message = choice.message;

  // Extract text reply
  const reply = message.content || "";

  // Extract and validate tool calls
  const tools: AgentTool[] = [];
  if (message.tool_calls) {
    for (const tc of message.tool_calls) {
      try {
        const args = JSON.parse(tc.function.arguments);
        const tool: AgentTool = { type: tc.function.name as AgentTool["type"], ...args } as AgentTool;
        const validated = validateToolCall(tool, knownRoutes, knownFieldIds);
        if (validated) {
          tools.push(validated);
        }
      } catch (err) {
        console.error(`[agent] Failed to parse tool call:`, tc.function.arguments, err);
      }
    }
  }

  return { reply, tools };
}
