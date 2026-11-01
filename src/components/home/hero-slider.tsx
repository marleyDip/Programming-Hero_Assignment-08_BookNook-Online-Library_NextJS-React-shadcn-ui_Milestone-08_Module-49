"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type PanInfo,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BookPlus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pause,
  Play,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

import Link from "next/link";
import { useCallback, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Content
type BookSpec = { title: string; author: string; cover: string };

type Slide = {
  id: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  accentFrom: number; // words from this index are highlighted
  text: string;
  note: string;
  bg: string;
  glow: string;
  accent: string;
  chip: { icon: LucideIcon; label: string; sub: string };
  books: [BookSpec, BookSpec, BookSpec];
};

const SLIDES: Slide[] = [
  {
    id: "discover",
    eyebrow: "Discover",
    icon: BookOpen,
    title: "Find your next great read",
    accentFrom: 3,
    text: "Browse a growing shelf of books shared by readers like you, then borrow one for a few days. No fees, no fuss.",
    note: "Free to join · Borrow for a few days",
    bg: "from-emerald-950 via-[#0b3b32] to-teal-800",
    glow: "bg-emerald-400/30",
    accent: "text-emerald-300",

    chip: {
      icon: Sparkles,
      label: "Handpicked by readers",
      sub: "New titles added often",
    },

    books: [
      {
        title: "The Quiet Orchard",
        author: "Mira Lane",
        cover: "from-emerald-300 to-emerald-600 text-emerald-950",
      },
      {
        title: "Atlas of Small Things",
        author: "J. Okafor",
        cover: "from-amber-200 to-amber-400 text-amber-950",
      },
      {
        title: "Midnight Cartographer",
        author: "E. Varga",
        cover: "from-slate-100 to-slate-300 text-slate-900",
      },
    ],
  },

  {
    id: "share",
    eyebrow: "Share",
    icon: BookPlus,
    title: "Turn your shelf into a library",
    accentFrom: 5,
    text: "Add the books you've finished and let someone else fall in love with the story. Sharing takes less than a minute.",
    note: "Add a book in under a minute",
    bg: "from-[#1f1109] via-[#43250f] to-[#8a5520]",
    glow: "bg-amber-400/30",
    accent: "text-amber-300",

    chip: {
      icon: BookPlus,
      label: "Book added",
      sub: "Now available to borrow",
    },

    books: [
      {
        title: "A Garden of Margins",
        author: "N. Hartley",
        cover: "from-orange-200 to-orange-500 text-orange-950",
      },
      {
        title: "The Lending Season",
        author: "Ravi Menon",
        cover: "from-yellow-100 to-amber-300 text-amber-950",
      },
      {
        title: "Paper Lanterns",
        author: "Sana Idris",
        cover: "from-rose-200 to-rose-400 text-rose-950",
      },
    ],
  },

  {
    id: "borrow",
    eyebrow: "Borrow",
    icon: Clock,
    title: "Borrow for days, return in a tap",
    accentFrom: 3,
    text: "Keep every borrow in one place, see how many days you have left, and send a book back the moment you're done.",
    note: "Track every borrow from My Borrows",
    bg: "from-slate-950 via-[#0a2a43] to-teal-900",
    glow: "bg-sky-400/30",
    accent: "text-sky-300",

    chip: {
      icon: Clock,
      label: "Due in 5 days",
      sub: "Return anytime in one tap",
    },

    books: [
      {
        title: "Seven Days of Rain",
        author: "Linh Tran",
        cover: "from-sky-200 to-sky-500 text-sky-950",
      },
      {
        title: "The Return Path",
        author: "O. Bellamy",
        cover: "from-cyan-100 to-teal-300 text-teal-950",
      },
      {
        title: "Slow Tides",
        author: "Ines Duarte",
        cover: "from-indigo-200 to-indigo-400 text-indigo-950",
      },
    ],
  },

  {
    id: "community",
    eyebrow: "Community",
    icon: Users,
    title: "A reading community, one book at a time",
    accentFrom: 3,
    text: "Discover what others are reading, share what you love, and keep great stories moving from hand to hand.",
    note: "Join free and start borrowing today",
    bg: "from-[#20091a] via-[#4a1730] to-[#8a2f55]",
    glow: "bg-rose-400/30",
    accent: "text-rose-300",

    chip: { icon: Users, label: "Join the community", sub: "Free to register" },

    books: [
      {
        title: "Where Readers Gather",
        author: "T. Alvarez",
        cover: "from-rose-200 to-rose-400 text-rose-950",
      },
      {
        title: "The Open Shelf",
        author: "Priya Nair",
        cover: "from-fuchsia-200 to-pink-400 text-pink-950",
      },
      {
        title: "Common Ground",
        author: "H. Lindqvist",
        cover: "from-stone-100 to-stone-300 text-stone-900",
      },
    ],
  },
];

const AUTOPLAY_MS = 6500;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const slideVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 90 }),

  center: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },

  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -90,
    transition: { duration: 0.45, ease: EASE },
  }),
};

// Book cover art
function Book({ book }: { book: BookSpec }) {
  return (
    <div
      className={cn(
        "relative h-56 w-40 select-none overflow-hidden rounded-l-sm rounded-r-lg bg-linear-to-br shadow-2xl shadow-black/50 ring-1 ring-white/25",
        book.cover,
      )}
    >
      <span className="absolute inset-y-0 left-0 w-3 bg-black/25" />
      <span className="absolute inset-y-0 left-3 w-px bg-white/40" />

      <div className="flex h-full flex-col justify-between p-4 pl-7">
        <div>
          <span className="block h-px w-8 bg-current opacity-60" />
          <p className="mt-3 font-serif text-[15px] font-bold leading-tight">
            {book.title}
          </p>
        </div>

        <p className="text-[10px] font-medium uppercase tracking-[0.18em] opacity-70">
          {book.author}
        </p>
      </div>

      <span className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/0 via-white/10 to-white/35" />
    </div>
  );
}

function ParallaxLayer({
  px,
  py,
  depth,
  className,
  children,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  depth: number;
  className?: string;
  children: React.ReactNode;
}) {
  const x = useTransform(px, [-1, 1], [-depth, depth]);

  const y = useTransform(py, [-1, 1], [-depth, depth]);

  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}

const BOOK_POSITIONS = [
  { cls: "left-0 top-20 -rotate-12", depth: 12 },
  { cls: "left-[7.5rem] top-2 z-10 rotate-3 scale-110", depth: 26 },
  { cls: "left-60 top-24 rotate-[14deg]", depth: 16 },
];

function Art({
  slide,
  px,
  py,
}: {
  slide: Slide;
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  const ChipIcon = slide.chip.icon;
  return (
    <div className="relative mx-auto h-104 w-108 origin-center md:scale-[0.68] lg:scale-[0.85] xl:scale-100">
      {/* soft halo + slow dashed ring */}
      <div className="absolute inset-6 rounded-full bg-white/6 blur-2xl" />

      <motion.div
        aria-hidden
        className="absolute inset-4 rounded-full border border-dashed border-white/15"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {slide.books.map((book, i) => (
        <div key={book.title} className={cn("absolute", BOOK_POSITIONS[i].cls)}>
          <ParallaxLayer px={px} py={py} depth={BOOK_POSITIONS[i].depth}>
            <motion.div
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.85,
                delay: 0.25 + i * 0.12,
                ease: EASE,
              }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 5 + i * 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="cursor-pointer"
                >
                  <Book book={book} />
                </motion.div>
              </motion.div>
            </motion.div>
          </ParallaxLayer>
        </div>
      ))}

      {/* floating glass chip */}
      <ParallaxLayer
        px={px}
        py={py}
        depth={34}
        className="absolute bottom-1 left-6 z-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-xl shadow-black/20 backdrop-blur-md"
          >
            <span
              className={cn(
                "grid size-9 place-items-center rounded-xl bg-white/15",
                slide.accent,
              )}
            >
              <ChipIcon className="size-4.5" />
            </span>

            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">
                {slide.chip.label}
              </p>
              <p className="text-xs text-white/65">{slide.chip.sub}</p>
            </div>
          </motion.div>
        </motion.div>
      </ParallaxLayer>
    </div>
  );
}

// Text side of a slide
function SlideText({ slide }: { slide: Slide }) {
  const Icon = slide.icon;
  const words = slide.title.split(" ");

  return (
    <div className="max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] backdrop-blur-md",
          slide.accent,
        )}
      >
        <Icon className="size-3.5" />
        {slide.eyebrow}
      </motion.div>

      <h2 className="mt-5 text-4xl font-semibold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl">
        {words.map((w, i) => (
          <span
            key={i}
            className="mr-[0.25em] inline-block overflow-hidden pb-1.5 align-bottom"
          >
            <motion.span
              className={cn(
                "inline-block",
                i >= slide.accentFrom && slide.accent,
              )}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.75,
                delay: 0.18 + i * 0.07,
                ease: EASE,
              }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.5, ease: EASE }}
        className="mt-5 max-w-md text-base leading-relaxed text-white/75 sm:text-lg"
      >
        {slide.text}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.62, ease: EASE }}
        className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3"
      >
        <Link
          href="/books"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group relative h-12 overflow-hidden rounded-full bg-white px-7 text-base font-semibold text-neutral-900 shadow-xl shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-2xl active:translate-y-0 active:scale-95",
          )}
        >
          <span className="relative z-10 flex items-center gap-2">
            Browse Books
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>

          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-emerald-200/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </Link>

        <span className="text-sm text-white/55">{slide.note}</span>
      </motion.div>
    </div>
  );
}

// Slider
export default function HeroSlider() {
  const [{ index, dir }, setPage] = useState({ index: 0, dir: 1 });
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  const total = SLIDES.length;
  const slide = SLIDES[index];
  const running = playing && !hovered && !dragging;

  const go = useCallback(
    (to: number, d: number) => setPage({ index: (to + total) % total, dir: d }),
    [total],
  );

  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);

  // mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 70, damping: 16, mass: 0.6 });
  const py = useSpring(my, { stiffness: 70, damping: 16, mass: 0.6 });

  function onDragEnd(_: unknown, info: PanInfo) {
    setDragging(false);
    if (info.offset.x < -80 || info.velocity.x < -500) next();
    else if (info.offset.x > 80 || info.velocity.x > 500) prev();
  }

  return (
    <MotionConfig reducedMotion="user">
      <style>{`
        @keyframes bn-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) { .bn-progress { animation: none !important; transform: scaleX(1); } }
      `}</style>

      <section
        aria-roledescription="carousel"
        aria-label="Featured"
        className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6"
      >
        <div
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            mx.set(0);
            my.set(0);
          }}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
            my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
          }}
          className="relative isolate h-145 overflow-hidden rounded-[1.75rem] border border-white/10 bg-neutral-950 shadow-2xl shadow-emerald-950/25 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:rounded-[2.25rem] md:h-150"
        >
          {/* Backgrounds (cross-fade) */}
          <AnimatePresence initial={false}>
            <motion.div
              key={slide.id}
              aria-hidden
              className={cn("absolute inset-0 -z-10 bg-linear-to-br", slide.bg)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
            >
              <div
                className={cn(
                  "absolute -right-24 top-1/4 size-130 rounded-full blur-3xl",
                  slide.glow,
                )}
              />

              <div
                className={cn(
                  "absolute -bottom-40 -left-24 size-130 rounded-full opacity-60 blur-3xl",
                  slide.glow,
                )}
              />

              <div className="absolute inset-0 [background-image:radial-linear(rgba(255,255,255,0.09)_1px,transparent_1px)] bg-size-[24px_24px] mask-[linear-linear(to_bottom,black,transparent_85%)]" />
              <span className="absolute right-8 top-2 select-none text-[11rem] font-bold leading-none tracking-tighter text-white/4">
                {String(index + 1).padStart(2, "0")}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Slides */}
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={slide.id}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.14}
              onDragStart={() => setDragging(true)}
              onDragEnd={onDragEnd}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${total}`}
              className="absolute inset-0 cursor-grab select-none active:cursor-grabbing"
            >
              <div className="grid h-full items-center gap-6 px-6 pb-32 pt-10 sm:px-10 md:grid-cols-[1.05fr_0.95fr] md:px-14">
                <SlideText slide={slide} />
                <div className="relative hidden md:block">
                  <Art slide={slide} px={px} py={py} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-5 px-6 pb-6 sm:px-10 md:flex-row md:items-end md:justify-between md:px-14">
            <div className="pointer-events-auto flex w-full max-w-xl gap-2.5">
              {SLIDES.map((s, i) => {
                const active = i === index;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => go(i, i > index ? 1 : -1)}
                    aria-label={`Go to slide ${i + 1}: ${s.eyebrow}`}
                    aria-current={active}
                    className="group flex-1 text-left outline-none"
                  >
                    <span
                      className={cn(
                        "mb-2 hidden text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 sm:block",
                        active
                          ? "text-white"
                          : "text-white/40 group-hover:text-white/75",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")} · {s.eyebrow}
                    </span>

                    <span className="relative block h-1.5 overflow-hidden rounded-full bg-white/20 transition-all duration-300 group-hover:bg-white/30 group-focus-visible:ring-2 group-focus-visible:ring-white/70">
                      {active &&
                        (playing ? (
                          <span
                            key={`${index}-bar`}
                            onAnimationEnd={next}
                            className="bn-progress absolute inset-0 origin-left rounded-full bg-white"
                            style={{
                              animation: `bn-progress ${AUTOPLAY_MS}ms linear forwards`,
                              animationPlayState: running
                                ? "running"
                                : "paused",
                            }}
                          />
                        ) : (
                          <span className="absolute inset-0 rounded-full bg-white" />
                        ))}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pointer-events-auto flex items-center gap-2.5">
              <span className="mr-1 hidden text-sm tabular-nums text-white/60 sm:block">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>

              <CtrlButton
                label={playing ? "Pause autoplay" : "Play autoplay"}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
              </CtrlButton>

              <CtrlButton label="Previous slide" onClick={prev}>
                <ChevronLeft className="size-5" />
              </CtrlButton>

              <CtrlButton label="Next slide" onClick={next}>
                <ChevronRight className="size-5" />
              </CtrlButton>
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            {slide.eyebrow}: {slide.title}
          </p>
        </div>
      </section>
    </MotionConfig>
  );
}

function CtrlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white outline-none backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70 active:scale-90"
    >
      {children}
    </button>
  );
}
