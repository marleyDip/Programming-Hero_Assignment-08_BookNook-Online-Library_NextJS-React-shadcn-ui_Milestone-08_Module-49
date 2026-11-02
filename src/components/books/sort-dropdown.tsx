"use client";

/**
 * "Glass spotlight" sort menu
 *  - trigger with an animated gradient border
 *  - frosted-glass panel with a spotlight that follows your cursor
 *  - grouped options with descriptions and a highlight that glides between rows
 *  - number keys 1-5 pick an option instantly
 *  - becomes a bottom sheet on phones
 */

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowUpDown,
  Check,
  ChevronDown,
  Clock,
  History,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { SORT_OPTIONS } from "@/lib/books-config";
import { cn } from "@/lib/utils";

const META: Record<string, { icon: LucideIcon; hint: string }> = {
  newest: { icon: Clock, hint: "Latest additions first" },
  oldest: { icon: History, hint: "Longest on the shelf first" },
  "title-asc": { icon: ArrowDownAZ, hint: "A to Z by book title" },
  "title-desc": { icon: ArrowUpAZ, hint: "Z to A by book title" },
  "author-asc": { icon: UserRound, hint: "A to Z by author name" },
};

const GROUPS = [
  { label: "Date added", values: ["newest", "oldest"] },
  { label: "Title", values: ["title-asc", "title-desc"] },
  { label: "Author", values: ["author-asc"] },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function SortDropdown({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const n = SORT_OPTIONS.length;
  const selectedIndex = Math.max(
    SORT_OPTIONS.findIndex((o) => o.value === value),
    0,
  );

  const current = SORT_OPTIONS[selectedIndex];
  const CurrentIcon = META[current.value]?.icon ?? ArrowUpDown;
  const isCustom = value !== "newest";

  function openMenu() {
    setActive(selectedIndex);
    setOpen(true);
  }

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  function choose(i: number) {
    onChange(SORT_OPTIONS[i].value);
    close();
  }

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus({ preventScroll: true });
  }, [open]);

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openMenu();
    }
  }

  function onListKeyDown(e: React.KeyboardEvent) {
    if (/^[1-9]$/.test(e.key)) {
      const idx = Number(e.key) - 1;

      if (idx < n) {
        e.preventDefault();
        choose(idx);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => (i + 1) % n);
        break;

      case "ArrowUp":
        e.preventDefault();
        setActive((i) => (i - 1 + n) % n);
        break;

      case "Home":
        e.preventDefault();
        setActive(0);
        break;

      case "End":
        e.preventDefault();
        setActive(n - 1);
        break;

      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;

      case "Escape":
        e.preventDefault();
        close();
        break;

      case "Tab":
        close(false);
        break;
    }
  }

  return (
    <div ref={rootRef} className={cn("relative sm:w-64", className)}>
      {/* trigger with animated gradient border */}
      <div className="group relative overflow-hidden rounded-full p-[1.5px] shadow-sm">
        <span
          aria-hidden
          className={cn(
            "absolute inset-[-150%] bg-[conic-gradient(from_0deg,#34d399,#14b8a6,#fcd34d,#34d399)] opacity-0 transition-opacity duration-300 animation-duration-[3s] group-hover:animate-spin group-hover:opacity-100",
            open && "animate-spin opacity-100",
          )}
        />

        <span aria-hidden className="absolute inset-0 rounded-full bg-border" />

        <button
          ref={triggerRef}
          type="button"
          onClick={() => (open ? close(false) : openMenu())}
          onKeyDown={onTriggerKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-label={`Sort books, currently ${current.label}`}
          className="relative flex h-[2.8rem] w-full items-center gap-3 rounded-full bg-card px-4 text-left outline-none transition-colors focus-visible:ring-4 focus-visible:ring-emerald-500/25"
        >
          <CurrentIcon className="size-4 shrink-0 text-emerald-600 transition-transform duration-300 group-hover:scale-110 dark:text-emerald-400" />

          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {current.label}
          </span>

          {isCustom && (
            <span
              aria-hidden
              className="size-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]"
            />
          )}

          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
              open && "rotate-180 text-emerald-500",
            )}
          />
        </button>
      </div>

      {/* panel (bottom sheet on phones) */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] sm:hidden"
              onClick={() => close(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: 12,
                scale: 0.97,
                transition: { duration: 0.15 },
              }}
              transition={{ duration: 0.35, ease: EASE }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty(
                  "--x",
                  `${e.clientX - r.left}px`,
                );
                e.currentTarget.style.setProperty(
                  "--y",
                  `${e.clientY - r.top}px`,
                );
              }}
              className="group/panel fixed inset-x-3 bottom-3 z-50 origin-top-right overflow-hidden rounded-3xl border border-border/70 bg-popover/90 p-2 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-3 sm:w-84"
            >
              {/* cursor spotlight */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [background:radial-gradient(260px_circle_at_var(--x,50%)_var(--y,0%),rgba(52,211,153,0.16),transparent_62%)] group-hover/panel:opacity-100" />

              {/* sheet handle (mobile) */}
              <div className="mx-auto mb-1 mt-1 h-1 w-10 rounded-full bg-border sm:hidden" />

              <ul
                ref={listRef}
                id={`${id}-list`}
                role="listbox"
                tabIndex={-1}
                aria-label="Sort books"
                aria-activedescendant={`${id}-opt-${active}`}
                onKeyDown={onListKeyDown}
                className="relative outline-none"
              >
                {GROUPS.map((group, gi) => (
                  <li
                    key={group.label}
                    role="presentation"
                    className={cn(gi > 0 && "mt-1.5")}
                  >
                    <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {group.label}
                    </p>

                    <ul role="presentation" className="space-y-0.5">
                      {group.values.map((v) => {
                        const i = SORT_OPTIONS.findIndex((o) => o.value === v);
                        const o = SORT_OPTIONS[i];

                        const Icon = META[v].icon;
                        const selected = v === value;
                        const highlighted = i === active;

                        return (
                          <motion.li
                            key={v}
                            id={`${id}-opt-${i}`}
                            role="option"
                            aria-selected={selected}
                            initial={{ opacity: 0, x: 14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.05 + i * 0.04,
                              duration: 0.35,
                              ease: EASE,
                            }}
                            onMouseEnter={() => setActive(i)}
                            onClick={() => choose(i)}
                            className="relative cursor-pointer rounded-2xl"
                          >
                            {highlighted && (
                              <motion.span
                                layoutId={`${id}-highlight`}
                                className="absolute inset-0 rounded-2xl bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/30"
                                transition={{
                                  type: "spring",
                                  stiffness: 480,
                                  damping: 36,
                                }}
                              />
                            )}

                            <div className="relative flex items-center gap-3 px-3 py-2.5">
                              <span
                                className={cn(
                                  "grid size-9 shrink-0 place-items-center rounded-xl transition-all duration-300",
                                  selected
                                    ? "bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-700/30"
                                    : highlighted
                                      ? "scale-105 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                      : "bg-muted text-muted-foreground",
                                )}
                              >
                                <Icon className="size-4.5" />
                              </span>

                              <span className="min-w-0 flex-1 leading-tight">
                                <span
                                  className={cn(
                                    "block text-sm",
                                    selected ? "font-semibold" : "font-medium",
                                  )}
                                >
                                  {o.label}
                                </span>

                                <span className="block truncate text-xs text-muted-foreground">
                                  {META[v].hint}
                                </span>
                              </span>

                              {selected ? (
                                <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-white">
                                  <Check className="size-3" strokeWidth={3.5} />
                                </span>
                              ) : (
                                <kbd className="hidden rounded-md border border-border bg-background/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
                                  {i + 1}
                                </kbd>
                              )}
                            </div>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>

              {/* footer hint */}
              <div className="relative mt-1.5 hidden items-center justify-between border-t border-border/60 px-3 pb-1 pt-2.5 text-[11px] text-muted-foreground sm:flex">
                <span>↑ ↓ navigate</span>
                <span>1-{n} quick pick</span>
                <span>Esc close</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
