"use client";

/**
 * "Top Categories" bento grid
 * Place at: components/top-categories.tsx
 * Links go to /books?category=<name>
 */

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Castle,
  Eye,
  Feather,
  FlaskConical,
  Landmark,
  Layers,
  Library,
  Lightbulb,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type Category = {
  name: string;
  tagline: string;
  icon: LucideIcon;
  span: string; // grid placement on large screens
  tint: string; // card linear
  hover: string; // hover border
  iconBox: string;
  ghost: string; // big faded icon colour
};

const CATEGORIES: Category[] = [
  {
    name: "Fiction",
    tagline: "Novels and stories that pull you in and refuse to let go.",
    icon: Feather,
    span: "lg:col-span-2 lg:row-span-2",
    tint: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    hover: "hover:border-emerald-500/50",
    iconBox: "bg-emerald-500 text-white shadow-emerald-600/30",
    ghost: "text-emerald-500/10",
  },
  {
    name: "Fantasy",
    tagline: "Dragons, magic and whole new worlds.",
    icon: Castle,
    span: "",
    tint: "from-violet-500/20 via-violet-500/5 to-transparent",
    hover: "hover:border-violet-500/50",
    iconBox: "bg-violet-500 text-white shadow-violet-600/30",
    ghost: "text-violet-500/10",
  },
  {
    name: "Sci-Fi",
    tagline: "Futures worth imagining.",
    icon: Rocket,
    span: "",
    tint: "from-sky-500/20 via-sky-500/5 to-transparent",
    hover: "hover:border-sky-500/50",
    iconBox: "bg-sky-500 text-white shadow-sky-600/30",
    ghost: "text-sky-500/10",
  },
  {
    name: "History",
    tagline: "Real stories from the people and eras that shaped our world.",
    icon: Landmark,
    span: "lg:col-span-2",
    tint: "from-amber-500/20 via-amber-500/5 to-transparent",
    hover: "hover:border-amber-500/50",
    iconBox: "bg-amber-500 text-white shadow-amber-600/30",
    ghost: "text-amber-500/10",
  },
  {
    name: "Self-Help",
    tagline: "Small ideas, big change.",
    icon: Lightbulb,
    span: "",
    tint: "from-yellow-500/20 via-yellow-500/5 to-transparent",
    hover: "hover:border-yellow-500/50",
    iconBox: "bg-yellow-500 text-white shadow-yellow-600/30",
    ghost: "text-yellow-500/10",
  },
  {
    name: "Classic",
    tagline: "Timeless reads, still brilliant.",
    icon: Library,
    span: "",
    tint: "from-rose-500/20 via-rose-500/5 to-transparent",
    hover: "hover:border-rose-500/50",
    iconBox: "bg-rose-500 text-white shadow-rose-600/30",
    ghost: "text-rose-500/10",
  },
  {
    name: "Mystery",
    tagline: "Twists you won't see coming.",
    icon: Eye,
    span: "",
    tint: "from-slate-500/25 via-slate-500/5 to-transparent",
    hover: "hover:border-slate-500/50",
    iconBox: "bg-slate-600 text-white shadow-slate-700/30",
    ghost: "text-slate-500/10",
  },
  {
    name: "Science",
    tagline: "Curiosity, explained.",
    icon: FlaskConical,
    span: "",
    tint: "from-teal-500/20 via-teal-500/5 to-transparent",
    hover: "hover:border-teal-500/50",
    iconBox: "bg-teal-500 text-white shadow-teal-600/30",
    ghost: "text-teal-500/10",
  },
];

export default function TopCategories() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
          <Layers className="size-3.5" />
          Top categories
        </span>

        <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Find your next obsession by genre
        </h2>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Pick a category and jump straight to the books that match your mood.
        </p>
      </div>

      <div className="mt-12 grid auto-rows-44 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {CATEGORIES.map((c, i) => {
          const Icon = c.icon;
          const big = c.span.includes("row-span-2");

          return (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(c.span, "min-h-0")}
            >
              <Link
                href={`/books?category=${encodeURIComponent(c.name)}`}
                className={cn(
                  "group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/70 bg-card bg-linear-to-br p-6 outline-none transition-all duration-500",
                  "hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/5 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-[0.98]",
                  c.tint,
                  c.hover,
                )}
              >
                {/* big faded icon */}
                <Icon
                  aria-hidden
                  className={cn(
                    "absolute -bottom-6 -right-6 transition-all duration-700 ease-out group-hover:-rotate-12 group-hover:scale-125",
                    big ? "size-64" : "size-36",
                    c.ghost,
                  )}
                  strokeWidth={1.25}
                />

                <div className="relative flex items-start justify-between">
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110",
                      c.iconBox,
                    )}
                  >
                    <Icon className="size-6" />
                  </span>

                  <span className="grid size-9 place-items-center rounded-full border border-border/80 bg-background/60 text-muted-foreground opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:-translate-x-2">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>

                <div className="relative">
                  <h3
                    className={cn(
                      "font-semibold tracking-tight",
                      big ? "text-3xl" : "text-xl",
                    )}
                  >
                    {c.name}
                  </h3>
                  <p
                    className={cn(
                      "mt-1.5 text-muted-foreground",
                      big ? "max-w-xs text-base" : "max-w-60 text-sm",
                    )}
                  >
                    {c.tagline}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/books"
          className="group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-emerald-500/60"
        >
          Or browse every book
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
