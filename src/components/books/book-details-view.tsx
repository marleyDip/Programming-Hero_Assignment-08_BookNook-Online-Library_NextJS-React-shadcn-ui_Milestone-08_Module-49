"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock,
  Copy,
  Globe,
  Hash,
  Home,
  PenLine,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import BorrowPanel from "@/components/books/borrow-modal";
import { formatDate } from "@/components/dashboard/dash-ui";

import type { Book } from "@/lib/books-config";
import { BORROW_DAYS } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function DetailsSkeleton() {
  return (
    <div
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6"
      role="status"
      aria-label="Loading book"
    >
      <div className="mb-8 h-4 w-64 animate-pulse rounded-full bg-muted" />

      <div className="grid gap-10 lg:grid-cols-[22rem_1fr]">
        <div className="aspect-3/4 animate-pulse rounded-3xl bg-muted" />

        <div className="space-y-4">
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-muted" />
          <div className="h-5 w-1/3 animate-pulse rounded-full bg-muted" />
          <div className="h-40 animate-pulse rounded-3xl bg-muted" />
          <div className="h-32 animate-pulse rounded-3xl bg-muted" />
        </div>
      </div>

      <span className="sr-only">Loading</span>
    </div>
  );
}

function TiltCover({ book }: { book: Book }) {
  const [failed, setFailed] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 16 });
  const sy = useSpring(my, { stiffness: 120, damping: 16 });
  const rotateY = useTransform(sx, [-1, 1], [-16, 16]);
  const rotateX = useTransform(sy, [-1, 1], [12, -12]);
  const glowX = useTransform(sx, [-1, 1], ["20%", "80%"]);
  const glowY = useTransform(sy, [-1, 1], ["15%", "85%"]);

  return (
    <div className="relative perspective-distant">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-linear-to-br from-emerald-500/25 via-teal-400/10 to-amber-300/20 blur-3xl" />
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 30, rotateY: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
          my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className="relative aspect-3/4 overflow-hidden rounded-3xl bg-muted shadow-2xl shadow-emerald-950/30 ring-1 ring-black/10"
      >
        {failed || !book.image ? (
          <div className="grid h-full place-items-center bg-linear-to-br from-emerald-500 to-teal-700 p-8 text-center text-white">
            <div>
              <BookOpen className="mx-auto size-14 opacity-80" />
              <p className="mt-4 font-serif text-2xl font-bold leading-tight">
                {book.title}
              </p>
            </div>
          </div>
        ) : (
          <Image
            src={book.image}
            alt={`Cover of ${book.title}`}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}

        {/* spine shading & moving light */}
        <span className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-linear-to-r from-black/30 to-transparent" />
        <motion.span
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) =>
                `radial-linear(260px circle at ${x} ${y}, rgba(255,255,255,0.28), transparent 60%)`,
            ),
          }}
          className="pointer-events-none absolute inset-0"
        />
      </motion.div>
    </div>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5 text-emerald-600 dark:text-emerald-400" />{" "}
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold">{value}</p>
    </div>
  );
}

export default function BookDetailsView({
  book,
  isOwner,
  alreadyBorrowed,
}: {
  book: Book;
  isOwner: boolean;
  alreadyBorrowed: boolean;
}) {
  const total = book.totalCopies ?? 1;
  const available = book.availableCopies ?? total;
  const pct = total > 0 ? (available / total) * 100 : 0;

  const addedBy = book.ownerName || "BookNook community";
  const initials = addedBy
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative isolate">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-104 overflow-hidden">
        <div className="absolute -left-24 -top-24 size-96 rounded-full bg-emerald-400/15 blur-3xl" />

        <div className="absolute -right-20 top-10 size-80 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="absolute inset-0 [background-image:radial-linear(rgba(16,185,129,0.14)_1px,transparent_1px)] bg-size-[26px_26px] mask-[linear-linear(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-10">
        {/* breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-emerald-500/60"
          >
            <Home className="size-3.5" /> Home
          </Link>
          <ChevronRight className="size-3.5" />
          <Link
            href="/books"
            className="rounded outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-emerald-500/60"
          >
            All Books
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="line-clamp-1 text-foreground">{book.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-14">
          {/* left: cover */}
          <div className="mx-auto w-full max-w-sm lg:max-w-none">
            <div className="lg:sticky lg:top-24">
              <TiltCover book={book} />
            </div>
          </div>

          {/* right: info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={`/books?category=${encodeURIComponent(book.category)}`}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700 outline-none transition-all hover:bg-emerald-500/20 focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:text-emerald-400"
            >
              <Sparkles className="size-3.5" /> {book.category}
            </Link>

            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              {book.title}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-lg text-muted-foreground">
              <PenLine className="size-4" /> by{" "}
              <span className="font-medium text-foreground">{book.author}</span>
            </p>

            {/* availability */}
            <div className="mt-6 rounded-2xl border border-border/70 bg-card p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 font-medium">
                  <Copy className="size-4 text-emerald-600 dark:text-emerald-400" />{" "}
                  {available} of {total} {total === 1 ? "copy" : "copies"}{" "}
                  available
                </span>

                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    available > 0
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "bg-rose-500/15 text-rose-700 dark:text-rose-300",
                  )}
                >
                  {available > 0 ? "Available" : "All borrowed"}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    pct > 40
                      ? "bg-linear-to-r from-emerald-400 to-teal-500"
                      : "bg-linear-to-r from-amber-400 to-orange-500",
                  )}
                />
              </div>
            </div>

            {/* description */}
            <section className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                About this book
              </h2>

              <p className="mt-3 text-base leading-relaxed text-foreground/85">
                {book.description ||
                  "The owner hasn't added a description yet."}
              </p>
            </section>

            {/* meta */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Meta
                icon={ShieldCheck}
                label="Condition"
                value={book.condition || "Good"}
              />

              <Meta
                icon={Globe}
                label="Language"
                value={book.language || "English"}
              />

              <Meta
                icon={CalendarDays}
                label="Published"
                value={
                  book.publishedYear ? String(book.publishedYear) : "Not listed"
                }
              />

              <Meta
                icon={Hash}
                label="ISBN"
                value={book.isbn || "Not listed"}
              />

              <Meta
                icon={CalendarDays}
                label="Added on"
                value={formatDate(book.createdAt)}
              />

              <Meta icon={Copy} label="Total copies" value={String(total)} />
            </div>

            {/* added by */}
            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-linear-to-br from-emerald-500 to-teal-700 text-sm font-semibold text-white shadow-md shadow-emerald-700/25">
                {initials || <UserRound className="size-5" />}
              </span>

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Added by
                </p>

                <p className="truncate font-semibold">{addedBy}</p>
                {book.ownerEmail && (
                  <p className="truncate text-sm text-muted-foreground">
                    {book.ownerEmail}
                  </p>
                )}
              </div>
            </div>

            {/* borrow */}
            <div className="mt-8">
              <BorrowPanel
                book={book}
                isOwner={isOwner}
                alreadyBorrowed={alreadyBorrowed}
              />

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4 text-emerald-600 dark:text-emerald-400" />{" "}
                  {BORROW_DAYS}-day loan
                </span>

                <span className="inline-flex items-center gap-2">
                  <RotateCcw className="size-4 text-emerald-600 dark:text-emerald-400" />{" "}
                  Return anytime in one tap
                </span>

                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />{" "}
                  Free to borrow
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
