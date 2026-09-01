/**
 * Cookie-based language persistence.
 *
 * The Zustand store + localStorage only work on the client. During SSR the
 * server has no access to localStorage, so it falls back to English and the
 * user sees a flash on refresh. By storing the language code in a cookie the
 * server can read it with `cookies()` from next/headers and render the
 * correct language from the very first byte.
 */

export const LANG_COOKIE = "banksahayak-lang";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/** Set the language cookie (client-side). Stores the primary code
 *  (e.g. "hi" from "hi-IN") so i18next can match it to resource keys. */
export function setLanguageCookie(code: string) {
  if (typeof document === "undefined") return;
  const primary = code.split("-")[0];
  document.cookie = `${LANG_COOKIE}=${encodeURIComponent(primary)}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

/** Remove the language cookie (client-side). */
export function removeLanguageCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${LANG_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
