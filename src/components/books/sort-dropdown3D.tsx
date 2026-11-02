"use client";

/**
 * A custom, accessible (listbox) dropdown with a 3D feel:
 *  - keycap-style trigger that presses down on click
 *  - panel flips open in perspective, with a slab of "thickness" behind it
 *  - options pop out of the panel one by one and lift toward you when highlighted
 * Keyboard: Arrow keys, Home/End, Enter/Space to choose, Escape to close.
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

const ICONS: Record<string, LucideIcon> = {
  newest: Clock,
  oldest: History,
  "title-asc": ArrowDownAZ,
  "title-desc": ArrowUpAZ,
  "author-asc": UserRound,
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FLAT3D = { transformStyle: "preserve-3d" as const };

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
  const CurrentIcon = ICONS[current.value] ?? ArrowUpDown;

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

  // close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // move focus into the list when it opens (so the arrow keys work)
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
      {/* keycap trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`Sort books, currently ${current.label}`}
        className={cn(
          "group flex h-12 w-full items-center gap-3 rounded-full border bg-linear-to-b from-card to-muted/70 pl-2 pr-4 text-left outline-none",
          "transition-all duration-200 ease-out",
          // the "key" has a solid bottom edge that disappears when pressed
          "shadow-[0_4px_0_0_var(--border),0_10px_18px_-8px_rgba(0,0,0,0.25)] hover:-translate-y-px hover:border-emerald-500/50",
          "active:translate-y-1 active:shadow-[0_0_0_0_var(--border),0_2px_6px_-2px_rgba(0,0,0,0.2)]",
          "focus-visible:ring-4 focus-visible:ring-emerald-500/20",
          open
            ? "border-emerald-500 ring-4 ring-emerald-500/15"
            : "border-border",
        )}
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-700/30 transition-transform duration-300 group-hover:rotate-12">
          <CurrentIcon className="size-4" />
        </span>

        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Sort by
          </span>

          <span className="block truncate text-sm font-semibold">
            {current.label}
          </span>
        </span>

        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180 text-emerald-500",
          )}
        />
      </button>

      {/* 3D panel */}
      <div
        className="absolute left-0 right-0 top-full z-50 mt-3"
        style={{ perspective: "900px" }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, rotateX: -32, y: -10, scale: 0.94 }}
              animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                rotateX: -22,
                y: -6,
                scale: 0.96,
                transition: { duration: 0.16 },
              }}
              transition={{ duration: 0.42, ease: EASE }}
              style={{ ...FLAT3D, transformOrigin: "top center" }}
              className="relative rounded-2xl border border-border bg-popover p-2 shadow-[0_28px_50px_-14px_rgba(0,0,0,0.4)]"
            >
              {/* slab thickness behind the panel */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-2xl bg-emerald-900/40"
                style={{ transform: "translateZ(-14px) translateY(7px)" }}
              />

              {/* glossy top edge */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/70 to-transparent"
              />

              <ul
                ref={listRef}
                id={`${id}-list`}
                role="listbox"
                tabIndex={-1}
                aria-label="Sort books"
                aria-activedescendant={`${id}-opt-${active}`}
                onKeyDown={onListKeyDown}
                style={FLAT3D}
                className="relative space-y-1 outline-none"
              >
                {SORT_OPTIONS.map((o, i) => {
                  const Icon = ICONS[o.value] ?? ArrowUpDown;
                  const selected = o.value === value;
                  const highlighted = i === active;
                  return (
                    <motion.li
                      key={o.value}
                      id={`${id}-opt-${i}`}
                      role="option"
                      aria-selected={selected}
                      initial={{ opacity: 0, rotateX: -55, z: -40 }}
                      animate={{ opacity: 1, rotateX: 0, z: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.06 + i * 0.045,
                        ease: EASE,
                      }}
                      style={FLAT3D}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => choose(i)}
                      className="cursor-pointer"
                    >
                      {/* inner layer lifts toward the viewer when highlighted */}
                      <motion.div
                        animate={{
                          z: highlighted ? 22 : 0,
                          scale: highlighted ? 1.03 : 1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 26,
                        }}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-[background-color,box-shadow] duration-200",
                          highlighted &&
                            "bg-emerald-500/10 shadow-lg shadow-emerald-900/15",
                          selected && !highlighted && "bg-emerald-500/5",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-lg transition-all duration-300",
                            selected
                              ? "bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-700/30"
                              : highlighted
                                ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          <Icon className="size-4" />
                        </span>

                        <span
                          className={cn(
                            "flex-1 text-sm",
                            selected ? "font-semibold" : "font-medium",
                          )}
                        >
                          {o.label}
                        </span>

                        <span
                          className={cn(
                            "grid size-5 place-items-center rounded-full bg-emerald-500 text-white transition-all duration-300",
                            selected
                              ? "scale-100 opacity-100"
                              : "scale-0 opacity-0",
                          )}
                        >
                          <Check className="size-3" strokeWidth={3.5} />
                        </span>
                      </motion.div>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
