import "server-only";

import { apiFetch } from "@/lib/api";
import { ApiResponse } from "./dashboard-types";
import { getSessionUser } from "./session";

interface BorrowRecord {
  bookId: string;
  status: "borrowed" | "returned";
}

export interface DashboardStat {
  label: string;
  value: number;
  // icon: LucideIcon;
  icon: "book-plus" | "book-marked" | "repeat-2";
  href: string;
}

export async function getDashboardStats(): Promise<DashboardStat[]> {
  const user = await getSessionUser();

  if (!user) {
    return [];
  }

  try {
    const email = encodeURIComponent(user.email);

    const [booksResponse, borrowsResponse] = await Promise.all([
      apiFetch<ApiResponse<unknown[]>>(`/api/my-books?email=${email}`, {
        cache: "no-store",
      }),

      apiFetch<ApiResponse<BorrowRecord[]>>(`/api/borrows?email=${email}`, {
        cache: "no-store",
      }),
    ]);

    const booksAdded = booksResponse.data.length;
    const borrows = borrowsResponse.data;

    // Total borrowing records, including returned books.
    const booksBorrowed = borrows.length;

    // Currently active borrowings.
    const readingNow = borrows.filter(
      (borrow) => borrow.status === "borrowed",
    ).length;

    return [
      {
        label: "Books added",
        value: booksAdded,
        icon: "book-plus",
        href: "/my-books",
      },
      {
        label: "Books borrowed",
        value: booksBorrowed,
        icon: "book-marked",
        href: "/my-borrows",
      },
      {
        label: "Reading now",
        value: readingNow,
        icon: "repeat-2",
        href: "/my-borrows",
      },
    ];
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return [];
  }
}
