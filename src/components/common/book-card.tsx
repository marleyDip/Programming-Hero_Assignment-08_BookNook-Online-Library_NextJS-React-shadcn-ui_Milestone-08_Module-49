"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, PenLine } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import type { Book } from "@/lib/books-config";
import { cn } from "@/lib/utils";

export default function BookCard({
  book,
  index,
  showBadge,
}: {
  book: Book;
  index: number;
  showBadge?: boolean; // defaults to: only the first card
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const isNewest = showBadge ?? index === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.65,
        delay: (index % 3) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();

        e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);

        e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card p-3 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-900/10"
    >
      {/* cursor-following spotlight */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 [background:radial-gradient(320px_circle_at_var(--x,50%)_var(--y,50%),rgba(52,211,153,0.16),transparent_65%)] group-hover:opacity-100" />

      {/* image */}
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-muted">
        {imgFailed || !book.image ? (
          <div className="grid h-full w-full place-items-center bg-linear-to-br from-emerald-500 to-teal-700 p-6 text-center text-white">
            <div>
              <BookOpen className="mx-auto size-10 opacity-80" />

              <p className="mt-3 font-serif text-lg font-bold leading-tight">
                {book.title}
              </p>
            </div>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.image}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

        <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
          {book.category}
        </span>

        {isNewest && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-2.5 py-1 text-[11px] font-semibold text-amber-950 shadow-lg">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-700/60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-amber-700" />
            </span>
            Just in
          </span>
        )}
      </div>

      {/* details */}
      <div className="relative z-20 flex flex-1 flex-col px-2 pb-2 pt-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
          {book.title}
        </h3>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <PenLine className="size-3.5" />
          {book.author}
        </p>

        <Link
          href={`/books/${book._id}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "group/btn relative mt-5 h-11 w-full overflow-hidden rounded-full border-border/80 bg-transparent font-medium transition-all duration-300",
            "hover:border-transparent hover:bg-linear-to-br hover:from-emerald-500 hover:to-teal-700 hover:text-white hover:shadow-lg hover:shadow-emerald-700/25 active:scale-95",
          )}
        >
          View Details
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}
