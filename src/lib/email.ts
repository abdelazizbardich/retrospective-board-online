/** Normalize and validate an email address for account identity. */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  return EMAIL_RE.test(email);
}

/** Prefer local-part for board display names (e.g. "jane" from jane@example.com). */
export function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0]?.trim();
  if (!local) return email;
  return local.slice(0, 50);
}
