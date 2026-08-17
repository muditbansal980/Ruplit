let pendingSpeak: { phrase: string; langCode: string } | null = null;
let retryListenerAttached = false;

/**
 * Replays the last blocked phrase once the user interacts with the page.
 * Browsers (especially Chrome) block speech synthesis until the user has
 * interacted with the page at least once, so this is the workaround.
 */
function retryPendingSpeak() {
  retryListenerAttached = false;
  const pending = pendingSpeak;
  pendingSpeak = null;
  if (pending) {
    console.log(
      `[speech] retrying after user interaction (${pending.langCode}): "${pending.phrase}"`
    );
    speak(pending.phrase, pending.langCode);
  }
}

/** Queues a phrase and plays it on the user's first click/keypress. */
function queuePending(phrase: string, langCode: string) {
  if (pendingSpeak) return; // keep only the most recent blocked phrase
  pendingSpeak = { phrase, langCode };
  if (retryListenerAttached) return;
  retryListenerAttached = true;
  window.addEventListener("pointerdown", retryPendingSpeak, { once: true });
  window.addEventListener("keydown", retryPendingSpeak, { once: true });
}

/**
 * Speaks a phrase using the browser's built-in speech synthesis
 * (Web Speech API). This is 100% client-side — no backend required.
 *
 * If the browser blocks speech before any user interaction (autoplay
 * policy), the phrase is deferred and played automatically on the first
 * click or keypress instead of failing with a "not-allowed" error.
 */
export function speak(phrase: string, langCode: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("[speech] Speech synthesis is not supported in this browser.");
    return;
  }

  // If the user has never interacted with the page yet, don't attempt —
  // Chrome would block it. Queue it and speak on the first interaction.
  if ("userActivation" in navigator && !navigator.userActivation.hasBeenActive) {
    console.warn(
      `[speech] deferred (${langCode}) — waiting for first user interaction: "${phrase}"`
    );
    queuePending(phrase, langCode);
    return;
  }

  // Stop anything currently playing so phrases never overlap.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.lang = langCode;
  utterance.rate = 0.95;

  utterance.onstart = () =>
    console.log(`[speech] started (${langCode}): "${phrase}"`);
  utterance.onend = () =>
    console.log(`[speech] finished (${langCode}): "${phrase}"`);
  utterance.onerror = (event) => {
    const error = event.error;
    if (error === "not-allowed") {
      // Fallback for browsers without userActivation support: the browser
      // blocked us, so defer until the first interaction.
      console.warn(
        `[speech] blocked (${langCode}) — will retry on first user interaction`
      );
      queuePending(phrase, langCode);
    } else if (error === "interrupted" || error === "canceled") {
      // Expected when a new phrase cancels the previous one.
      console.log(`[speech] interrupted (${langCode}): "${phrase}"`);
    } else {
      console.error(`[speech] error (${langCode}):`, error);
    }
  };

  window.speechSynthesis.speak(utterance);
  console.log(`[speech] speak() called (${langCode}): "${phrase}"`);
}
