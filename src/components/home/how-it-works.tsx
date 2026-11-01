"use client";

/**
 * "How Borrowing Works" section
 * Place at: components/how-it-works.tsx
 */

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Check,
  Clock,
  Search,
  Undo2,
  type LucideIcon,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS: { id: string; icon: LucideIcon; title: string; text: string }[] = [
  {
    id: "browse",
    icon: Search,
    title: "Browse the shelf",
    text: "Explore books added by other readers. Search by title or author, or jump into a category you love.",
  },
  {
    id: "borrow",
    icon: BookMarked,
    title: "Borrow in one click",
    text: "Found something good? Borrow it for a few days. It lands in My Borrows straight away.",
  },
  {
    id: "read",
    icon: BookOpen,
    title: "Read at your pace",
    text: "Keep an eye on how many days you have left, so there are no surprises and no late fees.",
  },
  {
    id: "return",
    icon: Undo2,
    title: "Return with a tap",
    text: "Finished early? Return it from My Borrows so the next reader can enjoy it too.",
  },
];

const ROWS = [
  {
    title: "The Quiet Orchard",
    author: "Mira Lane",
    color: "from-emerald-300 to-emerald-600",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    color: "from-amber-200 to-amber-400",
  },
  {
    title: "Slow Tides",
    author: "Ines Duarte",
    color: "from-sky-200 to-sky-500",
  },
];

// Mock screens
function MiniCover({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-md bg-linear-to-br shadow-md ring-1 ring-black/10",
        color,
        className,
      )}
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-black/20" />
    </span>
  );
}

function ScreenBrowse() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-3 py-2.5 text-sm text-muted-foreground">
        <Search className="size-4" />
        Search title, author…
      </div>

      {ROWS.map((r, i) => (
        <motion.div
          key={r.title}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 * i, duration: 0.4 }}
          className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-2.5"
        >
          <MiniCover color={r.color} className="h-12 w-9" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold">{r.title}</p>
            <p className="text-xs text-muted-foreground">{r.author}</p>
          </div>

          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            Available
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function ScreenBorrow() {
  return (
    <div className="flex flex-col items-center text-center">
      <MiniCover
        color="from-amber-200 to-amber-400"
        className="h-40 w-28 rotate-[-4deg]"
      />

      <p className="mt-5 text-lg font-semibold">Atomic Habits</p>
      <p className="text-sm text-muted-foreground">James Clear</p>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
        <Clock className="size-3.5" /> Borrow for 5 days
      </div>

      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="mt-5 w-full rounded-full bg-linear-to-br from-emerald-500 to-teal-700 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/30"
      >
        Borrow this book
      </motion.div>
    </div>
  );
}

function ScreenRead() {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative grid size-40 place-items-center">
        <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            strokeWidth="9"
            className="stroke-muted"
          />

          <motion.circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            strokeWidth="9"
            strokeLinecap="round"
            className="stroke-emerald-500"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * 0.4 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>

        <div>
          <p className="text-4xl font-semibold tabular-nums">3</p>
          <p className="text-xs text-muted-foreground">days left</p>
        </div>
      </div>

      <p className="mt-5 text-lg font-semibold">Atomic Habits</p>
      <p className="text-sm text-muted-foreground">
        Due in 3 days. Plenty of time to finish the next chapter.
      </p>
    </div>
  );
}

function ScreenReturn() {
  return (
    <div className="flex flex-col items-center py-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        className="grid size-20 place-items-center rounded-full bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-xl shadow-emerald-700/30"
      >
        <Check className="size-10" strokeWidth={3} />
      </motion.div>

      <p className="mt-6 text-lg font-semibold">Returned. Thank you!</p>

      <p className="mt-1 max-w-[16rem] text-sm text-muted-foreground">
        The book is back on the shelf and ready for the next reader.
      </p>
    </div>
  );
}

const SCREENS = [ScreenBrowse, ScreenBorrow, ScreenRead, ScreenReturn];

// Section
export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // auto-advance, paused while the user hovers or focuses the section
  useEffect(() => {
    if (paused) return;

    const t = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 5000);

    return () => clearInterval(t);
  }, [paused, active]);

  const Screen = SCREENS[active];

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
          <BookMarked className="size-3.5" />
          How it works
        </span>

        <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Borrowing a book takes four simple steps
        </h2>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Add a book, borrow a book, return a book. That is the whole idea.
        </p>
      </div>

      <div
        className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* steps */}
        <div>
          <ol className="relative space-y-3">
            {STEPS.map((s, i) => {
              const isActive = i === active;
              const Icon = s.icon;

              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={isActive}
                    className={cn(
                      "group relative w-full overflow-hidden rounded-2xl border p-4 text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-emerald-500/60 sm:p-5",
                      isActive
                        ? "border-emerald-500/40 bg-card shadow-lg shadow-emerald-900/5"
                        : "border-transparent hover:border-border hover:bg-card/60",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          "grid size-11 shrink-0 place-items-center rounded-xl transition-all duration-300",
                          isActive
                            ? "bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-700/30"
                            : "bg-muted text-muted-foreground group-hover:scale-105 group-hover:text-emerald-600",
                        )}
                      >
                        <Icon className="size-5" />
                      </span>

                      <div className="flex-1">
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          Step {i + 1}
                        </p>

                        <p className="text-lg font-semibold tracking-tight">
                          {s.title}
                        </p>
                      </div>
                    </div>

                    {/* smooth expand */}
                    <div
                      className={cn(
                        "grid transition-all duration-500 ease-out",
                        isActive
                          ? "mt-3 grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <p className="overflow-hidden pl-15 text-sm leading-relaxed text-muted-foreground">
                        {s.text}
                      </p>
                    </div>

                    {/* progress bar for active step */}
                    {isActive && !paused && (
                      <motion.span
                        key={`p-${active}`}
                        className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-linear-to-r from-emerald-500 to-teal-500"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 5, ease: "linear" }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group mt-8 h-12 rounded-full border-0 bg-linear-to-br from-emerald-500 to-teal-700 px-7 text-base font-semibold text-white shadow-lg shadow-emerald-900/25 transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-xl active:scale-95",
            )}
          >
            Get started free
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* mock app panel (decorative) */}
        <div aria-hidden className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-linear-to-br from-emerald-500/20 via-teal-400/10 to-amber-300/10 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-2xl shadow-emerald-900/10">
            <div className="flex items-center gap-2 border-b border-border/70 px-5 py-3.5">
              <span className="size-2.5 rounded-full bg-rose-400/80" />
              <span className="size-2.5 rounded-full bg-amber-400/80" />
              <span className="size-2.5 rounded-full bg-emerald-400/80" />
              <span className="ml-3 text-xs font-medium text-muted-foreground">
                BookNook
              </span>
            </div>

            <div className="min-h-88 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3 }}
                >
                  <Screen />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
