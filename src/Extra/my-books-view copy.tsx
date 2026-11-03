"use client";

/** Place at: src/components/dashboard/my-books-view.tsx */

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BookMarked,
  BookOpen,
  CalendarDays,
  Copy,
  Eye,
  Library,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  EmptyState,
  StatTile,
  formatDate,
} from "@/components/dashboard/dash-ui";
import { deleteBookAction } from "@/lib/actions";
import type { Book } from "@/lib/books-config";
import { cn } from "@/lib/utils";

/** A card that FLIPS in 3D to ask "are you sure?" before deleting */
function MyBookCard({ book, index }: { book: Book; index: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  const total = book.totalCopies ?? 1;
  const available = book.availableCopies ?? total;
  const borrowed = total - available;
  const pct = total > 0 ? (available / total) * 100 : 0;

  function onDelete() {
    startTransition(async () => {
      const res = await deleteBookAction(book._id);
      if (res.ok) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.error);
        setConfirming(false);
      }
    });
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 30, rotateX: 14 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        delay: Math.min(index, 8) * 0.06,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ transformPerspective: 1000 }}
      className="perspective-[1100px]"
    >
      <motion.div
        animate={{ rotateY: confirming ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        className="grid"
      >
        {/* ---- front ---- */}
        <div
          className="group [grid-area:1/1] flex gap-4 rounded-3xl border border-border/70 bg-card p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-900/10"
          style={{ backfaceVisibility: "hidden" }}
          aria-hidden={confirming}
        >
          <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-md">
            {imgFailed || !book.image ? (
              <div className="grid h-full place-items-center bg-linear-to-br from-emerald-500 to-teal-700 text-white">
                <BookOpen className="size-8 opacity-80" />
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.image}
                alt={`Cover of ${book.title}`}
                loading="lazy"
                onError={() => setImgFailed(true)}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <span className="w-fit rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {book.category}
            </span>
            <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug tracking-tight">
              {book.title}
            </h3>
            <p className="truncate text-sm text-muted-foreground">
              {book.author}
            </p>

            {/* copies bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Copy className="size-3" /> {available} of {total} available
                </span>
                {borrowed > 0 && (
                  <span className="text-amber-600 dark:text-amber-400">
                    {borrowed} borrowed
                  </span>
                )}
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 0.9,
                    delay: 0.2 + index * 0.05,
                    ease: "easeOut",
                  }}
                  className={cn(
                    "h-full rounded-full",
                    pct > 40
                      ? "bg-linear-to-r from-emerald-400 to-teal-500"
                      : "bg-linear-to-r from-amber-400 to-orange-500",
                  )}
                />
              </div>
            </div>

            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3" /> Added{" "}
              {formatDate(book.createdAt)}
            </p>

            <div className="mt-auto flex gap-2 pt-3">
              <Link
                href={`/books/${book._id}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-xs font-medium outline-none transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-500/10 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95"
              >
                <Eye className="size-3.5" /> View
              </Link>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-xs font-medium text-rose-600 outline-none transition-all duration-300 hover:border-rose-500/40 hover:bg-rose-500/10 focus-visible:ring-2 focus-visible:ring-rose-500/50 active:scale-95 dark:text-rose-400"
              >
                <Trash2 className="size-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>

        {/* ---- back (confirm) ---- */}
        <div
          className="[grid-area:1/1] flex flex-col items-center justify-center rounded-3xl border border-rose-500/30 bg-linear-to-br from-rose-500/10 to-card p-6 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          aria-hidden={!confirming}
        >
          <span className="grid size-12 place-items-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="size-6" />
          </span>
          <p className="mt-3 font-semibold">Delete this book?</p>
          <p className="mt-1 line-clamp-2 max-w-56 text-sm text-muted-foreground">
            “{book.title}” will be removed from the library. This can&apos;t be
            undone.
          </p>
          <div className="mt-4 flex gap-2.5">
            <button
              type="button"
              disabled={pending}
              onClick={() => setConfirming(false)}
              tabIndex={confirming ? 0 : -1}
              className="h-10 rounded-full border border-border px-5 text-sm font-medium outline-none transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95 disabled:opacity-60"
            >
              Keep it
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={onDelete}
              tabIndex={confirming ? 0 : -1}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-rose-600 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-700/25 outline-none transition-all hover:bg-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500/60 active:scale-95 disabled:opacity-70"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Yes, delete
            </button>
          </div>
        </div>
      </motion.div>
    </motion.li>
  );
}

export default function MyBooksView({ books }: { books: Book[] }) {
  if (books.length === 0) {
    return (
      <EmptyState
        icon={BookMarked}
        title="You haven't added any books yet"
        text="Share a book you've finished and let another reader enjoy it. It only takes a minute."
        href="/add-book"
        cta="Add your first book"
      />
    );
  }

  const totalCopies = books.reduce((n, b) => n + (b.totalCopies ?? 1), 0);
  const available = books.reduce(
    (n, b) => n + (b.availableCopies ?? b.totalCopies ?? 1),
    0,
  );

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatTile icon={Library} label="Titles added" value={books.length} />
        <StatTile
          icon={Copy}
          label="Total copies"
          value={totalCopies}
          delay={0.08}
        />
        <StatTile
          icon={BookOpen}
          label="Available now"
          value={available}
          delay={0.16}
        />
      </div>

      <div className="mb-4 mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Your books</h2>
        <Link
          href="/add-book"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-linear-to-br from-emerald-500 to-teal-700 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-700/25 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95"
        >
          <Plus className="size-4" /> Add book
        </Link>
      </div>

      <ul className="grid gap-5 2xl:grid-cols-2">
        {books.map((b, i) => (
          <MyBookCard key={b._id} book={b} index={i} />
        ))}
      </ul>
    </div>
  );
}
