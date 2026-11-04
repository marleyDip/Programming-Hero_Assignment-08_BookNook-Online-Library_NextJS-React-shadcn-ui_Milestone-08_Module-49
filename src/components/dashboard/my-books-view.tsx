"use client";

/** Place at: src/components/dashboard/my-books-view.tsx
 *  Cards with Edit (opens a pre-filled form) and Delete (opens a confirm modal). */

import { AnimatePresence, motion } from "framer-motion";
import {
  BookMarked,
  BookOpen,
  CalendarDays,
  Copy,
  Eye,
  Library,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import Modal from "@/components/common/modal";
import {
  EmptyState,
  StatTile,
  formatDate,
} from "@/components/dashboard/dash-ui";
import EditBookModal from "@/components/dashboard/edit-book-modal";
import { deleteBookAction } from "@/lib/actions";
import type { Book } from "@/lib/books-config";
import { cn } from "@/lib/utils";
import Image from "next/image";

function MyBookCard({
  book,
  index,
  onEdit,
  onDelete,
}: {
  book: Book;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  const total = book.totalCopies ?? 1;
  const available = book.availableCopies ?? total;
  const borrowed = total - available;
  const pct = total > 0 ? (available / total) * 100 : 0;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 30, rotateX: 14 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{
        opacity: 0,
        scale: 0.9,
        rotateX: -12,
        transition: { duration: 0.3 },
      }}
      transition={{
        delay: Math.min(index, 8) * 0.06,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ transformPerspective: 1000 }}
      className="group flex gap-4 rounded-3xl border border-border/70 bg-card p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-900/10"
    >
      <div className="relative h-40 w-28 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-md">
        {imgFailed || !book.image ? (
          <div className="grid h-full place-items-center bg-linear-to-br from-emerald-500 to-teal-700 text-white">
            <BookOpen className="size-8 opacity-80" />
          </div>
        ) : (
          <Image
            src={book.image}
            alt={`Cover of ${book.title}`}
            fill
            sizes="112px"
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
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

        <p className="truncate text-sm text-muted-foreground">{book.author}</p>

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
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
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
          <CalendarDays className="size-3" /> Added {formatDate(book.createdAt)}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-3">
          <Link
            href={`/books/${book._id}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-xs font-medium outline-none transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-500/10 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95"
          >
            <Eye className="size-3.5" /> View
          </Link>

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-xs font-medium outline-none transition-all duration-300 hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500/50 active:scale-95 dark:hover:text-sky-300"
          >
            <Pencil className="size-3.5" /> Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-xs font-medium text-rose-600 outline-none transition-all duration-300 hover:border-rose-500/40 hover:bg-rose-500/10 focus-visible:ring-2 focus-visible:ring-rose-500/50 active:scale-95 dark:text-rose-400"
          >
            <Trash2 className="size-3.5" /> Delete
          </button>
        </div>
      </div>
    </motion.li>
  );
}

export default function MyBooksView({ books: initial }: { books: Book[] }) {
  // console.log(initial);

  const [books, setBooks] = useState(initial);
  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    if (!deleting) return;
    const target = deleting;

    startTransition(async () => {
      const res = await deleteBookAction(target._id);

      if (res.ok) {
        setBooks((list) => list.filter((b) => b._id !== target._id)); // gone from the UI...
        setDeleting(null); // ...and from the database (done by the action)
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
    });
  }

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
        <AnimatePresence mode="popLayout">
          {books.map((b, i) => (
            <MyBookCard
              key={b._id}
              book={b}
              index={i}
              onEdit={() => setEditing(b)}
              onDelete={() => setDeleting(b)}
            />
          ))}
        </AnimatePresence>
      </ul>

      {/* edit modal: key resets the form with the right old data each time */}
      {editing && (
        <EditBookModal
          key={editing._id}
          book={editing}
          open
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setBooks((list) =>
              list.map((b) => (b._id === updated._id ? updated : b)),
            );

            setEditing(null);
          }}
        />
      )}

      {/* delete confirm modal */}
      <Modal
        open={!!deleting}
        onClose={() => !pending && setDeleting(null)}
        title="Delete this book?"
        description="This can't be undone."
        icon={Trash2}
        tone="danger"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          “
          <span className="font-semibold text-foreground">
            {deleting?.title}
          </span>
          ” will be permanently removed from the library and from your list.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={() => setDeleting(null)}
            className="h-11 rounded-full border border-border px-6 text-sm font-medium outline-none transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={pending}
            onClick={confirmDelete}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-rose-600 px-6 text-sm font-semibold text-white shadow-lg shadow-rose-700/25 outline-none transition-all hover:bg-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500/60 active:scale-95 disabled:opacity-70"
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            {pending ? "Deleting" : "Yes, delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
