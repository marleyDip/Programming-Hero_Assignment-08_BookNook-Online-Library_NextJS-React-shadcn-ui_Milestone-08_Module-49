// public route: /books

import { Library } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

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
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-112 overflow-hidden">
        <div className="absolute -left-24 -top-24 size-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -right-20 top-10 size-80 rounded-full bg-amber-300/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.16)_1px,transparent_1px)] bg-size-[26px_26px] mask-[linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
            <Library className="size-3.5" />
            All books
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Explore the whole shelf
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every title shared by our readers. Search, filter by category and
            sort to find your next borrow.
          </p>
        </header>

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
