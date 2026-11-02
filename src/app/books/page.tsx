import type { Metadata } from "next";
import { Suspense } from "react";

import BooksHeader from "@/components/books/books-header";
import BooksResults, { GridSkeleton } from "@/components/books/books-results";
import BooksToolbar, {
  ToolbarSkeleton,
} from "@/components/books/books-toolbar";
import {
  PAGE_SIZE,
  SORT_OPTIONS,
  type BookQuery,
  type SortValue,
} from "@/lib/books-config";

const description =
  "Browse every book shared by the BookNook community. Filter by category, search by title or author, and borrow for a few days.";

export const metadata: Metadata = {
  title: "All Books",
  description,
  keywords: [
    "browse books",
    "online library",
    "borrow books",
    "BookNook catalogue",
  ],
  alternates: { canonical: "/books" },

  openGraph: {
    title: "All Books | BookNook",
    description,
    url: "/books",
    siteName: "BookNook",
    type: "website",
  },

  twitter: { card: "summary", title: "All Books | BookNook", description },
};

type SearchParams = Promise<{
  category?: string;
  search?: string;
  sort?: string;
  page?: string;
}>;

async function ResultsGate({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const sort = (
    SORT_OPTIONS.some((o) => o.value === sp.sort) ? sp.sort : "newest"
  ) as SortValue;

  const query: BookQuery = {
    category: sp.category?.trim() || undefined,
    search: sp.search?.trim() || undefined,
    sort,
    page: Math.max(parseInt(sp.page ?? "1", 10) || 1, 1),
  };

  // keyed Suspense => the skeleton shows again every time the filters or page change
  return (
    <Suspense
      key={JSON.stringify(query)}
      fallback={<GridSkeleton count={PAGE_SIZE} />}
    >
      <BooksResults query={query} />
    </Suspense>
  );
}

export default function BooksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="relative isolate">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8">
        <BooksHeader />

        <div className="mt-10">
          <Suspense fallback={<ToolbarSkeleton />}>
            <BooksToolbar />
          </Suspense>
        </div>

        <div className="mt-8">
          <Suspense fallback={<GridSkeleton count={PAGE_SIZE} />}>
            <ResultsGate searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
