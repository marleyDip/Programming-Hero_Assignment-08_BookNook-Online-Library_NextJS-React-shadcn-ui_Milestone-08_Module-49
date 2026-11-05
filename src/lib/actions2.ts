"use server";

/**
 * Server Actions. The user's name and email come from the Better Auth SESSION on the
 * server, never from the browser, so nobody can add, delete or borrow as someone else.
 */

import { revalidatePath, updateTag } from "next/cache";

import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/books-config";
import type {
  ActionResult,
  AddBookInput,
  ApiResponse,
  UpdateBookInput,
} from "@/lib/dashboard-types";
import { getSessionUser } from "@/lib/session";

const fail = (e: unknown, fallback: string): ActionResult => ({
  ok: false,
  error: e instanceof Error ? e.message : fallback,
});

export async function addBookAction(
  input: AddBookInput,
): Promise<ActionResult> {
  const user = await getSessionUser();

  if (!user) {
    return { ok: false, error: "Please log in to add a book." };
  }

  // 1. Validate required fields
  if (
    typeof input.title !== "string" ||
    !input.title.trim() ||
    typeof input.author !== "string" ||
    !input.author.trim()
  ) {
    return {
      ok: false,
      error: "Title and author are required.",
    };
  }

  // 2. Validate category
  if (!CATEGORIES.includes(input.category)) {
    return {
      ok: false,
      error: "Please choose a valid category.",
    };
  }

  // 3. Validate image
  if (typeof input.image !== "string" || !input.image.trim()) {
    return {
      ok: false,
      error: "Please upload a cover image.",
    };
  }

  // 4. Validate total copies
  if (
    !Number.isInteger(input.totalCopies) ||
    input.totalCopies < 1 ||
    input.totalCopies > 100
  ) {
    return {
      ok: false,
      error: "Total copies must be between 1 and 100.",
    };
  }

  try {
    // 5. Send request
    const response = await apiFetch<ApiResponse<unknown>>("/api/books", {
      method: "POST",
      body: JSON.stringify({
        ...input,
        title: input.title.trim(),
        author: input.author.trim(),
        image: input.image.trim(),

        // Backend derives ownership from JWT
        // ownerName: user.name,
        // ownerEmail: user.email,
      }),
    });

    if (!response.success) {
      return {
        ok: false,
        error: response.message || "Could not add the book.",
      };
    }

    // 6. Revalidate cached data
    updateTag("books");
    revalidatePath("/my-books");

    return {
      ok: true,
      message: response.message || "Book added successfully!",
    };
  } catch (error) {
    return fail(error, "Could not add the book.");
  }
}

export async function updateBookAction(
  bookId: string,
  input: UpdateBookInput,
): Promise<ActionResult> {
  // 1. Authentication
  const user = await getSessionUser();

  if (!user) {
    return { ok: false, error: "Please log in first." };
  }

  // 2. Validate book ID
  if (!/^[a-f\d]{24}$/i.test(bookId)) {
    return { ok: false, error: "Invalid book ID." };
  }

  // 3. Validate required fields
  if (!input.title?.trim() || !input.author?.trim()) {
    return {
      ok: false,
      error: "Title and author are required.",
    };
  }

  // 4. Validate category
  if (!CATEGORIES.includes(input.category)) {
    return {
      ok: false,
      error: "Please choose a valid category.",
    };
  }

  // 5. Validate total copies
  if (
    !Number.isInteger(input.totalCopies) ||
    input.totalCopies < 1 ||
    input.totalCopies > 100
  ) {
    return {
      ok: false,
      error: "Total copies must be between 1 and 100.",
    };
  }

  try {
    // 6. Update book through backend API
    const response = await apiFetch<ApiResponse<unknown>>(
      `/api/books/${encodeURIComponent(bookId)}?email=${encodeURIComponent(user.email)}`,
      {
        method: "PUT",
        body: JSON.stringify(input),
      },
    );

    if (!response.success) {
      return {
        ok: false,
        error: response.message || "Could not update the book.",
      };
    }

    // 7. Revalidate Next.js cache
    updateTag("books");

    revalidatePath("/my-books");
    revalidatePath(`/books/${bookId}`);

    // 8. Success
    return {
      ok: true,
      message: response.message || "Book updated successfully!",
    };
  } catch (e) {
    return fail(e, "Could not update the book.");
  }
}

export async function deleteBookAction(bookId: string): Promise<ActionResult> {
  const user = await getSessionUser();

  if (!user) {
    return {
      ok: false,
      error: "Please log in first.",
    };
  }

  // Validate MongoDB ObjectId
  if (!/^[a-f\d]{24}$/i.test(bookId)) {
    return {
      ok: false,
      error: "Invalid book ID.",
    };
  }

  try {
    const response = await apiFetch<ApiResponse<{ _id: string }>>(
      `/api/books/${encodeURIComponent(bookId)}?email=${encodeURIComponent(user.email)}`,
      {
        method: "DELETE",
      },
    );

    if (!response.success) {
      return {
        ok: false,
        error: response.message || "Could not delete the book.",
      };
    }

    // Invalidate cached book data
    updateTag("books");
    revalidatePath("/my-books");
    revalidatePath(`/books/${bookId}`);

    return {
      ok: true,
      message: response.message || "Book deleted successfully.",
    };
  } catch (error) {
    return fail(error, "Could not delete the book.");
  }
}

export async function borrowBookAction(bookId: string): Promise<ActionResult> {
  const user = await getSessionUser();

  if (!user) {
    return {
      ok: false,
      error: "Please log in to borrow a book.",
    };
  }

  // Validate MongoDB ObjectId
  if (!/^[a-f\d]{24}$/i.test(bookId)) {
    return {
      ok: false,
      error: "Invalid book ID.",
    };
  }

  try {
    const response = await apiFetch<
      ApiResponse<{
        _id: string;
        bookId: string;
        returnDate: string;
        status: "borrowed";
      }>
    >("/api/borrows", {
      method: "POST",
      body: JSON.stringify({
        bookId,
        userEmail: user.email,
        userName: user.name,
      }),
    });

    if (!response.success) {
      return {
        ok: false,
        error: response.message || "Could not borrow the book.",
      };
    }

    // Update cached book availability
    updateTag("books");

    // Refresh borrowing-related data
    revalidatePath("/my-borrows");

    return {
      ok: true,
      message: response.message || "Book borrowed successfully!",
    };
  } catch (error) {
    return fail(error, "Could not borrow the book.");
  }
}

export async function returnBorrowAction(
  borrowId: string,
): Promise<ActionResult> {
  const user = await getSessionUser();

  if (!user) {
    return {
      ok: false,
      error: "Please log in first.",
    };
  }

  if (!/^[a-f\d]{24}$/i.test(borrowId)) {
    return {
      ok: false,
      error: "Invalid borrowing ID.",
    };
  }

  try {
    const response = await apiFetch<
      ApiResponse<{
        _id: string;
        bookId: string;
        status: "returned";
        returnedAt: string;
      }>
    >(`/api/borrows/${encodeURIComponent(borrowId)}/return`, {
      method: "PATCH",
      body: JSON.stringify({
        userEmail: user.email,
      }),
    });

    if (!response.success) {
      return {
        ok: false,
        error: response.message || "Could not return the book.",
      };
    }

    // Refresh book availability
    updateTag("books");

    // Refresh borrowing records
    revalidatePath("/my-borrows");

    return {
      ok: true,
      message: response.message || "Book returned successfully!",
    };
  } catch (error) {
    return fail(error, "Could not return the book.");
  }
}
