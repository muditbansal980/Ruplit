"use client";

import { useState, useRef, useEffect } from "react";
import { useAgent } from "@/hooks/useAgent";
import { FieldHighlighter } from "./FieldHighlighter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Mic, Send, X, Loader2 } from "lucide-react";

/**
 * Floating agent panel — a small button in the bottom-left corner that
 * opens a compact chat panel. Shows the live transcript and the agent's
 * replies.
 */
export default function AgentPanel() {
  const {
    isOpen,
    isLoading,
    messages,
    highlightedField,
    pendingConfirmation,
    togglePanel,
    sendQuery,
    startListening,
    clearHighlight,
    respondConfirmation,
  } = useAgent();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    sendQuery(trimmed);
  };

  return (
    <>
      {/* Field highlight overlay */}
      <FieldHighlighter fieldId={highlightedField} />

      {/* Floating button (visible when panel is closed) */}
      {!isOpen && (
        <button
          onClick={togglePanel}
          className="fixed bottom-6 right-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
          aria-label="Open AI assistant"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[9998] flex w-[360px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
          style={{ maxHeight: "min(520px, calc(100vh - 48px))" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                Saathi AI
              </span>
            </div>
            <button
              onClick={togglePanel}
              className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 200 }}>
            {messages.length === 0 && (
              <p className="text-center text-sm text-zinc-400">
                Hi! Ask me anything about the app — I can help you navigate and fill forms.
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  {msg.content}
                  {msg.tools && msg.tools.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {msg.tools.map((t, j) => (
                        <span
                          key={j}
                          className="inline-block rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        >
                          {t.type.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Confirmation banner */}
          {pendingConfirmation && (
            <div className="border-t border-zinc-200 bg-amber-50 px-4 py-3 dark:border-zinc-700 dark:bg-amber-950">
              <p className="mb-2 text-sm text-amber-800 dark:text-amber-200">
                {pendingConfirmation.text}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => respondConfirmation(true)}
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => respondConfirmation(false)}
                >
                  No
                </Button>
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-zinc-200 px-3 py-2 dark:border-zinc-700"
          >
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="shrink-0 text-zinc-400 hover:text-blue-600"
              onClick={startListening}
              disabled={isLoading}
              aria-label="Speak"
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 text-sm"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="shrink-0"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
