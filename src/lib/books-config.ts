/* Types and constants only. Safe to import from Client Components. */

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  createdAt: string; // ISO date
  description?: string;
  totalCopies?: number;
  availableCopies?: number;
  isbn?: string;
  publishedYear?: number | null;
  language?: string;
  condition?: string;
  ownerName?: string;
  ownerEmail?: string;
};

// export type Book = {
//   _id: string;
//   title: string;
//   author: string;
//   category: string;
//   image: string;
//   createdAt: string; // ISO date
// };

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
  "Kids",
  "Others",
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
