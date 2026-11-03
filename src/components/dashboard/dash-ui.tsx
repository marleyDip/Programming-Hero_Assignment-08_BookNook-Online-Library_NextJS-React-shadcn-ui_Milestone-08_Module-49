"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { AlertTriangle, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Same output on the server and in the browser (no locale or timezone surprises) */
export function formatDate(iso: string | null | undefined) {
  if (!iso) return "-";

  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function Counter({ to }: { to: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  useEffect(() => {
    const controls = animate(mv, to, { duration: 1.1, ease: "easeOut" });
    return () => controls.stop();
  }, [mv, to]);
  return <motion.span>{rounded}</motion.span>;
}

export function StatTile({
  icon: Icon,
  label,
  value,
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, rotateX: 20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 800 }}
      className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-900/5 sm:p-5"
    >
      <Icon className="size-5 text-emerald-600 dark:text-emerald-400" />
      <p className="mt-3 text-2xl font-semibold tabular-nums sm:text-3xl">
        <Counter to={value} />
      </p>
      <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
    </motion.div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  text,
  href,
  cta,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
      <span className="grid size-20 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <Icon className="size-9" />
      </span>
      <h2 className="mt-6 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
      <Link
        href={href}
        className={cn(
          buttonVariants(),
          "mt-6 h-11 rounded-full border-0 bg-linear-to-br from-emerald-500 to-teal-700 px-6 font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:text-white active:scale-95",
        )}
      >
        {cta}
      </Link>
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-700 dark:text-rose-300"
    >
      <AlertTriangle className="mt-0.5 size-5 shrink-0" />
      <div>
        <p className="font-semibold">We couldn&apos;t load your data</p>
        <p className="mt-1 opacity-90">{message}</p>
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading">
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{ animationDelay: `${i * 90}ms` }}
          className="h-32 animate-pulse rounded-3xl bg-muted"
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

/* Make it perfect for dashboard server component sent icon to client component. The icon is sent as a string and then mapped to the corresponding LucideIcon component. This allows for dynamic icon rendering based on the provided string.

import { BookOpen, BookPlus } from "lucide-react";

interface DashHeaderProps {
  icon: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

const icons: Record<string, LucideIcon> = {
  BookPlus,
  BookOpen,
};

export function DashHeader({
  icon,
  title,
  subtitle,
  action,
}: DashHeaderProps) {
  const Icon = icons[icon] || BookOpen;
  
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-700/30">
          <Icon className="size-6" />
        </span>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </div>
      </div>

      {action}
    </div>
  );
} 
  
*/
