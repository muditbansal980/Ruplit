/**
 * Central audio queue manager.
 * Ensures narrations play one after another, never simultaneously.
 */

type QueueItem = {
  text: string;
  lang: string;
  priority?: boolean; // Jump to front of queue
};

let queue: QueueItem[] = [];
let isPlaying = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let _onQueueEmpty: (() => void) | null = null;

function processQueue() {
  if (isPlaying || queue.length === 0) {
    if (queue.length === 0 && _onQueueEmpty) {
      _onQueueEmpty();
    }
    return;
  }

  isPlaying = true;
  const item = queue.shift()!;

  // Cancel any existing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(item.text);
  utterance.lang = item.lang;
  utterance.rate = 0.9;
  utterance.pitch = 1;
  currentUtterance = utterance;

  utterance.onend = () => {
    isPlaying = false;
    currentUtterance = null;
    processQueue();
  };

  utterance.onerror = () => {
    isPlaying = false;
    currentUtterance = null;
    processQueue();
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Add a narration to the queue.
 * If priority is true, it jumps to the front.
 */
export function enqueue(text: string, lang: string, priority = false) {
  if (priority) {
    queue.unshift({ text, lang, priority });
  } else {
    queue.push({ text, lang, priority });
  }
  processQueue();
}

/**
 * Cancel all queued narrations and stop current playback.
 */
export function cancelAll() {
  queue = [];
  window.speechSynthesis.cancel();
  isPlaying = false;
  currentUtterance = null;
}

/**
 * Play a single phrase immediately, canceling everything else.
 */
export function speakNow(text: string, lang: string) {
  cancelAll();
  isPlaying = true;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9;
  currentUtterance = utterance;

  utterance.onend = () => {
    isPlaying = false;
    currentUtterance = null;
  };

  utterance.onerror = () => {
    isPlaying = false;
    currentUtterance = null;
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Check if audio is currently playing.
 */
export function isCurrentlyPlaying() {
  return isPlaying;
}

/**
 * Register a callback for when the queue empties.
 */
export function onQueueEmpty(callback: () => void) {
  _onQueueEmpty = callback;
}

/**
 * Clear the onQueueEmpty callback.
 */
export function clearOnQueueEmpty() {
  _onQueueEmpty = null;
}
