/** Only allow redirects to pages inside this site (prevents open-redirect attacks). */
export function safeRedirect(url: string | null | undefined, fallback = "/") {
  if (
    !url ||
    !url.startsWith("/") ||
    url.startsWith("//") ||
    url.includes("\\")
  )
    return fallback;
  return url;
}

export const PASSWORD_RULES = [
  {
    id: "upper",
    label: "One uppercase letter",
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    id: "lower",
    label: "One lowercase letter",
    test: (p: string) => /[a-z]/.test(p),
  },
  {
    id: "length",
    label: "At least 6 characters",
    test: (p: string) => p.length >= 6,
  },
];

/** Returns an error message, or null when the password is valid. */
export function validatePassword(password: string): string | null {
  const failed = PASSWORD_RULES.filter((r) => !r.test(password));

  if (failed.length === 0) return null;

  return `Password needs: ${failed.map((f) => f.label.toLowerCase()).join(", ")}.`;
}
