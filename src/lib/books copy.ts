/** Place at: src/lib/books.ts  (replaces the earlier version) */

import { cacheLife, cacheTag } from "next/cache";

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  createdAt: string; // ISO date
};

export const PAGE_SIZE = 10;
export const CATEGORIES = [
  "Fiction",
  "Fantasy",
  "Sci-Fi",
  "History",
  "Self-Help",
  "Classic",
  "Mystery",
  "Science",
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title: A to Z" },
  { value: "title-desc", label: "Title: Z to A" },
  { value: "author-asc", label: "Author: A to Z" },
] as const;
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export type BookQuery = {
  category?: string;
  search?: string;
  sort: SortValue;
  page: number;
};
export type BooksResult = {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
};

// Set NEXT_PUBLIC_API_URL=http://localhost:5000 in .env.local to use the real API.
// Without it (or if the API is down) the dummy data below is used.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ----------------------------- Dummy data ----------------------------- */
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

/* ------------------------------ Latest 6 ------------------------------ */
async function fetchLatestBooks(): Promise<Book[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("books");

  const res = await fetch(`${API_URL}/api/books/latest`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as Book[];
}

/** Latest 6 books, newest first (New Arrivals section) */
export async function getLatestBooks(): Promise<Book[]> {
  if (!API_URL) return DUMMY_BOOKS.slice(0, 6);
  try {
    return await fetchLatestBooks();
  } catch {
    return DUMMY_BOOKS.slice(0, 6);
  }
}

/* ------------------------------- All books ------------------------------- */
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

// /** Place at: lib/books.ts */

// import { cacheLife, cacheTag } from "next/cache";

// export type Book = {
//   _id: string;
//   title: string;
//   author: string;
//   category: string;
//   image: string;
//   createdAt: string; // ISO date
// };

// // Set NEXT_PUBLIC_API_URL=http://localhost:5000 in .env.local to use the real API.
// // If it is missing (or the API is down) the dummy data below is used instead.
// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// /** Dummy data, already sorted newest first */
// export const DUMMY_BOOKS: Book[] = [
//   {
//     _id: "1",
//     title: "Atomic Habits",
//     author: "James Clear",
//     category: "Self-Help",
//     image: "https://picsum.photos/seed/booknook-1/480/640",
//     createdAt: "2026-10-28T10:00:00.000Z",
//   },
//   {
//     _id: "2",
//     title: "The Hobbit",
//     author: "J.R.R. Tolkien",
//     category: "Fantasy",
//     image: "https://picsum.photos/seed/booknook-2/480/640",
//     createdAt: "2026-10-26T10:00:00.000Z",
//   },
//   {
//     _id: "3",
//     title: "Sapiens",
//     author: "Yuval Noah Harari",
//     category: "History",
//     image: "https://picsum.photos/seed/booknook-3/480/640",
//     createdAt: "2026-10-24T10:00:00.000Z",
//   },
//   {
//     _id: "4",
//     title: "Dune",
//     author: "Frank Herbert",
//     category: "Sci-Fi",
//     image: "https://picsum.photos/seed/booknook-4/480/640",
//     createdAt: "2026-10-21T10:00:00.000Z",
//   },
//   {
//     _id: "5",
//     title: "Pride and Prejudice",
//     author: "Jane Austen",
//     category: "Classic",
//     image: "https://picsum.photos/seed/booknook-5/480/640",
//     createdAt: "2026-10-18T10:00:00.000Z",
//   },
//   {
//     _id: "6",
//     title: "The Alchemist",
//     author: "Paulo Coelho",
//     category: "Fiction",
//     image: "https://picsum.photos/seed/booknook-6/480/640",
//     createdAt: "2026-10-15T10:00:00.000Z",
//   },
// ];

// /** Cached fetch (Cache Components). Throws on failure so errors are never cached. */
// async function fetchLatestBooks(): Promise<Book[]> {
//   "use cache";
//   cacheLife("minutes"); // refreshes in the background about every minute
//   cacheTag("books"); // lets you invalidate it right after a book is added

//   const res = await fetch(`${API_URL}/api/books/latest`);
//   if (!res.ok) throw new Error(`Request failed: ${res.status}`);

//   return (await res.json()) as Book[];
// }

// /** Latest 6 books, newest first. Uses the Express API when configured. */
// export async function getLatestBooks(): Promise<Book[]> {
//   if (!API_URL) return DUMMY_BOOKS;

//   try {
//     return await fetchLatestBooks();
//   } catch {
//     return DUMMY_BOOKS;
//   }
// }
