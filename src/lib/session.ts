import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/** The logged-in user, read from the Better Auth session cookie on the server. */
export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });

  return session?.user ?? null;
}
