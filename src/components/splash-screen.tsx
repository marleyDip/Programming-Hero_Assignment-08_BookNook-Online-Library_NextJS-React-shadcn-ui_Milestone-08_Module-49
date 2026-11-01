"use client";

/**
 * BookNook Splash Screen
 * Place at: src/components/splash-screen.tsx
 * Mount once in app/layout.tsx as the first child of <body>:  <SplashScreen />
 *
 * - Shows once per browser session (sessionStorage), skipped for reduced-motion users
 * - Interactive: the book tilts and the scene parallaxes with your mouse, a spotlight
 *   follows the cursor, and you can skip with a click, Enter, Space or Escape
 * - Exit: the screen splits open like book covers to reveal the site
 */

import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { BookOpen } from "lucide-react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const SEEN_KEY = "booknook:splash";
const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---- "already seen?" without effects (server snapshot = false) ---- */
const subscribe = () => () => {};
const readSeen = () => {
  try {
    return (
      sessionStorage.getItem(SEEN_KEY) === "1" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  } catch {
    return false;
  }
};

/* Runs before first paint so a returning visitor never sees a flash of the splash */
const NO_FLASH_SCRIPT = `try{if(sessionStorage.getItem("${SEEN_KEY}")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-splash-seen","")}catch(e){}`;

// small pieces
const COVERS = [
  {
    pos: "left-[7%] top-[18%]",
    color: "from-emerald-300 to-emerald-600",
    depth: 38,
    rot: -12,
    size: "h-24 w-16",
  },
  {
    pos: "right-[9%] top-[24%]",
    color: "from-amber-200 to-amber-400",
    depth: 55,
    rot: 10,
    size: "h-28 w-[4.5rem]",
  },
  {
    pos: "left-[12%] bottom-[16%]",
    color: "from-sky-200 to-sky-500",
    depth: 28,
    rot: 8,
    size: "h-20 w-14",
  },
  {
    pos: "right-[14%] bottom-[14%]",
    color: "from-rose-200 to-rose-400",
    depth: 46,
    rot: -9,
    size: "h-24 w-16",
  },
  {
    pos: "left-[40%] top-[7%]",
    color: "from-teal-200 to-teal-500",
    depth: 22,
    rot: 5,
    size: "h-16 w-11",
  },
];

const SPARKLES: [string, string, number][] = [
  ["12%", "30%", 0],
  ["22%", "70%", 0.6],
  ["33%", "14%", 1.1],
  ["46%", "82%", 0.3],
  ["58%", "20%", 1.6],
  ["68%", "74%", 0.9],
  ["78%", "34%", 0.2],
  ["88%", "62%", 1.3],
  ["92%", "18%", 0.7],
  ["6%", "56%", 1.8],
];

function FloatingCover({
  c,
  sx,
  sy,
  index,
}: {
  c: (typeof COVERS)[number];
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  index: number;
}) {
  const x = useTransform(sx, [-1, 1], [-c.depth, c.depth]);

  const y = useTransform(sy, [-1, 1], [-c.depth, c.depth]);

  return (
    <motion.div
      style={{ x, y }}
      className={cn("absolute hidden md:block", c.pos)}
      aria-hidden
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.55, scale: 1 }}
        transition={{
          delay: 0.5 + index * 0.12,
          duration: 0.8,
          ease: EASE_OUT,
        }}
      >
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [c.rot, c.rot + 4, c.rot] }}
          transition={{
            duration: 5 + index,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "relative rounded-l-[3px] rounded-r-md bg-linear-to-br shadow-xl shadow-black/40 ring-1 ring-white/25",
            c.color,
            c.size,
          )}
        >
          <span className="absolute inset-y-0 left-0 w-1.5 bg-black/25" />

          <span className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-white/35" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Splash
function Splash({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  const leave = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setLeaving(true);
  }, []);

  /* progress 0 -> 100, then leave */
  const progress = useMotionValue(0);
  const percent = useTransform(progress, (v) => Math.round(v));
  const barWidth = useTransform(progress, (v) => `${v}%`);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const controls = animate(progress, 100, {
      duration: 2.8,
      ease: EASE_IN_OUT,
      onComplete: () => {
        timer = setTimeout(leave, 450);
      },
    });

    return () => {
      controls.stop();
      clearTimeout(timer);
    };
  }, [progress, leave]);

  /* lock page scroll while the splash is up */
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  /* skip with the keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") leave();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leave]);

  /* mouse interaction */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 60, damping: 16, mass: 0.7 });

  const sy = useSpring(my, { stiffness: 60, damping: 16, mass: 0.7 });

  const rotateY = useTransform(sx, [-1, 1], [-18, 18]);

  const rotateX = useTransform(sy, [-1, 1], [12, -12]);

  const glowX = useTransform(sx, [-1, 1], [-60, 60]);

  const glowY = useTransform(sy, [-1, 1], [-40, 40]);

  const spotlight = useMotionTemplate`radial-linear(520px circle at ${cx}px ${cy}px, rgba(52,211,153,0.2), transparent 60%)`;

  useEffect(() => {
    cx.set(window.innerWidth / 2);
    cy.set(window.innerHeight / 2);
  }, [cx, cy]);

  function onPointerMove(e: React.PointerEvent) {
    mx.set((e.clientX / window.innerWidth - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
    cx.set(e.clientX);
    cy.set(e.clientY);
  }

  const halfTransition = {
    duration: 0.95,
    ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    delay: 0.45,
  };

  return (
    <div
      id="bn-splash"
      role="dialog"
      aria-label="Welcome to BookNook"
      onPointerMove={onPointerMove}
      onClick={leave}
      className="fixed inset-0 z-100 cursor-pointer select-none overflow-hidden"
    >
      {/* two halves: they slide apart like book covers on exit */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-[#06130f]"
        animate={{ x: leaving ? "-101%" : "0%" }}
        transition={halfTransition}
        onAnimationComplete={() => leaving && onDone()}
      >
        <div className="absolute inset-y-0 right-0 w-px bg-linear-to-b from-transparent via-emerald-400/70 to-transparent" />
      </motion.div>

      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 bg-[#06130f]"
        animate={{ x: leaving ? "101%" : "0%" }}
        transition={halfTransition}
      >
        <div className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-emerald-400/70 to-transparent" />
      </motion.div>

      {/* scene (fades out first) */}
      <motion.div
        className="absolute inset-0"
        animate={
          leaving ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1 }
        }
        transition={{ duration: 0.5, ease: "easeIn" }}
      >
        {/* aurora */}
        <motion.div style={{ x: glowX, y: glowY }} className="absolute inset-0">
          <div className="absolute -left-32 -top-32 size-136 rounded-full bg-emerald-500/25 blur-3xl" />

          <div className="absolute -bottom-40 -right-24 size-128 rounded-full bg-teal-400/20 blur-3xl" />

          <div className="absolute left-1/2 top-1/2 size-112 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/10 blur-3xl" />
        </motion.div>

        <div className="absolute inset-0 [background-image:radial-linear(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[26px_26px] mask-[radial-linear(ellipse_at_center,black,transparent_75%)]" />
        <motion.div
          className="absolute inset-0"
          style={{ background: spotlight }}
        />

        {/* sparkles */}
        {SPARKLES.map(([left, top, delay], i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute size-1 rounded-full bg-emerald-200"
            style={{ left, top }}
            animate={{ opacity: [0.05, 0.9, 0.05], scale: [0.6, 1.6, 0.6] }}
            transition={{
              duration: 3,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* floating covers with mouse parallax */}
        {COVERS.map((c, i) => (
          <FloatingCover key={i} c={c} sx={sx} sy={sy} index={i} />
        ))}

        {/* center stage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          {/* 3D book */}
          <div className="scale-[0.8] perspective-[1400px] sm:scale-100">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, y: 40, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE_OUT }}
              className="relative h-72 w-52"
            >
              {/* ground shadow */}
              <div
                className="absolute -bottom-10 left-1/2 h-6 w-48 -translate-x-1/2 rounded-full bg-black/60 blur-xl"
                style={{ transform: "translateZ(-40px)" }}
              />

              {/* back cover */}
              <div
                className="absolute inset-0 rounded-r-xl rounded-l-sm bg-linear-to-br from-emerald-800 to-emerald-950 shadow-2xl shadow-black/60 ring-1 ring-white/10"
                style={{ transform: "translateZ(-10px)" }}
              />

              {/* page stack edge */}
              <div
                className="absolute inset-y-1.5 right-1 left-2 rounded-r-md bg-neutral-200"
                style={{ transform: "translateZ(-4px)" }}
              />

              {/* first page (visible once the cover opens) */}
              <div
                className="absolute inset-y-2 right-1.5 left-1 rounded-r-md bg-neutral-50 p-5 text-neutral-800 shadow-inner"
                style={{ transform: "translateZ(0px)" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 0.7 }}
                >
                  <p className="font-serif text-lg font-bold leading-tight">
                    Welcome,
                  </p>

                  <p className="font-serif text-lg font-bold leading-tight text-emerald-700">
                    reader.
                  </p>

                  <div className="mt-4 space-y-2">
                    {["w-full", "w-11/12", "w-4/5", "w-full", "w-2/3"].map(
                      (w, i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            delay: 2.15 + i * 0.08,
                            duration: 0.5,
                            ease: EASE_OUT,
                          }}
                          style={{ transformOrigin: "left" }}
                          className={cn("h-1 rounded-full bg-neutral-300", w)}
                        />
                      ),
                    )}
                  </div>
                </motion.div>
              </div>

              {/* front cover: opens */}
              <motion.div
                className="absolute inset-0"
                style={{
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  z: 8,
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -168 }}
                transition={{ delay: 1, duration: 1.5, ease: EASE_IN_OUT }}
              >
                {/* outside */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-r-xl rounded-l-sm bg-linear-to-br from-emerald-400 via-emerald-600 to-teal-700 shadow-xl ring-1 ring-white/30"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="absolute inset-y-0 left-0 w-4 bg-black/20" />

                  <span className="absolute inset-y-0 left-4 w-px bg-white/40" />

                  <span className="absolute inset-3 left-7 rounded-lg border border-white/30" />

                  <div className="relative flex h-full flex-col items-center justify-center gap-3 pl-5 text-white">
                    <span className="grid size-16 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/40 backdrop-blur">
                      <BookOpen className="size-8" strokeWidth={1.8} />
                    </span>

                    <span className="font-serif text-xl font-bold tracking-wide">
                      BookNook
                    </span>

                    <span className="h-px w-12 bg-white/50" />
                  </div>

                  <span className="absolute -top-px right-8 h-12 w-3.5 rounded-b-sm bg-amber-300 shadow-md" />

                  <span className="pointer-events-none absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-white/40" />
                </div>

                {/* inside of the cover */}
                <div
                  className="absolute inset-0 rounded-l-xl rounded-r-sm bg-linear-to-bl from-emerald-800 to-emerald-950"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* wordmark */}
          <h1
            className="mt-14 flex text-4xl font-semibold tracking-tight text-white sm:text-5xl"
            aria-label="BookNook"
          >
            {"BookNook".split("").map((ch, i) => (
              <motion.span
                key={i}
                aria-hidden
                initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: 1.5 + i * 0.05,
                  duration: 0.7,
                  ease: EASE_OUT,
                }}
                className="inline-block"
              >
                {ch}
              </motion.span>
            ))}
          </h1>

          {/* tagline */}
          <p className="mt-3 flex items-center gap-3 text-sm text-white/70 sm:text-base">
            {["Add a book", "Borrow a book", "Return a book"].map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 2.1 + i * 0.18,
                  duration: 0.6,
                  ease: EASE_OUT,
                }}
                className="flex items-center gap-3"
              >
                {i > 0 && (
                  <span className="size-1 rounded-full bg-emerald-400" />
                )}
                {t}
              </motion.span>
            ))}
          </p>
        </div>

        {/* progress */}
        <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3 px-6">
          <div className="flex items-baseline gap-0.5 font-mono text-sm tabular-nums text-white/80">
            <motion.span>{percent}</motion.span>
            <span className="text-white/40">%</span>
          </div>

          <div className="h-1 w-56 overflow-hidden rounded-full bg-white/10 sm:w-72">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-emerald-400 via-teal-300 to-amber-200 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
              style={{ width: barWidth }}
            />
          </div>

          <p className="text-xs text-white/40">Click or press Enter to skip</p>
        </div>
      </motion.div>
    </div>
  );
}

// Wrapper
export default function SplashScreen() {
  const seen = useSyncExternalStore(subscribe, readSeen, () => false);
  const [done, setDone] = useState(false);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />

      <style>{`html[data-splash-seen] #bn-splash { display: none !important; }`}</style>

      {!seen && !done && <Splash onDone={() => setDone(true)} />}
    </>
  );
}
