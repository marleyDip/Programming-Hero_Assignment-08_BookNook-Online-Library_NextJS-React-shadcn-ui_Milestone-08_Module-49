/** Place at: src/lib/api.ts  (SERVER ONLY: never import from a Client Component) */

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.INTERNAL_API_KEY;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (!API_URL)
    throw new Error(
      "The API is not connected. Set NEXT_PUBLIC_API_URL in .env.local.",
    );

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY ?? "",
      ...init.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new ApiError(
      (data as { message?: string }).message ||
        `Request failed (${res.status})`,
      res.status,
    );
  return data as T;
}

// const API_URL = process.env.NEXT_PUBLIC_API_URL;
// const API_KEY = process.env.INTERNAL_API_KEY;

// export async function apiFetch<T>(
//   path: string,
//   init: RequestInit = {},
// ): Promise<T> {
//   if (!API_URL)
//     throw new Error(
//       "The API is not connected. Set NEXT_PUBLIC_API_URL in .env.local.",
//     );

//   const res = await fetch(`${API_URL}${path}`, {
//     ...init,
//     cache: "no-store",

//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": API_KEY ?? "",
//       ...init.headers,
//     },
//   });

//   const data = await res.json().catch(() => ({}));

//   if (!res.ok)
//     throw new Error(
//       (data as { message?: string }).message ||
//         `Request failed (${res.status})`,
//     );

//   return data as T;
// }
