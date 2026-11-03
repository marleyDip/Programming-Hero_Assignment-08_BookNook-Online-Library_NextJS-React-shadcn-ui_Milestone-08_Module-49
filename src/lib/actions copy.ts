"use server";

/**
 * Server Actions. The user's name and email come from the Better Auth SESSION on the
 * server, never from the browser, so nobody can add, delete or borrow as someone else.
 */

import { revalidatePath, updateTag } from "next/cache";

import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/books-config";
import type { ActionResult, AddBookInput } from "@/lib/dashboard-types";
import { getSessionUser } from "@/lib/session";

const fail = (e: unknown, fallback: string): ActionResult => ({
  ok: false,
  error: e instanceof Error ? e.message : fallback,
});

export async function addBookAction(
  input: AddBookInput,
): Promise<ActionResult> {
  const user = await getSessionUser();

  if (!user) return { ok: false, error: "Please log in to add a book." };

  // server-side validation (the form validates too)
  if (!input.title.trim() || !input.author.trim())
    return { ok: false, error: "Title and author are required." };

  if (!CATEGORIES.includes(input.category))
    return { ok: false, error: "Please choose a valid category." };

  if (!input.image) return { ok: false, error: "Please upload a cover image." };

  if (!Number.isInteger(input.totalCopies) || input.totalCopies < 1)
    return { ok: false, error: "Total copies must be at least 1." };

  try {
    await apiFetch("/api/books", {
      method: "POST",
      body: JSON.stringify({
        ...input,
        ownerName: user.name, // from the session
        ownerEmail: user.email, // from the session
      }),
    });
  } catch (e) {
    return fail(e, "Could not add the book.");
  }

  updateTag("books"); // refresh the cached book lists (New Arrivals, All Books)
  revalidatePath("/my-books");

  return { ok: true, message: "Book added successfully!" };
}

export async function deleteBookAction(bookId: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Please log in first." };

  try {
    await apiFetch(
      `/api/books/${encodeURIComponent(bookId)}?email=${encodeURIComponent(user.email)}`,
      {
        method: "DELETE",
      },
    );
  } catch (e) {
    return fail(e, "Could not delete the book.");
  }

  updateTag("books");
  revalidatePath("/my-books");

  return { ok: true, message: "Book deleted." };
}

export async function borrowBookAction(bookId: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Please log in to borrow a book." };

  try {
    const data = await apiFetch<{ message: string }>("/api/borrows", {
      method: "POST",
      body: JSON.stringify({
        bookId,
        userEmail: user.email,
        userName: user.name,
      }),
    });
    updateTag("books"); // available copies changed
    revalidatePath("/my-borrows");

    return { ok: true, message: data.message };
  } catch (e) {
    return fail(e, "Could not borrow the book.");
  }
}

export async function returnBorrowAction(
  borrowId: string,
): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Please log in first." };

  try {
    const data = await apiFetch<{ message: string }>(
      `/api/borrows/${encodeURIComponent(borrowId)}/return`,
      {
        method: "PATCH",
        body: JSON.stringify({ userEmail: user.email }),
      },
    );
    updateTag("books");
    revalidatePath("/my-borrows");

    return { ok: true, message: data.message };
  } catch (e) {
    return fail(e, "Could not return the book.");
  }
}
