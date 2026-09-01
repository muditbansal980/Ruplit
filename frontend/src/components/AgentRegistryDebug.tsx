"use client";

import { useAgentRegistryStore } from "@/store/agentRegistryStore";
import { useFieldRegistryStore } from "@/store/fieldRegistryStore";

/**
 * TEMPORARY debug component — delete before submitting.
 *
 * Renders both registries so you can visually confirm pages and
 * fields register/unregister correctly on navigation.
 */
export default function AgentRegistryDebug() {
  const pages = useAgentRegistryStore((s) => s.pages);
  const fields = useFieldRegistryStore((s) => s.fields);

  const pageEntries = Object.values(pages);
  const fieldEntries = Object.values(fields);

  return (
    <div
      className="fixed bottom-4 left-4 z-[9999] max-h-[60vh] w-96 overflow-auto rounded-lg border border-zinc-300 bg-white p-4 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
      style={{ fontFamily: "monospace", fontSize: 11 }}
    >
      {/* Pages section */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-bold text-zinc-700 dark:text-zinc-300">
            📄 Page Registry
          </span>
          <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {pageEntries.length}
          </span>
        </div>
        {pageEntries.length === 0 ? (
          <p className="text-zinc-400 italic">No pages registered.</p>
        ) : (
          <pre className="whitespace-pre-wrap break-words text-zinc-600 dark:text-zinc-400">
            {JSON.stringify(
              Object.fromEntries(pageEntries.map((p) => [p.route, { title: p.title }])),
              null,
              2
            )}
          </pre>
        )}
      </div>

      {/* Divider */}
      <hr className="mb-3 border-zinc-200 dark:border-zinc-700" />

      {/* Fields section */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="font-bold text-zinc-700 dark:text-zinc-300">
            📝 Field Registry
          </span>
          <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {fieldEntries.length}
          </span>
        </div>
        {fieldEntries.length === 0 ? (
          <p className="text-zinc-400 italic">No fields registered.</p>
        ) : (
          <pre className="whitespace-pre-wrap break-words text-zinc-600 dark:text-zinc-400">
            {JSON.stringify(
              Object.fromEntries(
                fieldEntries.map((f) => [
                  f.id,
                  {
                    label: f.label,
                    type: f.type,
                    required: f.required,
                    attached: f.ref.current !== null,
                  },
                ])
              ),
              null,
              2
            )}
          </pre>
        )}
      </div>
    </div>
  );
}
