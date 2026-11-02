"use client";

/**
 *  Search & category chips & sort. All state lives in the URL (?category=&search=&sort=&page=)
 *  so links from the home page (e.g. /books?category=Fantasy) just work.
 */

import { motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import SortDropdown from "@/components/books/sort-dropdown";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/books-config";
import { cn } from "@/lib/utils";

export function ToolbarSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="h-12 flex-1 animate-pulse rounded-full bg-muted" />
        <div className="h-12 w-full animate-pulse rounded-full bg-muted sm:w-60" />
      </div>

      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-24 shrink-0 animate-pulse rounded-full bg-muted"
          />
        ))}
      </div>
    </div>
  );
}

export default function BooksToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const category = params.get("category") ?? "";
  const urlSearch = params.get("search") ?? "";
  const sort = params.get("sort") ?? "newest";

  const [search, setSearch] = useState(urlSearch);

  function update(updates: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());

    for (const [k, v] of Object.entries(updates)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }

    if (!("page" in updates)) next.delete("page"); // any filter change goes back to page 1

    const qs = next.toString();
    startTransition(() =>
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }),
    );
  }

  // debounce the search box (400ms) before touching the URL
  useEffect(() => {
    const value = search.trim();
    if (value === urlSearch) return;

    const t = setTimeout(() => {
      const next = new URLSearchParams(params.toString());

      if (value) next.set("search", value);
      else next.delete("search");
      next.delete("page");

      const qs = next.toString();
      startTransition(() =>
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }),
      );
    }, 400);
    return () => clearTimeout(t);
  }, [search, urlSearch, params, pathname, router]);

  const hasFilters = Boolean(category || urlSearch || sort !== "newest");

  function clearAll() {
    setSearch("");
    startTransition(() => router.push(pathname, { scroll: false }));
  }

  return (
    <div className="space-y-4">
      {/* search + sort */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="group relative flex-1">
          <Search className="pointer-events-none absolute left-5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-emerald-500" />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author"
            aria-label="Search books"
            className="h-12 w-full rounded-full border border-border bg-card pl-12 pr-24 text-sm shadow-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/60 hover:border-emerald-500/40 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 [&::-webkit-search-cancel-button]:hidden"
          />

          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {isPending && (
              <Loader2 className="size-4 animate-spin text-emerald-500" />
            )}

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="grid size-7 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        <SortDropdown
          value={sort}
          onChange={(v) => update({ sort: v === "newest" ? null : v })}
        />
      </div>

      {/* category chips */}
      <div
        role="tablist"
        aria-label="Filter by category"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {["All", ...CATEGORIES].map((c) => {
          const value = c === "All" ? "" : c;
          const active = category.toLowerCase() === value.toLowerCase();

          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => update({ category: value || null })}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95",
                active
                  ? "text-white"
                  : "border border-border/80 bg-card/70 text-muted-foreground hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400",
              )}
            >
              {active && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-full bg-linear-to-br from-emerald-500 to-teal-700 shadow-md shadow-emerald-700/30"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{c}</span>
            </button>
          );
        })}
      </div>

      {/* active filters */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active:</span>

          {category && (
            <FilterChip
              label={`Category: ${category}`}
              onRemove={() => update({ category: null })}
            />
          )}

          {urlSearch && (
            <FilterChip
              label={`Search: ${urlSearch}`}
              onRemove={() => {
                setSearch("");
                update({ search: null });
              }}
            />
          )}

          {sort !== "newest" && (
            <FilterChip
              label={SORT_OPTIONS.find((o) => o.value === sort)?.label ?? sort}
              onRemove={() => update({ sort: null })}
            />
          )}

          <button
            type="button"
            onClick={clearAll}
            className="rounded-full px-2 py-1 text-xs font-medium text-emerald-600 underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:text-emerald-400"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-1 pl-3 pr-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300"
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
        className="grid size-5 place-items-center rounded-full outline-none transition-colors hover:bg-emerald-500/20 focus-visible:ring-2 focus-visible:ring-emerald-500/60"
      >
        <X className="size-3" />
      </button>
    </motion.span>
  );
}
