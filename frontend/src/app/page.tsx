"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function Home() {
  const { count, increment, decrement, reset } = useAppStore();
  const [apiStatus, setApiStatus] = useState<string>("checking...");

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setApiStatus(`Backend reachable — ${data.message}`))
      .catch(() => setApiStatus("Backend NOT reachable"));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-bold">
        Next.js + Tailwind + Zustand + Express
      </h1>

      <section className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 p-8 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Zustand counter</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={decrement}
            className="rounded-full bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-black"
          >
            −
          </button>
          <span className="w-16 text-center text-2xl font-bold">{count}</span>
          <button
            onClick={increment}
            className="rounded-full bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-black"
          >
            +
          </button>
        </div>
        <button onClick={reset} className="text-sm text-zinc-500 underline">
          reset
        </button>
      </section>

      <p className="text-sm text-zinc-500">
        API: {API_URL} —{" "}
        <span className={apiStatus.startsWith("Backend reachable") ? "text-green-600" : "text-red-600"}>
          {apiStatus}
        </span>
      </p>
    </main>
  );
}
