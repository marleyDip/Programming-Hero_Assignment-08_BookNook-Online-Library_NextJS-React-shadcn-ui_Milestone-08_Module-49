import { Repeat2 } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { DashHeader } from "@/components/dashboard/dash-header";
import { ErrorNote, ListSkeleton } from "@/components/dashboard/dash-ui";
import MyBorrowsView from "@/components/dashboard/my-borrows-view";

import { apiFetch } from "@/lib/api";
import { ApiResponse, Borrow } from "@/lib/dashboard-types";
import { getSessionUser } from "@/lib/session";
import { getDaysLeft } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "My Borrows",
  description: "The books you are borrowing from BookNook.",
  robots: { index: false, follow: false },
};

async function MyBorrowsData() {
  const user = await getSessionUser();

  if (!user) redirect("/login?callbackUrl=/my-borrows");

  let borrows: Borrow[];

  try {
    const response =
      await apiFetch<ApiResponse<Omit<Borrow, "daysLeft">[]>>("/api/borrows");

    if (!response.success || !response.data) {
      throw new Error(
        response.message || "Could not load your borrowing records.",
      );
    }

    // Calculate days left on the server
    const now = new Date().getTime();

    borrows = response.data.map((borrow) => ({
      ...borrow,
      daysLeft: getDaysLeft(borrow.returnDate, now),
    }));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Please try again.";

    return <ErrorNote message={message} />;
  }

  return <MyBorrowsView borrows={borrows} />;
}

export default function MyBorrowsPage() {
  return (
    <>
      <DashHeader
        icon={Repeat2}
        title="My borrows"
        subtitle="Keep track of what you're reading and return books in one tap."
      />

      <Suspense fallback={<ListSkeleton />}>
        <MyBorrowsData />
      </Suspense>
    </>
  );
}

/* 
let borrows: Borrow[];

  try {
    const raw = await apiFetch<Omit<Borrow, "daysLeft">[]>(
      `/api/borrows?email=${encodeURIComponent(user.email)}`,
    );

    // days left are worked out here on the server (after the session lookup, so the page is already dynamic)
    const now = new Date().getTime();

    borrows = raw.map((b) => ({
      ...b,
      daysLeft: getDaysLeft(b.returnDate, now),
    }));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Please try again.";

    return <ErrorNote message={message} />;
  }

*/

/* 
try {
  const raw = await apiFetch<Omit<Borrow, "daysLeft">[]>(
    `/api/borrows?email=${encodeURIComponent(user.email)}`,
  );

  // days left are worked out here on the server (after the session lookup, so the page is already dynamic)
  const now = Date.now();
  const borrows: Borrow[] = raw.map((b) => ({
    ...b,
    daysLeft: Math.ceil((new Date(b.dueDate).getTime() - now) / 86_400_000),
  }));

  return <MyBorrowsView borrows={borrows} />;
} catch (e) {
  return (
    <ErrorNote
      message={e instanceof Error ? e.message : "Please try again."}
    />
  );
}
*/
