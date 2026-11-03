/** private: guarded by proxy.ts */

import { BookMarked } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { DashHeader } from "@/components/dashboard/dash-header";
import { ErrorNote, ListSkeleton } from "@/components/dashboard/dash-ui";
import MyBooksView from "@/components/dashboard/my-books-view";

import { apiFetch } from "@/lib/api";
import type { Book } from "@/lib/books-config";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "My Books",
  description: "The books you have shared on BookNook.",
  robots: { index: false, follow: false },
};

async function MyBooksData() {
  const user = await getSessionUser();

  if (!user) redirect("/login?callbackUrl=/my-books");

  let books: Book[];
  try {
    books = await apiFetch<Book[]>(
      `/api/my-books?email=${encodeURIComponent(user.email)}`,
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Please try again.";

    return <ErrorNote message={message} />;
  }

  return <MyBooksView books={books} />;
}

export default function MyBooksPage() {
  return (
    <>
      <DashHeader
        icon={BookMarked}
        title="My books"
        subtitle="Every book you've shared, and how many copies are still on the shelf."
      />

      <Suspense fallback={<ListSkeleton />}>
        <MyBooksData />
      </Suspense>
    </>
  );
}

/* Error: Avoid constructing JSX within try/catch

async function MyBooksData() {
  const user = await getSessionUser();
  if (!user) redirect("/login?callbackUrl=/my-books");

  try {
    const books = await apiFetch<Book[]>(
      `/api/my-books?email=${encodeURIComponent(user.email)}`,
    );
    return <MyBooksView books={books} />;
  } catch (e) {
    return (
      <ErrorNote
        message={e instanceof Error ? e.message : "Please try again."}
      />
    );
  }
}
*/
