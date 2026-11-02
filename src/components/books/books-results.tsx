import { ArrowLeft, ArrowRight, BookX } from "lucide-react";
import Link from "next/link";

import BookCard from "@/components/common/book-card";
import { buttonVariants } from "@/components/ui/button";
import { getBooks } from "@/lib/books";
import { PAGE_SIZE, type BookQuery } from "@/lib/books-config";
import { cn } from "@/lib/utils";

/* Helpers */
function buildHref(query: BookQuery, page: number) {
  const p = new URLSearchParams();

  if (query.category) p.set("category", query.category);
  if (query.search) p.set("search", query.search);
  if (query.sort !== "newest") p.set("sort", query.sort);
  if (page > 1) p.set("page", String(page));
  const qs = p.toString();

  return qs ? `/books?${qs}` : "/books";
}

/** 1 … 4 5 [6] 7 8 … 20 */
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];
  const start = Math.max(current - 1, 2);
  const end = Math.min(current + 1, total - 1);

  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);

  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

/* Skeleton */
export function GridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{ animationDelay: `${(i % 6) * 80}ms` }}
          className="animate-pulse rounded-3xl border border-border/70 bg-card p-3"
        >
          <div className="aspect-3/4 rounded-2xl bg-muted" />

          <div className="space-y-3 px-2 pb-2 pt-5">
            <div className="h-5 w-3/4 rounded-full bg-muted" />
            <div className="h-4 w-1/2 rounded-full bg-muted" />
            <div className="h-11 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Results */
export default async function BooksResults({ query }: { query: BookQuery }) {
  const { books, total, page, totalPages } = await getBooks(query);

  /* Empty State */
  if (books.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
        <span className="grid size-20 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <BookX className="size-9" />
        </span>

        <h2 className="mt-6 text-xl font-semibold tracking-tight">
          No books found
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Nothing matches your search or filters. Try a different keyword,
          another category, or clear everything to see the whole shelf.
        </p>

        <Link
          href="/books"
          className={cn(
            buttonVariants(),
            "mt-6 h-11 rounded-full border-0 bg-linear-to-br from-emerald-500 to-teal-700 px-6 font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:text-white active:scale-95",
          )}
        >
          Clear all filters
        </Link>
      </div>
    );
  }

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = from + books.length - 1;
  const isPlainFirstPage =
    page === 1 && query.sort === "newest" && !query.category && !query.search;

  return (
    <div>
      <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
        Showing{" "}
        <span className="font-semibold text-foreground">
          {from}–{to}
        </span>{" "}
        of <span className="font-semibold text-foreground">{total}</span>{" "}
        {total === 1 ? "book" : "books"}
        {query.category && (
          <>
            {" "}
            in{" "}
            <span className="font-semibold text-foreground">
              {query.category}
            </span>
          </>
        )}
        {query.search && (
          <>
            {" "}
            for “
            <span className="font-semibold text-foreground">
              {query.search}
            </span>
            ”
          </>
        )}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book, i) => (
          <BookCard
            key={book._id}
            book={book}
            index={i}
            showBadge={isPlainFirstPage && i === 0}
          />
        ))}
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-14 flex flex-col items-center gap-4"
        >
          <ul className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-border/70 bg-card/80 p-1.5 shadow-sm backdrop-blur">
            <li>
              {page > 1 ? (
                <Link
                  href={buildHref(query, page - 1)}
                  aria-label="Previous page"
                  className="group flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium outline-none transition-all duration-300 hover:bg-emerald-500/10 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95 dark:hover:text-emerald-400"
                >
                  <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  <span className="hidden sm:inline">Prev</span>
                </Link>
              ) : (
                <span className="flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-muted-foreground/40">
                  <ArrowLeft className="size-4" />
                  <span className="hidden sm:inline">Prev</span>
                </span>
              )}
            </li>

            {pageList(page, totalPages).map((p, i) =>
              p === "…" ? (
                <li
                  key={`gap-${i}`}
                  className="px-1 text-muted-foreground"
                  aria-hidden
                >
                  …
                </li>
              ) : (
                <li key={p}>
                  <Link
                    href={buildHref(query, p)}
                    aria-label={`Page ${p}`}
                    aria-current={p === page ? "page" : undefined}
                    className={cn(
                      "grid size-10 place-items-center rounded-full text-sm font-medium tabular-nums outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-90",
                      p === page
                        ? "bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-700/30"
                        : "text-muted-foreground hover:-translate-y-0.5 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400",
                    )}
                  >
                    {p}
                  </Link>
                </li>
              ),
            )}

            <li>
              {page < totalPages ? (
                <Link
                  href={buildHref(query, page + 1)}
                  aria-label="Next page"
                  className="group flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium outline-none transition-all duration-300 hover:bg-emerald-500/10 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95 dark:hover:text-emerald-400"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <span className="flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-muted-foreground/40">
                  <span className="hidden sm:inline">Next</span>
                  <ArrowRight className="size-4" />
                </span>
              )}
            </li>
          </ul>

          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </p>
        </nav>
      )}
    </div>
  );
}
