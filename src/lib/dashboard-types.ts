/** client-safe types and constants */

export const BORROW_DAYS = 5;

export type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor?: string;
  bookImage: string;
  userEmail: string;
  borrowDate: string; // when it was borrowed
  returnDate: string; // the date it should be returned by
  returnedAt: string | null; // when it was actually returned
  status: "borrowed" | "returned";
  daysLeft: number; // calculated on the server
};

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export type AddBookInput = {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  isbn: string;
  publishedYear: string;
  language: string;
  condition: string;
};

export type UpdateBookInput = AddBookInput;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
