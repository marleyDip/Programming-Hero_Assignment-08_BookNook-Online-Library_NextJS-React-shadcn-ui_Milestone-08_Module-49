import "server-only";

import { getApiToken } from "@/lib/server-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "The API is not connected. Set NEXT_PUBLIC_API_URL in .env.local.",
    );
  }

  const token = await getApiToken();

  const fetchHeaders = new Headers(init.headers);

  fetchHeaders.set("Content-Type", "application/json");

  if (token) {
    fetchHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: fetchHeaders,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      (data as { message?: string }).message ||
        `Request failed (${res.status})`,
      res.status,
    );
  }

  return data as T;
}

/* import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "The API is not connected. Set NEXT_PUBLIC_API_URL in .env.local.",
    );
  }

  // Get incoming Next.js request headers
  const requestHeaders = await headers();

  // Check authenticated session
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  // Prepare request headers
  const fetchHeaders = new Headers(init.headers);

  fetchHeaders.set("Content-Type", "application/json");

  // Attach Better Auth JWT when authenticated
  if (session) {
    const { token } = await auth.api.getToken({
      headers: requestHeaders,
    });

    fetchHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: fetchHeaders,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      (data as { message?: string }).message ||
        `Request failed (${res.status})`,
      res.status,
    );
  }

  return data as T;
} */
