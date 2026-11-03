"use client";

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
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { EmptyState, StatTile } from "@/components/dashboard/dash-ui";
import { returnBorrowAction } from "@/lib/actions";
import { BORROW_DAYS, type Borrow } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";

/** Small 3D tilting cover */
function TiltCover({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 14 });
  const sy = useSpring(my, { stiffness: 180, damping: 14 });
  const rotateY = useTransform(sx, [-1, 1], [-22, 22]);
  const rotateX = useTransform(sy, [-1, 1], [18, -18]);

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
        className="relative h-28 w-20 overflow-hidden rounded-xl bg-muted shadow-xl shadow-black/20 ring-1 ring-black/10"
      >
        {failed || !src ? (
          <div className="grid h-full place-items-center bg-linear-to-br from-emerald-500 to-teal-700 text-white">
            <BookOpen className="size-6 opacity-80" />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={`Cover of ${title}`}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
        <span className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/0 via-white/10 to-white/35" />
      </motion.div>
    </div>
  );
}

function BorrowCard({ b, index }: { b: Borrow; index: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const active = b.status === "borrowed";
  const overdue = active && b.daysLeft < 0;
  const soon = active && b.daysLeft >= 0 && b.daysLeft <= 1;
  const pct = Math.min(Math.max((b.daysLeft / BORROW_DAYS) * 100, 0), 100);

  function onReturn() {
    startTransition(async () => {
      const res = await returnBorrowAction(b._id);
      if (res.ok) {
        toast.success(res.message);
        router.refresh();
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
      initial={{ opacity: 0, y: 26, rotateX: 14 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        delay: Math.min(index, 8) * 0.06,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ transformPerspective: 1000 }}
      className="flex gap-4 rounded-3xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-900/10 sm:gap-5 sm:p-5"
    >
      {/*  <TiltCover src={b.image} title={b.title} /> */}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-base font-semibold tracking-tight sm:text-lg">
              {b.title}
            </h3>
            <p className="truncate text-sm text-muted-foreground">{b.author}</p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
              chip.cls,
            )}
          >
            {chip.text}
          </span>
        </div> */}

        {/*  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" /> Borrowed{" "}
            {formatDate(b.borrowedAt)}
          </span>
          {active ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" /> Due {formatDate(b.dueDate)}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" /> Returned{" "}
              {formatDate(b.returnedAt)}
            </span>
          )}
        </div> */}

        {active && (
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
            aria-hidden
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overdue ? 100 : pct}%` }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                overdue
                  ? "bg-rose-500"
                  : soon
                    ? "bg-linear-to-r from-amber-400 to-orange-500"
                    : "bg-linear-to-r from-emerald-400 to-teal-500",
              )}
            />
          </div>
        )}

        {active && (
          <div className="mt-auto pt-4">
            <button
              type="button"
              onClick={onReturn}
              disabled={pending}
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-linear-to-br from-emerald-500 to-teal-700 px-5 text-sm font-semibold text-white shadow-md shadow-emerald-700/25 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:translate-y-0 active:scale-95 disabled:opacity-70"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Undo2 className="size-4 transition-transform duration-300 group-hover:-rotate-12" />
              )}
              {pending ? "Returning" : "Return book"}
            </button>
          </div>
        )}
      </div>
    </motion.li>
  );
}

export default function MyBorrowsView({ borrows }: { borrows: Borrow[] }) {
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

      {list.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center text-sm text-muted-foreground">
          {tab === "active"
            ? "No active borrows. Time to find your next read!"
            : "Your returned books will appear here."}
        </p>
      ) : (
        <ul className="space-y-4">
          <AnimatePresence initial={false} mode="popLayout">
            {list.map((b, i) => (
              <BorrowCard key={b._id} b={b} index={i} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
