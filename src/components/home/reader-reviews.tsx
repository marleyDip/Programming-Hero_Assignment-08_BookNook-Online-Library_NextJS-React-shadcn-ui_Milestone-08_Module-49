/**
 * "Reader Reviews" section (infinite marquee, pauses on hover)
 * Place at: components/reader-reviews.tsx   (server component, CSS-only motion)
 *
 * NOTE: these reviews are sample content. Replace them with real ones.
 */

import { ArrowRight, Quote, Star } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Review = { name: string; role: string; text: string; color: string };

const ROW_ONE: Review[] = [
  {
    name: "Ayesha Rahman",
    role: "Borrowed 12 books",
    text: "I found three books I had wanted for months, all in one evening. Borrowing takes a single click.",
    color: "from-emerald-400 to-teal-600",
  },
  {
    name: "Tanvir Hasan",
    role: "Shares his collection",
    text: "Adding my old paperbacks was quick, and it feels great knowing someone else is enjoying them.",
    color: "from-amber-300 to-orange-500",
  },
  {
    name: "Nusrat Jahan",
    role: "Weekend reader",
    text: "Seeing exactly how many days I have left means I actually finish what I borrow.",
    color: "from-sky-400 to-indigo-500",
  },
  {
    name: "Farhan Ahmed",
    role: "Student",
    text: "A clean, fast library with no clutter. Returning a book is literally one tap.",
    color: "from-rose-400 to-pink-600",
  },
];

const ROW_TWO: Review[] = [
  {
    name: "Mitu Akter",
    role: "Book club host",
    text: "Our whole book club uses BookNook now. Passing books around has never been this easy.",
    color: "from-fuchsia-400 to-purple-600",
  },
  {
    name: "Rafiq Islam",
    role: "Borrowed 8 books",
    text: "The categories make it easy to discover things I would never have picked up myself.",
    color: "from-teal-400 to-cyan-600",
  },
  {
    name: "Sadia Karim",
    role: "Avid reader",
    text: "It feels like a small neighbourhood library, but it fits in my pocket.",
    color: "from-lime-400 to-emerald-600",
  },
  {
    name: "Imran Chowdhury",
    role: "Newcomer",
    text: "Signed up, borrowed a book and was reading within five minutes. Beautifully simple.",
    color: "from-yellow-300 to-amber-500",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="group relative h-full w-[320px] rounded-3xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-900/10 sm:w-90">
      <Quote className="absolute right-5 top-5 size-8 text-emerald-500/15 transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-500/30" />
      <div className="flex gap-0.5" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground/85">
        {r.text}
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3">
        <span
          className={cn(
            "grid size-10 place-items-center rounded-full bg-linear-to-br text-sm font-semibold text-white shadow-md",
            r.color,
          )}
        >
          {initials(r.name)}
        </span>

        <span className="leading-tight">
          <span className="block text-sm font-semibold">{r.name}</span>
          <span className="block text-xs text-muted-foreground">{r.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function MarqueeRow({
  items,
  reverse,
}: {
  items: Review[];
  reverse?: boolean;
}) {
  return (
    <div className="bn-marquee-wrap overflow-hidden py-2 mask-[linear-linear(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className={cn(
          "bn-marquee-track flex w-max animate-[bn-marquee_55s_linear_infinite] hover:paused",
          reverse && "shimmer-reverse",
        )}
      >
        {[...items, ...items].map((r, i) => (
          <div key={i} className="pr-5" aria-hidden={i >= items.length}>
            <ReviewCard r={r} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReaderReviews() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <style>{`
        @keyframes bn-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .bn-marquee-track { animation: none !important; }
          .bn-marquee-wrap { overflow-x: auto; }
        }
      `}</style>

      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-105 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-amber-700 dark:text-amber-400">
          <Star className="size-3.5 fill-current" />
          Reader reviews
        </span>

        <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Loved by people who love books
        </h2>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Hear from readers who add, borrow and return books every week.
        </p>
      </div>

      <div className="mt-12 space-y-5">
        <MarqueeRow items={ROW_ONE} />
        <MarqueeRow items={ROW_TWO} reverse />
      </div>

      <div className="mt-12 flex justify-center px-4">
        <Link
          href="/register"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "group h-12 rounded-full border-border/80 px-7 text-base font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-emerald-500/10 active:scale-95",
          )}
        >
          Join the community
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
