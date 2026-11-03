"use client";

/**
 * A custom, accessible modal (not the browser's confirm()).
 * Esc or a click on the backdrop closes it, focus stays inside, the page behind can't scroll.
 */

import { AnimatePresence, motion } from "framer-motion";
import { X, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

const noop = () => () => {};

export default function Modal({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  tone = "default",
  size = "md",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  tone?: "default" | "danger";
  size?: "md" | "lg";
  children: React.ReactNode;
}) {
  // only render the portal in the browser (avoids a hydration mismatch)
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const dialogRef = useRef<HTMLDivElement>(null);

  // keep the latest onClose without re-running the effect (which would steal focus while typing)
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (e.key !== "Tab" || !dialogRef.current) return;
      // keep Tab inside the dialog
      const items = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-90 grid place-items-center p-4">
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ opacity: 0, y: 36, rotateX: -14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.97,
              transition: { duration: 0.15 },
            }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            style={{ transformPerspective: 1000 }}
            className={cn(
              "relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-black/40 outline-none",
              size === "lg" ? "max-w-2xl" : "max-w-md",
              tone === "danger" ? "border-rose-500/30" : "border-border/70",
            )}
          >
            <div
              className={cn(
                "h-1 w-full shrink-0",
                tone === "danger"
                  ? "bg-linear-to-r from-rose-500 to-orange-400"
                  : "bg-linear-to-r from-emerald-400 via-teal-400 to-amber-300",
              )}
            />

            <div className="flex items-start gap-4 px-6 pb-2 pt-5">
              {Icon && (
                <span
                  className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-2xl",
                    tone === "danger"
                      ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      : "bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-700/30",
                  )}
                >
                  <Icon className="size-5" />
                </span>
              )}

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold tracking-tight">
                  {title}
                </h2>
                {description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 pb-6 pt-3">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
