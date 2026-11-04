"use client";

/* "Borrow This Book" button & the confirm modal (name and email are read-only). */

import {
  BookMarked,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  User,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import Modal from "@/components/common/modal";
import { formatDate } from "@/components/dashboard/dash-ui";

import { borrowBookAction } from "@/lib/actions";
import { authClient } from "@/lib/auth-client";
import type { Book } from "@/lib/books-config";
import { BORROW_DAYS } from "@/lib/dashboard-types";
import Image from "next/image";

function ReadOnly({
  label,
  icon: Icon,
  value,
}: {
  label: string;
  icon: LucideIcon;
  value: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <div className="flex h-12 items-center gap-3 rounded-xl border border-dashed border-border bg-muted/50 px-4 text-sm text-muted-foreground">
        <Icon className="size-4.5 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{value || "Loading…"}</span>
        <Lock className="size-3.5 shrink-0" aria-label="Read only" />
      </div>
    </div>
  );
}

export default function BorrowPanel({
  book,
  isOwner,
  alreadyBorrowed,
}: {
  book: Book;
  isOwner: boolean;
  alreadyBorrowed: boolean;
}) {
  const router = useRouter();
  const { data } = authClient.useSession();
  const user = data?.user;

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [dates, setDates] = useState({ today: "", returnBy: "" });

  const available = book.availableCopies ?? book.totalCopies ?? 1;

  async function confirmBorrow() {
    setBusy(true);
    const toastId = toast.loading("Borrowing…");

    try {
      const res = await borrowBookAction(book._id); // name & email are taken from the session on the server

      if (res.ok) {
        toast.success(res.message, { id: toastId });
        setOpen(false);
        router.push("/my-borrows");
      } else {
        toast.error(res.error, { id: toastId });
      }
    } catch {
      toast.error("Could not borrow this book. Please try again.", {
        id: toastId,
      });
    } finally {
      setBusy(false);
    }
  }

  function openModal() {
    const now = Date.now(); // fine here: this runs on click, not during render
    setDates({
      today: new Date(now).toISOString(),
      returnBy: new Date(now + BORROW_DAYS * 86_400_000).toISOString(),
    });

    setOpen(true);
  }

  /* ---- blocked states ---- */
  if (isOwner || alreadyBorrowed || available < 1) {
    const info = isOwner
      ? {
          icon: BookOpen,
          title: "This is your book",
          text: "You can edit it any time from My Books.",
          href: "/my-books",
          cta: "Go to My Books",
        }
      : alreadyBorrowed
        ? {
            icon: CheckCircle2,
            title: "You've borrowed this book",
            text: "Return it from My Borrows when you're done.",
            href: "/my-borrows",
            cta: "Go to My Borrows",
          }
        : {
            icon: XCircle,
            title: "No copies available right now",
            text: "All copies are borrowed. Check back soon.",
            href: "/books",
            cta: "Browse other books",
          };

    const Icon = info.icon;

    return (
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/70 bg-muted/40 p-4">
        <span className="grid size-11 place-items-center rounded-xl bg-background text-muted-foreground">
          <Icon className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-semibold">{info.title}</p>
          <p className="text-sm text-muted-foreground">{info.text}</p>
        </div>

        <Link
          href={info.href}
          className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-medium outline-none transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95"
        >
          {info.cta}
        </Link>
      </div>
    );
  }

  // dates shown in the modal (today, and today & loan period)
  // const today = new Date(Date.now()).toISOString();
  // const returnBy = new Date(
  //   Date.now() + BORROW_DAYS * 86_400_000,
  // ).toISOString();

  // const now = new Date();

  // const today = now.toISOString();
  // const returnBy = new Date(
  //   now.getTime() + BORROW_DAYS * 86_400_000,
  // ).toISOString();

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        // onClick={() => setOpen(true)}
        className="group relative inline-flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 to-teal-700 px-8 text-base font-semibold text-white shadow-xl shadow-emerald-900/25 outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-700/30 focus-visible:ring-4 focus-visible:ring-emerald-500/30 active:translate-y-0 active:scale-[0.99] sm:w-auto"
      >
        <BookMarked className="size-5 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
        Borrow This Book
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </button>

      <Modal
        open={open}
        onClose={() => !busy && setOpen(false)}
        title="Borrow this book"
        description="Check the details, then confirm."
        icon={BookMarked}
      >
        {/* the book */}
        <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-muted/40 p-3">
          <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-muted shadow-md">
            {imgFailed || !book.image ? (
              <div className="grid h-full place-items-center bg-linear-to-br from-emerald-500 to-teal-700 text-white">
                <BookOpen className="size-5" />
              </div>
            ) : (
              <Image
                src={book.image}
                alt={`Cover of ${book.title}`}
                fill
                sizes="56px"
                onError={() => setImgFailed(true)}
                className="object-cover"
              />
            )}
          </div>

          <div className="min-w-0">
            <p className="line-clamp-2 font-semibold leading-snug">
              {book.title}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {book.author}
            </p>
          </div>
        </div>

        {/* read-only user */}
        <div className="mt-5 space-y-4">
          <ReadOnly label="User name" icon={User} value={user?.name ?? ""} />
          <ReadOnly label="Email" icon={Mail} value={user?.email ?? ""} />
        </div>

        {/* dates */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-border/70 p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" /> Borrow date
            </p>

            <p className="mt-1 font-semibold tabular-nums">
              {formatDate(dates.today)}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
            <p className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
              <CalendarCheck className="size-3.5" /> Return by
            </p>

            <p className="mt-1 font-semibold tabular-nums">
              {formatDate(dates.returnBy)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={busy}
            className="h-11 rounded-full border border-border px-6 text-sm font-medium outline-none transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={confirmBorrow}
            disabled={busy || !user}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-linear-to-br from-emerald-500 to-teal-700 px-7 text-sm font-semibold text-white shadow-lg shadow-emerald-900/25 outline-none transition-all cursor-pointer hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:translate-y-0 active:scale-95 disabled:opacity-70"
          >
            {busy && <Loader2 className="size-4 animate-spin" />}

            {busy ? "Borrowing" : "Confirm Borrow"}
          </button>
        </div>
      </Modal>
    </>
  );
}
