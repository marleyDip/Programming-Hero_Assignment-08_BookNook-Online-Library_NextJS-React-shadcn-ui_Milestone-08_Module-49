/** Place at: src/lib/books.ts  (replaces the earlier version)
 *  SERVER ONLY: contains "use cache" functions. Client Components must import
 *  types and constants from "@/lib/books-config" instead. */

import { cacheLife, cacheTag } from "next/cache";

import {
  PAGE_SIZE,
  type Book,
  type BookQuery,
  type BooksResult,
} from "@/lib/books-config";

// Set NEXT_PUBLIC_API_URL=http://localhost:5000 in .env.local to use the real API.
// Without it (or if the API is down) the dummy data below is used.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getDummyBook(id: string): Book | null {
  return DUMMY_BOOKS.find((book) => book._id === id) ?? null;
}

/* Dummy data */
const RAW: [string, string, string][] = [
  ["Atomic Habits", "James Clear", "Others"],
  ["The Hobbit", "J.R.R. Tolkien", "Kids"],
  ["Sapiens", "Yuval Noah Harari", "History"],
  ["Dune", "Frank Herbert", "Science"],
  ["Pride and Prejudice", "Jane Austen", "Fiction"],
  ["The Alchemist", "Paulo Coelho", "Fiction"],
  ["The Hitchhiker's Guide to the Galaxy", "Douglas Adams", "Science"],
  ["A Brief History of Time", "Stephen Hawking", "Science"],
  ["Gone Girl", "Gillian Flynn", "Fiction"],
  ["The Name of the Wind", "Patrick Rothfuss", "Kids"],
  ["Deep Work", "Cal Newport", "Others"],
  ["Guns, Germs, and Steel", "Jared Diamond", "History"],
  ["To Kill a Mockingbird", "Harper Lee", "Fiction"],
  ["The Da Vinci Code", "Dan Brown", "Fiction"],
  ["Cosmos", "Carl Sagan", "Science"],
  ["1984", "George Orwell", "Fiction"],
  ["Neuromancer", "William Gibson", "Science"],
  ["The Fellowship of the Ring", "J.R.R. Tolkien", "Kids"],
  ["Thinking, Fast and Slow", "Daniel Kahneman", "Others"],
  ["The Silk Roads", "Peter Frankopan", "History"],
  ["Great Expectations", "Charles Dickens", "Fiction"],
  ["The Girl with the Dragon Tattoo", "Stieg Larsson", "Fiction"],
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

function queryList(
  source: Book[],
  { category, search, sort, page }: BookQuery,
): BooksResult {
  let list = [...source];

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

const queryDummy = (q: BookQuery) => queryList(DUMMY_BOOKS, q);

/* Latest 6 */
async function fetchLatestBooks(): Promise<Book[]> {
  "use cache";

  cacheLife("minutes");
  cacheTag("books");

  const res = await fetch(`${API_URL}/api/books/latest`);

  if (!res.ok) {
    throw new Error(`Failed to fetch latest books: ${res.status}`);
  }

  const payload: unknown = await res.json();

  // Support previous API: Book[]
  if (Array.isArray(payload)) {
    return payload as Book[];
  }

  // Support updated API: { success, message, data }
  if (isRecord(payload)) {
    if (payload.success === false) {
      throw new Error("Failed to fetch latest books.");
    }

    if (Array.isArray(payload.data)) {
      return payload.data as Book[];
    }
  }

  throw new Error("Invalid latest books API response.");
}

/** Latest 8 books, newest first (New Arrivals section) */
export async function getLatestBooks(): Promise<Book[]> {
  if (!API_URL) return DUMMY_BOOKS.slice(0, 8);

  try {
    const books = await fetchLatestBooks();
    return books.slice(0, 8);
  } catch (error) {
    console.error("Latest books fetch error:", error);

    return DUMMY_BOOKS.slice(0, 8);
  }
}

/* All books */
async function fetchBooks(q: BookQuery): Promise<unknown> {
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

  if (!res.ok) {
    throw new Error(`Failed to fetch books: ${res.status}`);
  }

  return res.json();
}

/** Filtered, sorted, paginated books */
export async function getBooks(q: BookQuery): Promise<BooksResult> {
  if (!API_URL) {
    return queryDummy(q);
  }

  try {
    const payload = await fetchBooks(q);

    // Support previous API: Book[]
    if (Array.isArray(payload)) {
      return queryList(payload as Book[], q);
    }

    if (!isRecord(payload)) {
      throw new Error("Invalid books API response.");
    }

    if (payload.success === false) {
      throw new Error("Books API returned an unsuccessful response.");
    }

    // Support both:
    // New: { success, data: { books, pagination } }
    // Old: { books, total, page, totalPages }
    const result = isRecord(payload.data) ? payload.data : payload;

    if (!Array.isArray(result.books)) {
      throw new Error("Books array not found in API response.");
    }

    const pagination = isRecord(result.pagination) ? result.pagination : result;

    const books = result.books as Book[];

    const total = Number(pagination.total ?? books.length);
    const page = Number(pagination.page ?? q.page);
    const totalPages = Number(
      pagination.totalPages ?? Math.max(Math.ceil(total / PAGE_SIZE), 1),
    );

    return {
      books,
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error("Books fetch error:", error);

    return queryDummy(q);
  }
}

/* ===== Single book ===== */
/** One book by ID (Book Details page). Always fresh. */
export async function getBookById(id: string): Promise<Book | null> {
  if (!API_URL) {
    return getDummyBook(id);
  }

  try {
    const res = await fetch(`${API_URL}/api/books/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });

    // Book genuinely doesn't exist or ID is invalid
    if (res.status === 404 || res.status === 400) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch book: ${res.status}`);
    }

    const payload: unknown = await res.json();

    if (!isRecord(payload)) {
      throw new Error("Invalid book API response.");
    }

    if (payload.success === false) {
      throw new Error(
        typeof payload.message === "string"
          ? payload.message
          : "Failed to fetch book.",
      );
    }

    // Updated API: { success, message, data: Book }
    // Previous API: Book
    const book = "data" in payload ? payload.data : payload;

    if (!isRecord(book) || typeof book._id !== "string") {
      throw new Error("Book data is missing or invalid.");
    }

    return book as unknown as Book;
  } catch (error) {
    console.error("Single book fetch error:", error);

    // Fallback to dummy data if API is unavailable
    return getDummyBook(id);
  }
}

/* All books */
/* async function fetchBooks(q: BookQuery): Promise<unknown> {
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
  return await res.json();
} */

/** Filtered, sorted, paginated books (10 per page) */
/* export async function getBooks(q: BookQuery): Promise<BooksResult> {
  if (!API_URL) return queryDummy(q);
  try {
    const data = await fetchBooks(q);

    // new API: { books, total, page, totalPages }
    if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as BooksResult).books)
    ) {
      const r = data as BooksResult;
      return {
        books: r.books,
        total: r.total ?? r.books.length,
        page: r.page ?? q.page,
        totalPages: r.totalPages ?? 1,
      };
    }

    // old API that still returns a plain array: filter, sort and page it here
    if (Array.isArray(data)) return queryList(data as Book[], q);

    throw new Error("Unexpected response from the books API");
  } catch {
    return queryDummy(q);
  }
} */

/* Single book */
/** One book by id (Book Details page). Always fresh, because available copies change. */
/* export async function getBookById(id: string): Promise<Book | null> {
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
} */

/* export async function getBookById(id: string): Promise<Book | null> {
  if (!API_URL) return DUMMY_BOOKS.find((b) => b._id === id) ?? null;

  const res = await fetch(`${API_URL}/api/books/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as Book;
} */
