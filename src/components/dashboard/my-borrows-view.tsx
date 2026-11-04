"use client";

/** Place at: src/components/dashboard/my-borrows-view.tsx
 *  A table: Image, Title, Borrow Date, Return Date and a "Return Book" button. */

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Loader2,
  Repeat2,
  Undo2,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  EmptyState,
  StatTile,
  formatDate,
} from "@/components/dashboard/dash-ui";
import { returnBorrowAction } from "@/lib/actions";
import { BORROW_DAYS, type Borrow } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";
import Image from "next/image";

/** Small 3D tilting cover */
function TiltCover({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 14 });
  const sy = useSpring(my, { stiffness: 180, damping: 14 });
  const rotateY = useTransform(sx, [-1, 1], [-24, 24]);
  const rotateX = useTransform(sy, [-1, 1], [20, -20]);

  return (
    <div className="perspective-[600px]">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
          my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className="relative h-20 w-14 overflow-hidden rounded-lg bg-muted shadow-lg shadow-black/25 ring-1 ring-black/10"
      >
        {failed || !src ? (
          <div className="grid h-full place-items-center bg-linear-to-br from-emerald-500 to-teal-700 text-white">
            <BookOpen className="size-5 opacity-80" />
          </div>
        ) : (
          <Image
            src={src}
            alt={`Cover of ${title}`}
            fill
            sizes="56px"
            loading="lazy"
            onError={() => setFailed(true)}
            className="object-cover"
          />
        )}

        <span className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/0 via-white/10 to-white/35" />
      </motion.div>
    </div>
  );
}

const COLS =
  "md:grid-cols-[4.5rem_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_9.5rem]";

function BorrowRow({
  b,
  index,
  onReturned,
}: {
  b: Borrow;
  index: number;
  onReturned: (id: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const active = b.status === "borrowed";
  const overdue = active && b.daysLeft < 0;
  const soon = active && b.daysLeft >= 0 && b.daysLeft <= 1;

  function onReturn() {
    startTransition(async () => {
      const res = await returnBorrowAction(b._id);
      if (res.ok) {
        toast.success(res.message);
        onReturned(b._id);
      } else {
        toast.error(res.error);
      }
    });
  }

  const chip = !active
    ? { text: "Returned", cls: "bg-muted text-muted-foreground" }
    : overdue
      ? {
          text: `${Math.abs(b.daysLeft)} day${Math.abs(b.daysLeft) === 1 ? "" : "s"} overdue`,
          cls: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
        }
      : soon
        ? {
            text: b.daysLeft === 0 ? "Due today" : "1 day left",
            cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
          }
        : {
            text: `${b.daysLeft} days left`,
            cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
          };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, x: 40, scale: 0.97, transition: { duration: 0.3 } }}
      transition={{
        delay: Math.min(index, 8) * 0.05,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ transformPerspective: 1000 }}
      className={cn(
        "grid items-center gap-x-4 gap-y-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-900/10",
        "grid-cols-[4.5rem_1fr]",
        COLS,
      )}
    >
      {/* image */}
      <div className="row-span-2 md:row-span-1">
        <TiltCover src={b.bookImage} title={b.bookTitle} />
      </div>

      {/* title */}
      <div className="min-w-0">
        <p className="line-clamp-2 font-semibold leading-snug tracking-tight">
          {b.bookTitle}
        </p>
        {b.bookAuthor && (
          <p className="truncate text-xs text-muted-foreground">
            {b.bookAuthor}
          </p>
        )}
        <span
          className={cn(
            "mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
            chip.cls,
          )}
        >
          {chip.text}
        </span>
      </div>

      {/* borrow date */}
      <div className="col-span-1 text-sm md:col-span-1">
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:hidden">
          Borrow date
        </p>
        <p className="font-medium tabular-nums">{formatDate(b.borrowDate)}</p>
      </div>

      {/* return date */}
      <div className="text-sm">
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:hidden">
          Return date
        </p>
        <p
          className={cn(
            "font-medium tabular-nums",
            overdue && "text-rose-600 dark:text-rose-400",
          )}
        >
          {formatDate(b.returnDate)}
        </p>
        {!active && b.returnedAt && (
          <p className="text-xs text-muted-foreground">
            Returned {formatDate(b.returnedAt)}
          </p>
        )}
      </div>

      {/* action */}
      <div className="col-span-2 md:col-span-1 md:justify-self-end">
        {active ? (
          <button
            type="button"
            onClick={onReturn}
            disabled={pending}
            className="group inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-linear-to-br from-emerald-500 to-teal-700 px-5 text-sm font-semibold text-white shadow-md shadow-emerald-700/25 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:translate-y-0 active:scale-95 disabled:opacity-70 md:w-auto"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Undo2 className="size-4 transition-transform duration-300 group-hover:-rotate-12" />
            )}
            {pending ? "Returning" : "Return Book"}
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-emerald-500" /> Done
          </span>
        )}
      </div>
    </motion.li>
  );
}

export default function MyBorrowsView({
  borrows: initial,
}: {
  borrows: Borrow[];
}) {
  const [borrows, setBorrows] = useState(initial);
  const [tab, setTab] = useState<"active" | "history">("active");

  if (borrows.length === 0) {
    return (
      <EmptyState
        icon={Repeat2}
        title="You haven't borrowed anything yet"
        text={`Find a book you like and borrow it for ${BORROW_DAYS} days. It will show up here.`}
        href="/books"
        cta="Browse books"
      />
    );
  }

  const active = borrows.filter((b) => b.status === "borrowed");
  const history = borrows.filter((b) => b.status === "returned");
  const overdue = active.filter((b) => b.daysLeft < 0).length;
  const list = tab === "active" ? active : history;

  function markReturned(id: string) {
    setBorrows((all) =>
      all.map((b) =>
        b._id === id
          ? {
              ...b,
              status: "returned" as const,
              returnedAt: new Date().toISOString(),
            }
          : b,
      ),
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatTile icon={BookOpen} label="Reading now" value={active.length} />
        <StatTile
          icon={CheckCircle2}
          label="Returned"
          value={history.length}
          delay={0.08}
        />
        <StatTile icon={Clock} label="Overdue" value={overdue} delay={0.16} />
      </div>

      {/* tabs */}
      <div
        role="tablist"
        className="mb-5 mt-8 inline-flex gap-1 rounded-full border border-border/70 bg-card p-1 shadow-sm"
      >
        {(
          [
            ["active", `Active (${active.length})`],
            ["history", `History (${history.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "relative rounded-full px-5 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500/60",
              tab === id
                ? "text-white"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab === id && (
              <motion.span
                layoutId="borrow-tab"
                className="absolute inset-0 rounded-full bg-linear-to-br from-emerald-500 to-teal-700 shadow-md shadow-emerald-700/30"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      {/* table header (desktop) */}
      {list.length > 0 && (
        <div
          role="row"
          className={cn(
            "mb-2 hidden gap-x-4 px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:grid",
            COLS,
          )}
        >
          <span>Image</span>
          <span>Title</span>
          <span>Borrow date</span>
          <span>Return date</span>
          <span className="justify-self-end">Action</span>
        </div>
      )}

      {list.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center text-sm text-muted-foreground">
          {tab === "active"
            ? "No active borrows. Time to find your next read!"
            : "Your returned books will appear here."}
        </p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {list.map((b, i) => (
              <BorrowRow
                key={b._id}
                b={b}
                index={i}
                onReturned={markReturned}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
