/** Place at: components/new-arrivals.tsx  (server component) */

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { buttonVariants } from "@/components/ui/button";
import { getLatestBooks } from "@/lib/books";
import { cn } from "@/lib/utils";
import BookCard from "./book-card";

const CATEGORIES = [
  "Fiction",
  "Fantasy",
  "Sci-Fi",
  "History",
  "Self-Help",
  "Classic",
];

async function LatestBooks() {
  const books = await getLatestBooks();

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book, i) => (
        <BookCard key={book._id} book={book} index={i} />
      ))}
    </div>
  );
}

function CardsSkeleton() {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      aria-hidden
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
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

export default function NewArrivals() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
      {/* heading */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
          <Sparkles className="size-3.5" />
          New Arrivals
        </span>

        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Fresh on the shelf this week
        </h2>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          The six newest books added by our readers. Pick one up and borrow it
          for a few days.
        </p>
      </div>

      {/* cards */}
      <div className="mt-12 sm:mt-14">
        <Suspense fallback={<CardsSkeleton />}>
          <LatestBooks />
        </Suspense>
      </div>

      {/* see all & categories */}
      <div className="mt-14 flex flex-col items-center gap-8">
        <Link
          href="/books"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group relative h-12 overflow-hidden rounded-full border-0 bg-linear-to-br from-emerald-500 to-teal-700 px-8 text-base font-semibold text-white shadow-lg shadow-emerald-900/25 transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-xl hover:shadow-emerald-700/30 active:translate-y-0 active:scale-95",
          )}
        >
          <span className="relative z-10 flex items-center gap-2">
            See All Books
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>

          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </Link>

        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Looking for something specific? Browse by category
          </p>

          <div className="flex flex-wrap justify-center gap-2.5">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/books?category=${encodeURIComponent(c)}`}
                className="rounded-full border border-border/80 bg-card/70 px-4 py-2 text-sm font-medium text-muted-foreground outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95 dark:hover:text-emerald-400"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
