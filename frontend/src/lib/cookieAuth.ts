const AUTH_COOKIE = "banksahayak-auth";
const ONE_WEEK = 7 * 24 * 60 * 60;

/**
 * Set an auth cookie so the server can read the JWT during SSR.
 * The cookie is NOT HttpOnly — the axios interceptor reads localStorage,
 * but the server needs the cookie for layout-level auth checks.
 */
export function setAuthCookie(token: string): void {
  document.cookie = `${AUTH_COOKIE}=${token}; path=/; max-age=${ONE_WEEK}; SameSite=Lax`;
}

/**
 * Remove the auth cookie on logout.
 */
export function removeAuthCookie(): void {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Read the auth cookie on the client (for debugging / explicit reads).
 * The server reads it via next/headers cookies().
 */
export function getAuthCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
