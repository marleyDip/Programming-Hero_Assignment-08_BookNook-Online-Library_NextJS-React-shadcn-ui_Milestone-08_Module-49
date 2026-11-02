/**
 * server component, CSS only
 * A "bookshelf" header: the spines are the categories. Hover to lift, click to filter.
 */

import { ChevronRight, Home, MousePointerClick } from "lucide-react";
import Link from "next/link";

import { CATEGORIES } from "@/lib/books-config";

// one look per spine, in the same order as CATEGORIES
const SPINES = [
  {
    h: "h-36",
    w: "w-10",
    color: "from-emerald-300 to-emerald-600",
    text: "text-emerald-950",
  },
  {
    h: "h-44",
    w: "w-11",
    color: "from-violet-300 to-violet-600",
    text: "text-violet-950",
  },
  {
    h: "h-40",
    w: "w-9",
    color: "from-sky-200 to-sky-500",
    text: "text-sky-950",
  },
  {
    h: "h-48",
    w: "w-12",
    color: "from-amber-200 to-amber-500",
    text: "text-amber-950",
  },
  {
    h: "h-32",
    w: "w-10",
    color: "from-yellow-100 to-yellow-400",
    text: "text-yellow-950",
  },
  {
    h: "h-44",
    w: "w-9",
    color: "from-rose-200 to-rose-500",
    text: "text-rose-950",
  },
  {
    h: "h-40",
    w: "w-11",
    color: "from-slate-300 to-slate-500",
    text: "text-slate-950",
  },
  {
    h: "h-36",
    w: "w-10",
    color: "from-teal-200 to-teal-500",
    text: "text-teal-950",
  },
];

export default function BooksHeader() {
  return (
    <header className="relative isolate overflow-hidden rounded-4xl bg-linear-to-br from-emerald-950 via-[#0b3b32] to-teal-800 px-6 pb-0 pt-10 shadow-2xl shadow-emerald-950/25 sm:px-10 sm:pt-12 lg:px-14">
      <style>{`
        @keyframes bn-spine-in {
          from { opacity: 0; transform: translateY(70px) rotate(var(--tilt, 0deg)); }
          to   { opacity: 1; transform: translateY(0) rotate(var(--tilt, 0deg)); }
        }
        .bn-spine { animation: bn-spine-in .8s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .bn-spine { animation: none; } }
      `}</style>

      {/* decoration */}
      <div className="pointer-events-none absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-emerald-400/25 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 left-10 -z-10 size-80 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-linear(rgba(255,255,255,0.09)_1px,transparent_1px)] bg-size-[24px_24px] mask-[linear-linear(to_bottom,black,transparent_90%)]" />

      <div className="grid items-end gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-6">
        {/* text */}
        <div className="pb-4 lg:pb-14">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-white/60"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Home className="size-3" /> Home
            </Link>

            <ChevronRight className="size-3" />

            <span className="text-white/90">All Books</span>
          </nav>

          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            The whole shelf,
            <span className="block text-emerald-300">one click away.</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
            Every title shared by our readers. Search, sort, or pick a spine on
            the shelf to jump straight into a category.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-white/85 backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-emerald-300" />
              {CATEGORIES.length} categories
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-white/85 backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-amber-300" />
              Borrow for a few days
            </span>
          </div>

          <p className="mt-6 hidden items-center gap-2 text-xs text-white/50 sm:flex">
            <MousePointerClick className="size-3.5" />
            Hover a spine, click to filter
          </p>
        </div>

        {/* shelf */}
        <div className="relative mx-auto w-full max-w-xl">
          <div
            className="flex items-end justify-center gap-1.5 px-2 sm:gap-2"
            role="list"
            aria-label="Browse by category"
          >
            {CATEGORIES.map((name, i) => {
              const s = SPINES[i % SPINES.length];

              const tilt = i === CATEGORIES.length - 1 ? "8deg" : "0deg"; // last book leans

              return (
                <Link
                  key={name}
                  href={`/books?category=${encodeURIComponent(name)}`}
                  role="listitem"
                  aria-label={`Browse ${name}`}
                  style={{
                    animationDelay: `${150 + i * 90}ms`,
                    ["--tilt" as string]: tilt,
                  }}
                  className={`bn-spine group relative flex shrink-0 origin-bottom flex-col items-center justify-between rounded-t-[5px] bg-linear-to-b py-2.5 shadow-lg shadow-black/30 outline-none ring-1 ring-white/25 transition-all duration-500 ease-out hover:-translate-y-4 hover:shadow-2xl hover:shadow-emerald-300/20 focus-visible:-translate-y-4 focus-visible:ring-2 focus-visible:ring-white ${s.h} ${s.w} ${s.color} ${s.text}`}
                >
                  <span className="h-1 w-5 rounded-full bg-current opacity-40" />

                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] [writing-mode:vertical-rl] rotate-180">
                    {name}
                  </span>

                  <span className="flex flex-col items-center gap-1">
                    <span className="h-px w-5 bg-current opacity-40" />
                    <span className="h-px w-5 bg-current opacity-40" />
                  </span>

                  {/* glossy edge */}
                  <span className="pointer-events-none absolute inset-y-0 left-0 w-1.5 rounded-tl-[5px] bg-black/15" />

                  <span className="pointer-events-none absolute inset-0 rounded-t-[5px] bg-linear-to-r from-white/30 via-transparent to-black/10" />

                  {/* hover label */}
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-950 opacity-0 shadow-lg transition-all duration-300 group-hover:-top-10 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* shelf board */}
          <div aria-hidden className="relative">
            <div className="h-3.5 rounded-sm bg-linear-to-b from-emerald-600 to-emerald-900 shadow-[0_6px_0_0_rgba(0,0,0,0.25)] ring-1 ring-white/10" />

            <div className="mx-3 h-3 rounded-b-md bg-black/30 blur-md" />
          </div>
        </div>
      </div>
    </header>
  );
}
