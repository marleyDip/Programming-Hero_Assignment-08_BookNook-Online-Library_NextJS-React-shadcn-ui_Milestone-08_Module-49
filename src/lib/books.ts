/**
 *  SERVER ONLY: contains "use cache" functions. Client Components must import
 *  types and constants from "@/lib/books-config" instead. */

import { cacheLife, cacheTag } from "next/cache";

import {
  PAGE_SIZE,
  type Book,
  type BookQuery,
  type BooksResult,
} from "@/lib/books-config";

// Set NEXT_PUBLIC_API_URL=http://localhost:8000 in .env.local to use the real API.
// Without it (or if the API is down) the dummy data below is used.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* Dummy data */
const RAW: [string, string, string][] = [
  ["Atomic Habits", "James Clear", "Self-Help"],
  ["The Hobbit", "J.R.R. Tolkien", "Fantasy"],
  ["Sapiens", "Yuval Noah Harari", "History"],
  ["Dune", "Frank Herbert", "Sci-Fi"],
  ["Pride and Prejudice", "Jane Austen", "Classic"],
  ["The Alchemist", "Paulo Coelho", "Fiction"],
  ["The Hitchhiker's Guide to the Galaxy", "Douglas Adams", "Sci-Fi"],
  ["A Brief History of Time", "Stephen Hawking", "Science"],
  ["Gone Girl", "Gillian Flynn", "Mystery"],
  ["The Name of the Wind", "Patrick Rothfuss", "Fantasy"],
  ["Deep Work", "Cal Newport", "Self-Help"],
  ["Guns, Germs, and Steel", "Jared Diamond", "History"],
  ["To Kill a Mockingbird", "Harper Lee", "Classic"],
  ["The Da Vinci Code", "Dan Brown", "Mystery"],
  ["Cosmos", "Carl Sagan", "Science"],
  ["1984", "George Orwell", "Fiction"],
  ["Neuromancer", "William Gibson", "Sci-Fi"],
  ["The Fellowship of the Ring", "J.R.R. Tolkien", "Fantasy"],
  ["Thinking, Fast and Slow", "Daniel Kahneman", "Self-Help"],
  ["The Silk Roads", "Peter Frankopan", "History"],
  ["Great Expectations", "Charles Dickens", "Classic"],
  ["The Girl with the Dragon Tattoo", "Stieg Larsson", "Mystery"],
  ["The Selfish Gene", "Richard Dawkins", "Science"],
  ["Life of Pi", "Yann Martel", "Fiction"],
];

/** Dummy data, newest first (one book every two days) */
export const DUMMY_BOOKS: Book[] = RAW.map(([title, author, category], i) => ({
  _id: String(i + 1),
  title,
  author,
  category,
  image: `https://picsum.photos/seed/booknook-${i + 1}/480/640`,
  createdAt: new Date(Date.UTC(2026, 9, 28 - i * 2, 10)).toISOString(),
  totalCopies: 3,
  availableCopies: 3,
}));

function queryDummy({ category, search, sort, page }: BookQuery): BooksResult {
  let list = [...DUMMY_BOOKS];

  if (category)
    list = list.filter(
      (b) => b.category.toLowerCase() === category.toLowerCase(),
    );

  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (b) =>
        b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s),
    );
  }

  const by = {
    newest: (a: Book, b: Book) => b.createdAt.localeCompare(a.createdAt),
    oldest: (a: Book, b: Book) => a.createdAt.localeCompare(b.createdAt),
    "title-asc": (a: Book, b: Book) => a.title.localeCompare(b.title),
    "title-desc": (a: Book, b: Book) => b.title.localeCompare(a.title),
    "author-asc": (a: Book, b: Book) => a.author.localeCompare(b.author),
  }[sort];

  list.sort(by);

  const total = list.length;
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;

  return {
    books: list.slice(start, start + PAGE_SIZE),
    total,
    page: safePage,
    totalPages,
  };
}

/* Latest 8 */
async function fetchLatestBooks(): Promise<Book[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("books");

  const res = await fetch(`${API_URL}/api/books/latest`);

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  return (await res.json()) as Book[];
}

/** Latest 8 books, newest first (New Arrivals section) */
export async function getLatestBooks(): Promise<Book[]> {
  if (!API_URL) return DUMMY_BOOKS.slice(0, 8);

  try {
    return await fetchLatestBooks();
  } catch {
    return DUMMY_BOOKS.slice(0, 8);
  }
}

/* All books */
async function fetchBooks(q: BookQuery): Promise<BooksResult> {
  "use cache";
  cacheLife("minutes");
  cacheTag("books");

  const params = new URLSearchParams({
    page: String(q.page),
    limit: String(PAGE_SIZE),
    sort: q.sort,
  });

  if (q.category) params.set("category", q.category);
  if (q.search) params.set("search", q.search);

  const res = await fetch(`${API_URL}/api/books?${params.toString()}`);

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  return (await res.json()) as BooksResult;
}

/** Filtered, sorted, paginated books (10 per page) */
export async function getBooks(q: BookQuery): Promise<BooksResult> {
  if (!API_URL) return queryDummy(q);

  try {
    return await fetchBooks(q);
  } catch {
    return queryDummy(q);
  }
}

/**
 *
 * Single book
 * One book by id (Book Details page). Always fresh, because available copies change.
 *
 */

/**
 * Single book
 * One book by ID (Book Details page).
 * Always fresh, because available copies change.
 */
export async function getBookById(id: string): Promise<Book | null> {
  // Use dummy data when API is not configured
  if (!API_URL) {
    return DUMMY_BOOKS.find((book) => book._id === id) ?? null;
  }

  try {
    const res = await fetch(`${API_URL}/api/books/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });

    // Book genuinely doesn't exist
    if (res.status === 404 || res.status === 400) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    return (await res.json()) as Book;
  } catch {
    // Fallback to dummy data if API is unavailable
    return DUMMY_BOOKS.find((book) => book._id === id) ?? null;
  }
}

/* export async function getBookById(id: string): Promise<Book | null> {
  if (!API_URL) return DUMMY_BOOKS.find((b) => b._id === id) ?? null;

  const res = await fetch(`${API_URL}/api/books/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });

  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  return (await res.json()) as Book;
} */
