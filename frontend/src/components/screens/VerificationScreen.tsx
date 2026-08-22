"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getLanguage, type Language } from "@/data/languages";
import { enqueue, speakNow, cancelAll } from "@/lib/audioQueue";

type StepKey = "aadhaar" | "kyc" | "bank" | "income";
type StepStatus = "locked" | "notStarted" | "inProgress" | "completed";

interface Step {
  key: StepKey;
  icon: string;
  status: StepStatus;
}

interface Props {
  languageCode: string;
  onBack: () => void;
}

const INITIAL_STEPS: Step[] = [
  { key: "aadhaar", icon: "🪪", status: "notStarted" },
  { key: "kyc", icon: "📋", status: "locked" },
  { key: "bank", icon: "🏦", status: "locked" },
  { key: "income", icon: "📄", status: "locked" },
];

export default function VerificationScreen({ languageCode, onBack }: Props) {
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const [muted, setMuted] = useState(false);
  const lang = getLanguage(languageCode);
  const hasNarrated = useRef(false);
  const prevStepsRef = useRef<Step[]>(INITIAL_STEPS);

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const currentStepIndex = steps.findIndex((s) => s.status === "inProgress" || s.status === "notStarted");
  const progress = Math.round((completedCount / 4) * 100);

  // Auto-narrate on mount
  useEffect(() => {
    if (hasNarrated.current) return;
    hasNarrated.current = true;

    const timer = setTimeout(() => {
      enqueue(lang.verification.title, lang.code);
      // Narrate the first unlocked step
      const firstStep = steps.find((s) => s.status === "notStarted");
      if (firstStep) {
        enqueue(
          lang.verification.stepUnlocked.replace(
            "{step}",
            lang.verification.steps[firstStep.key]
          ),
          lang.code
        );
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [lang, steps]);

  // Auto-narrate when a step status changes
  const prevCompletedCount = useRef(completedCount);
  useEffect(() => {
    if (completedCount > prevCompletedCount.current) {
      // A step was just completed
      const completedStep = steps.find(
        (s) => s.status === "completed" &&
          prevStepsRef.current.find((ps) => ps.key === s.key)?.status !== "completed"
      );
      if (completedStep) {
        enqueue(
          `${lang.verification.steps[completedStep.key]} ${lang.verification.status.completed}.`,
          lang.code
        );
      }

      // Check if next step unlocked
      const nextStep = steps.find((s) => s.status === "notStarted");
      if (nextStep) {
        setTimeout(() => {
          enqueue(
            lang.verification.stepUnlocked.replace(
              "{step}",
              lang.verification.steps[nextStep.key]
            ),
            lang.code
          );
        }, 2000);
      }
    }
    prevCompletedCount.current = completedCount;
    prevStepsRef.current = [...steps];
  }, [completedCount, steps, lang]);

  const handleStepAction = useCallback(
    (step: Step) => {
      cancelAll();
      if (step.status === "locked") return;

      if (step.status === "notStarted") {
        // Start this step
        setSteps((prev) =>
          prev.map((s) =>
            s.key === step.key ? { ...s, status: "inProgress" as StepStatus } : s
          )
        );
        enqueue(
          lang.verification.stepUnlocked.replace(
            "{step}",
            lang.verification.steps[step.key]
          ),
          lang.code
        );
      } else if (step.status === "inProgress") {
        // Complete this step
        setSteps((prev) =>
          prev.map((s) => {
            if (s.key === step.key) return { ...s, status: "completed" as StepStatus };
            // Unlock next step
            if (s.status === "locked") {
              const stepOrder: StepKey[] = ["aadhaar", "kyc", "bank", "income"];
              const currentIndex = stepOrder.indexOf(step.key);
              const thisIndex = stepOrder.indexOf(s.key);
              if (thisIndex === currentIndex + 1) {
                return { ...s, status: "notStarted" as StepStatus };
              }
            }
            return s;
          })
        );
      }
    },
    [lang]
  );

  const handleReplay = () => {
    cancelAll();
    speakNow(lang.verification.title, lang.code);
  };

  const handleToggleMute = () => {
    if (!muted) {
      cancelAll();
    }
    setMuted(!muted);
  };

  const getStatusStyle = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return {
          badge: "bg-green-100 text-green-800",
          icon: "✓",
          iconBg: "bg-green-100 text-green-700",
          label: lang.verification.status.completed,
        };
      case "inProgress":
        return {
          badge: "bg-blue-100 text-blue-800",
          icon: "▶",
          iconBg: "bg-blue-100 text-blue-700",
          label: lang.verification.status.inProgress,
        };
      case "notStarted":
        return {
          badge: "bg-gray-100 text-gray-600",
          icon: "○",
          iconBg: "bg-gray-100 text-gray-500",
          label: lang.verification.status.notStarted,
        };
      case "locked":
        return {
          badge: "bg-gray-50 text-gray-400",
          icon: "🔒",
          iconBg: "bg-gray-50 text-gray-400",
          label: "",
        };
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <button
            type="button"
            onClick={() => {
              cancelAll();
              onBack();
            }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReplay}
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 text-lg transition hover:bg-gray-50"
              aria-label="Replay narration"
            >
              🔊
            </button>
            <button
              type="button"
              onClick={handleToggleMute}
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 text-lg transition hover:bg-gray-50"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-lg font-bold text-black">
              {lang.verification.title}
            </h1>
            <span className="text-sm font-medium text-gray-500">
              {lang.verification.progress.replace("{n}", String(completedCount + 1))}
            </span>
          </div>

          {/* Visual progress with step icons */}
          <div className="flex items-center gap-2">
            {steps.map((step, i) => {
              const style = getStatusStyle(step.status);
              return (
                <div key={step.key} className="flex flex-1 items-center gap-1">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      step.status === "completed"
                        ? "bg-green-500 text-white"
                        : step.status === "inProgress"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.status === "completed" ? "✓" : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 ${
                        step.status === "completed" ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-black transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Cards */}
        <div className="space-y-3">
          {steps.map((step) => {
            const style = getStatusStyle(step.status);
            const isLocked = step.status === "locked";
            const stepName = lang.verification.steps[step.key];

            return (
              <div
                key={step.key}
                className={`rounded-2xl border-2 p-5 transition ${
                  isLocked
                    ? "border-gray-100 bg-gray-50 opacity-60"
                    : step.status === "completed"
                      ? "border-green-200 bg-white"
                      : step.status === "inProgress"
                        ? "border-blue-200 bg-white"
                        : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step Icon */}
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${style.iconBg}`}
                  >
                    {step.icon}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="text-base font-semibold text-black">
                        {stepName}
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${style.badge}`}
                    >
                      <span>{style.icon}</span>
                      {style.label}
                    </div>

                    {/* Action Button */}
                    {!isLocked && (
                      <button
                        type="button"
                        onClick={() => handleStepAction(step)}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-98"
                      >
                        <span className="text-lg">
                          {step.status === "completed" ? "✓" : step.status === "inProgress" ? "✓" : "▶"}
                        </span>
                        {step.status === "completed"
                          ? "Done"
                          : step.status === "inProgress"
                            ? "Complete"
                            : "Start"}
                      </button>
                    )}

                    {isLocked && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>🔒</span>
                        Complete previous step first
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* All Done */}
        {completedCount === 4 && (
          <div className="mt-6 rounded-2xl border-2 border-green-200 bg-green-50 p-6 text-center">
            <div className="mb-2 text-4xl">🎉</div>
            <h2 className="text-lg font-bold text-green-800">All Steps Complete!</h2>
            <p className="mt-1 text-sm text-green-600">
              You're ready to explore loan options.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
