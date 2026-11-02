"use client";

/**
 * 3D, interactive 404: extruded "4" digits around a lost book. The scene tilts with
 * your mouse, papers drift in 3D, and clicking the book spins it.
 */

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, BookOpen, Home, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 3D pieces

/** A big digit made of stacked layers so it has real depth */
function Extruded({ char }: { char: string }) {
  const layers = 14;

  return (
    <div
      aria-hidden
      className="bn3d relative select-none text-[8.5rem] font-black leading-none sm:text-[13rem]"
    >
      {Array.from({ length: layers }).map((_, i) => (
        <span
          key={i}
          className="absolute inset-0"
          style={{
            transform: `translateZ(${-(layers - i) * 2.5}px)`,
            color: `hsl(168 70% ${20 + i * 1.4}%)`,
          }}
        >
          {char}
        </span>
      ))}

      <span className="relative bg-linear-to-b from-emerald-200 via-emerald-400 to-teal-600 bg-clip-text text-transparent">
        {char}
      </span>
    </div>
  );
}

/** A real cuboid book: 6 faces in 3D space */
function Book3D() {
  const W = 110;
  const H = 150;
  const D = 36;
  const paper =
    "repeating-linear-gradient(to bottom,#f5f5f4 0 2px,#d6d3d1 2px 3px)";

  return (
    <div className="bn3d relative" style={{ width: W, height: H }} aria-hidden>
      {/* front cover */}
      <div
        className="absolute inset-0 overflow-hidden rounded-r-md rounded-l-[3px] ring-1 ring-white/30"
        style={{
          transform: `translateZ(${D / 2}px)`,
          background: "linear-gradient(135deg,#34d399,#059669 55%,#0f766e)",
        }}
      >
        <span className="absolute inset-y-0 left-0 w-3 bg-black/20" />
        <span className="absolute inset-y-0 left-3 w-px bg-white/40" />
        <span className="absolute inset-2 left-5 rounded border border-white/30" />

        <div className="relative flex h-full flex-col items-center justify-center gap-1 pl-3 text-white">
          <span className="font-serif text-5xl font-bold leading-none drop-shadow-lg">
            ?
          </span>
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/80">
            Lost page
          </span>
        </div>

        <span className="absolute -top-px right-5 h-8 w-2.5 rounded-b-sm bg-amber-300 shadow" />
        <span className="pointer-events-none absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-white/40" />
      </div>

      {/* back cover */}
      <div
        className="absolute inset-0 rounded-l-md"
        style={{
          transform: `rotateY(180deg) translateZ(${D / 2}px)`,
          background: "linear-gradient(135deg,#0f766e,#064e3b)",
        }}
      />

      {/* spine (left) */}
      <div
        className="absolute top-0 flex items-center justify-center overflow-hidden"
        style={{
          width: D,
          height: H,
          left: "50%",
          marginLeft: -D / 2,
          transform: `rotateY(-90deg) translateZ(${W / 2}px)`,
          background: "linear-gradient(to right,#0f766e,#10b981 50%,#0f766e)",
        }}
      >
        <span className="-rotate-90 whitespace-nowrap font-serif text-[10px] font-bold tracking-widest text-white/90">
          BOOKNOOK
        </span>
      </div>

      {/* page edges (right, top, bottom) */}
      <div
        className="absolute top-0"
        style={{
          width: D - 4,
          height: H - 6,
          left: "50%",
          top: 3,
          marginLeft: -(D - 4) / 2,
          transform: `rotateY(90deg) translateZ(${W / 2 - 2}px)`,
          background: paper,
        }}
      />

      <div
        className="absolute left-0"
        style={{
          width: W - 6,
          height: D - 4,
          left: 3,
          top: "50%",
          marginTop: -(D - 4) / 2,
          transform: `rotateX(90deg) translateZ(${H / 2 - 2}px)`,
          background: "linear-gradient(to right,#e7e5e4,#fafaf9)",
        }}
      />

      <div
        className="absolute left-0"
        style={{
          width: W - 6,
          height: D - 4,
          left: 3,
          top: "50%",
          marginTop: -(D - 4) / 2,
          transform: `rotateX(-90deg) translateZ(${H / 2 - 2}px)`,
          background: "#d6d3d1",
        }}
      />
    </div>
  );
}

const PAPERS = [
  { left: "4%", top: "10%", r: -14, dx: "16px", delay: 0 },
  { left: "88%", top: "6%", r: 12, dx: "-14px", delay: 0.8 },
  { left: "10%", top: "70%", r: 8, dx: "12px", delay: 1.4 },
  { left: "84%", top: "66%", r: -10, dx: "-18px", delay: 0.4 },
  { left: "48%", top: "-6%", r: 4, dx: "10px", delay: 1.1 },
];

const MARKS = [
  {
    left: "22%",
    top: "2%",
    size: "text-3xl",
    color: "text-emerald-400",
    delay: 0,
  },
  {
    left: "74%",
    top: "84%",
    size: "text-4xl",
    color: "text-amber-300",
    delay: 0.7,
  },
  {
    left: "92%",
    top: "34%",
    size: "text-2xl",
    color: "text-teal-300",
    delay: 1.3,
  },
  {
    left: "2%",
    top: "42%",
    size: "text-2xl",
    color: "text-amber-300",
    delay: 0.4,
  },
];

// Scene
export default function NotFoundScene() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [q, setQ] = useState("");

  // mouse tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 16, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 70, damping: 16, mass: 0.7 });
  const rotateY = useTransform(sx, [-1, 1], [-24, 24]);
  const rotateX = useTransform(sy, [-1, 1], [16, -16]);

  // click the book to spin it
  const spin = useMotionValue(0);
  function spinBook() {
    if (reduce) return;
    animate(spin, spin.get() + 360, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
    });
  }

  function onPointerMove(e: React.PointerEvent) {
    if (reduce) return;
    mx.set((e.clientX / window.innerWidth - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  }

  function onSearch(e: React.SubmitEvent<HTMLElement>) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/books?search=${encodeURIComponent(term)}` : "/books");
  }

  return (
    <main
      onPointerMove={onPointerMove}
      className="relative isolate flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-12 sm:py-16"
    >
      <style>{`
        .bn3d { transform-style: preserve-3d; }
        @keyframes bn-swing {
          0%   { transform: rotateY(-28deg) rotateX(6deg) translateY(0); }
          50%  { transform: rotateY(28deg)  rotateX(-4deg) translateY(-12px); }
          100% { transform: rotateY(-28deg) rotateX(6deg) translateY(0); }
        }
        @keyframes bn-drift {
          0%, 100% { transform: translate3d(0,0,0) rotateX(0) rotateY(0) rotateZ(var(--r)); }
          50%      { transform: translate3d(var(--dx),-24px,60px) rotateX(38deg) rotateY(64deg) rotateZ(calc(var(--r) + 14deg)); }
        }
        @keyframes bn-mark {
          0%, 100% { transform: translateZ(50px) translateY(0) rotate(-8deg); }
          50%      { transform: translateZ(90px) translateY(-14px) rotate(8deg); }
        }
        @keyframes bn-shadow {
          0%, 100% { transform: translateX(-50%) scaleX(1); opacity: .45; }
          50%      { transform: translateX(-50%) scaleX(.82); opacity: .3; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bn-anim { animation: none !important; }
        }
      `}</style>

      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-[30%] -z-10 size-136 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-3xl" />

      <div className="pointer-events-none absolute -right-20 bottom-10 -z-10 size-72 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(16,185,129,0.14)_1px,transparent_1px)] bg-size-[26px_26px] mask-[radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      {/* 3D stage */}
      <div
        className="relative w-full max-w-3xl"
        style={{ perspective: "1300px" }}
        aria-hidden
      >
        <motion.div
          style={{ rotateX, rotateY }}
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="bn3d relative flex items-center justify-center gap-1 sm:gap-10"
        >
          <Extruded char="4" />

          {/* book: click to spin, idle swing, mouse tilt from parent */}
          <motion.div
            style={{ rotateY: spin, transformStyle: "preserve-3d" }}
            onClick={spinBook}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="mx-1 scale-[0.8] cursor-pointer sm:mx-2 sm:scale-[1.25]"
            title="Click me!"
          >
            <div
              className="bn3d bn-anim"
              style={{ animation: "bn-swing 6s ease-in-out infinite" }}
            >
              <Book3D />
            </div>
          </motion.div>

          <Extruded char="4" />

          {/* drifting pages */}
          {PAPERS.map((p, i) => (
            <div
              key={i}
              className="bn-anim absolute hidden sm:block"
              style={
                {
                  left: p.left,
                  top: p.top,
                  width: 38,
                  height: 50,
                  "--r": `${p.r}deg`,
                  "--dx": p.dx,
                  animation: `bn-drift ${6 + i}s ${p.delay}s ease-in-out infinite`,
                  background:
                    "repeating-linear-gradient(to bottom,transparent 0 8px,rgba(16,185,129,.28) 8px 9px), linear-gradient(135deg,#fff,#e7e5e4)",
                  borderRadius: 3,
                  boxShadow: "0 8px 20px rgba(0,0,0,.25)",
                } as React.CSSProperties
              }
            />
          ))}

          {/* floating question marks */}
          {MARKS.map((m, i) => (
            <span
              key={i}
              className={cn(
                "bn-anim absolute font-serif font-bold drop-shadow-lg",
                m.size,
                m.color,
              )}
              style={{
                left: m.left,
                top: m.top,
                animation: `bn-mark ${4 + i * 0.6}s ${m.delay}s ease-in-out infinite`,
              }}
            >
              ?
            </span>
          ))}
        </motion.div>

        {/* floor shadow */}
        <div
          className="bn-anim pointer-events-none absolute -bottom-2 left-1/2 h-8 w-72 rounded-full bg-black/40 blur-xl"
          style={{ animation: "bn-shadow 6s ease-in-out infinite" }}
        />
      </div>

      {/* copy */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-14 flex max-w-xl flex-col items-center text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
          <BookOpen className="size-3.5" />
          Error 404
        </span>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          This page wandered off the shelf
        </h1>

        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
          We couldn&apos;t find the page you were looking for. It may have
          moved, or the link might be wrong. Try a search, or head back to a
          good read.
        </p>

        {/* search */}
        <form
          onSubmit={onSearch}
          role="search"
          className="mt-8 flex w-full max-w-md items-center gap-2 rounded-full border border-border bg-card p-1.5 pl-5 shadow-sm transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15"
        >
          <Search className="size-4 shrink-0 text-muted-foreground" />

          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for a book or author"
            aria-label="Search books"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground/60"
          />

          <button
            type="submit"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-linear-to-br from-emerald-500 to-teal-700 px-5 text-sm font-semibold text-white shadow-md outline-none transition-all duration-300 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95"
          >
            Search
          </button>
        </form>

        {/* actions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group relative h-12 overflow-hidden rounded-full border-0 bg-linear-to-br from-emerald-500 to-teal-700 px-7 text-base font-semibold text-white shadow-lg shadow-emerald-900/25 transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-xl active:translate-y-0 active:scale-95",
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Home className="size-4" />
              Back to Home
            </span>

            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>

          <Link
            href="/books"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "group h-12 rounded-full border-border/80 px-7 text-base font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-emerald-500/10 active:scale-95",
            )}
          >
            Browse Books
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Psst… try clicking the book.
        </p>
      </motion.div>
    </main>
  );
}
