"use client";

/**
 * shared split layout
 */

import { motion } from "framer-motion";
import { BookOpen, Check } from "lucide-react";

import { cn } from "@/lib/utils";

const COVERS = [
  {
    title: "The Quiet Orchard",
    color: "from-emerald-300 to-emerald-600 text-emerald-950",
    pos: "left-0 top-14 -rotate-12",
  },
  {
    title: "Atlas of Small Things",
    color: "from-amber-200 to-amber-400 text-amber-950",
    pos: "left-24 top-0 rotate-3 z-10 scale-110",
  },
  {
    title: "Slow Tides",
    color: "from-sky-200 to-sky-500 text-sky-950",
    pos: "left-48 top-16 rotate-[13deg]",
  },
];

export default function AuthShell({
  title,
  subtitle,
  panelTitle,
  panelText,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  panelTitle: string;
  panelText: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid overflow-hidden rounded-4xl border border-border/70 bg-card shadow-2xl shadow-emerald-900/10 lg:grid-cols-[1fr_1.05fr]">
        {/* Brand panel */}
        <div className="relative isolate hidden flex-col justify-between overflow-hidden bg-linear-to-br from-emerald-950 via-[#0b3b32] to-teal-800 p-10 text-white lg:flex">
          <div className="absolute -right-20 -top-20 -z-10 size-80 rounded-full bg-emerald-400/25 blur-3xl" />

          <div className="absolute -bottom-24 -left-16 -z-10 size-72 rounded-full bg-amber-300/10 blur-3xl" />

          <div className="absolute inset-0 -z-10 [background-image:radial-linear(rgba(255,255,255,0.09)_1px,transparent_1px)] bg-size-[24px_24px] mask-[linear-linear(to_bottom,black,transparent_90%)]" />

          <div className="flex items-center gap-2.5">
            <span className="relative grid size-9 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
              <BookOpen className="size-4.5" />

              <span className="absolute -top-px right-1.75 h-3 w-1.25 rounded-b-[2px] bg-amber-300" />
            </span>

            <span className="text-lg font-semibold tracking-tight">
              BookNook
            </span>
          </div>

          <div>
            <h2 className="max-w-sm text-4xl font-semibold leading-[1.1] tracking-tight">
              {panelTitle}
            </h2>

            <p className="mt-4 max-w-sm text-base leading-relaxed text-white/70">
              {panelText}
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-white/80">
              {[
                "Free to join",
                "Borrow for a few days",
                "Return with one tap",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="grid size-5 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* floating covers */}
          <div className="relative mx-auto mt-10 h-48 w-88" aria-hidden>
            {COVERS.map((c, i) => (
              <div key={c.title} className={cn("absolute", c.pos)}>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={cn(
                    "relative h-40 w-28 overflow-hidden rounded-l-sm rounded-r-lg bg-linear-to-br p-3 pl-5 shadow-2xl shadow-black/40 ring-1 ring-white/25",
                    c.color,
                  )}
                >
                  <span className="absolute inset-y-0 left-0 w-2.5 bg-black/25" />

                  <span className="block h-px w-6 bg-current opacity-60" />

                  <p className="mt-2 font-serif text-xs font-bold leading-tight">
                    {c.title}
                  </p>

                  <span className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/0 via-white/10 to-white/35" />
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Form side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center p-6 sm:p-10 lg:p-12"
        >
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>

          <p className="mt-2 text-muted-foreground">{subtitle}</p>

          <div className="mt-8">{children}</div>
          {footer && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
