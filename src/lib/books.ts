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
import { getApiToken } from "@/lib/server-auth";

// Set NEXT_PUBLIC_API_URL=http://localhost:5000 in .env.local to use the real API.
// Without it (or if the API is down) the dummy data below is used.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type PaginatedBooksData = {
  books: Book[];
  pagination?: {
    total: number;
    page: number;
    totalPages: number;
  };
  total?: number;
  page?: number;
  totalPages?: number;
};

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

/* Latest 8 */
async function fetchLatestBooks(): Promise<Book[]> {
  "use cache";

  cacheLife("minutes");
  cacheTag("books");

  const res = await fetch(`${API_URL}/api/books/latest`);

  if (!res.ok) {
    throw new Error(`Failed to fetch latest books: ${res.status}`);
  }

  const payload: ApiResponse<Book[]> = await res.json();

  if (!payload.success) {
    throw new Error(payload.message || "Failed to fetch latest books.");
  }

  return payload.data;
}

/** Latest 8 books, newest first (New Arrivals section) */
export async function getLatestBooks(): Promise<Book[]> {
  if (!API_URL) {
    return DUMMY_BOOKS.slice(0, 8);
  }

  try {
    const books = await fetchLatestBooks();
    return books.slice(0, 8);
  } catch (error) {
    console.error("Latest books fetch error:", error);

    return DUMMY_BOOKS.slice(0, 8);
  }
}

/* All books */
async function fetchBooks(q: BookQuery): Promise<PaginatedBooksData> {
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

  const payload: ApiResponse<PaginatedBooksData> = await res.json();

  if (!payload.success) {
    throw new Error(payload.message || "Failed to fetch books.");
  }

  return payload.data;
}

/** Filtered, sorted, paginated books */
export async function getBooks(q: BookQuery): Promise<BooksResult> {
  if (!API_URL) {
    return queryDummy(q);
  }

  try {
    const result = await fetchBooks(q);

    const total = result.pagination?.total ?? result.total;
    const page = result.pagination?.page ?? result.page ?? q.page;
    const totalPages = result.pagination?.totalPages ?? result.totalPages;

    if (total === undefined || totalPages === undefined) {
      throw new Error("Books response is missing pagination data.");
    }

    return {
      books: result.books,
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
    const token = await getApiToken();
    // console.log(token);

    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const res = await fetch(`${API_URL}/api/books/${encodeURIComponent(id)}`, {
      // headers: {
      //   authorization: "user logged in",
      // },

      // headers: {
      //   authorization: token,
      // },

      headers: {
        Authorization: `Bearer ${token}`,
      },

      cache: "no-store",
    });

    if (res.status === 400 || res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch book: ${res.status}`);
    }

    const payload: ApiResponse<Book> = await res.json();

    if (!payload.success) {
      throw new Error(payload.message || "Failed to fetch book.");
    }

    return payload.data;
  } catch (error) {
    console.error("Single book fetch error:", error);

    return getDummyBook(id);
  }
}
