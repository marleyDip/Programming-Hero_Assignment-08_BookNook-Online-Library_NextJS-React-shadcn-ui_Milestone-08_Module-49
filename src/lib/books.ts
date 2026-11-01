/** Place at: lib/books.ts */

import { cacheLife, cacheTag } from "next/cache";

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  createdAt: string; // ISO date
};

// Set NEXT_PUBLIC_API_URL=http://localhost:5000 in .env.local to use the real API.
// If it is missing (or the API is down) the dummy data below is used instead.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Dummy data, already sorted newest first */
export const DUMMY_BOOKS: Book[] = [
  {
    _id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    image: "https://picsum.photos/seed/booknook-1/480/640",
    createdAt: "2026-10-28T10:00:00.000Z",
  },
  {
    _id: "2",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    image: "https://picsum.photos/seed/booknook-2/480/640",
    createdAt: "2026-10-26T10:00:00.000Z",
  },
  {
    _id: "3",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    image: "https://picsum.photos/seed/booknook-3/480/640",
    createdAt: "2026-10-24T10:00:00.000Z",
  },
  {
    _id: "4",
    title: "Dune",
    author: "Frank Herbert",
    category: "Sci-Fi",
    image: "https://picsum.photos/seed/booknook-4/480/640",
    createdAt: "2026-10-21T10:00:00.000Z",
  },
  {
    _id: "5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Classic",
    image: "https://picsum.photos/seed/booknook-5/480/640",
    createdAt: "2026-10-18T10:00:00.000Z",
  },
  {
    _id: "6",
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    image: "https://picsum.photos/seed/booknook-6/480/640",
    createdAt: "2026-10-15T10:00:00.000Z",
  },
];

/** Cached fetch (Cache Components). Throws on failure so errors are never cached. */
async function fetchLatestBooks(): Promise<Book[]> {
  "use cache";
  cacheLife("minutes"); // refreshes in the background about every minute
  cacheTag("books"); // lets you invalidate it right after a book is added

  const res = await fetch(`${API_URL}/api/books/latest`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  return (await res.json()) as Book[];
}

/** Latest 6 books, newest first. Uses the Express API when configured. */
export async function getLatestBooks(): Promise<Book[]> {
  if (!API_URL) return DUMMY_BOOKS;

  try {
    return await fetchLatestBooks();
  } catch {
    return DUMMY_BOOKS;
  }
}
