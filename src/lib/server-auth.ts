import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getApiToken(): Promise<string | null> {
  const result = await auth.api.getToken({
    headers: await headers(),
  });

  return result?.token ?? null;
}

/* Backend api secure - betterAuth JWT
  const token  = await auth.api.getToken({
    headers: await headers(),
  });
  console.log(token); // { token: "" }

  // Destructure
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });
  console.log(token); // eyJhbGciOiJFZERT

  // If token not exists, so used optional chaining operator (?.)
  const jwtToken = await auth.api.getToken({
    headers: await headers(),
  });
  console.log(jwtToken?.token);
*/
