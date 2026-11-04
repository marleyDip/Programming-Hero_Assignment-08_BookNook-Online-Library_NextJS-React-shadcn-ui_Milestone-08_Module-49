"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  BookMarked,
  BookPlus,
  Calendar,
  Mail,
  Repeat2,
  ShieldCheck,
  User,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

import {
  EmailForm,
  ProfileForm,
  SecurityForm,
} from "@/components/profile/profile-forms";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type TabId = "profile" | "email" | "security";

const TABS: { id: TabId; label: string; hint: string; icon: LucideIcon }[] = [
  { id: "profile", label: "Profile", hint: "Name and photo", icon: User },
  { id: "email", label: "Email", hint: "Change your email", icon: Mail },
  {
    id: "security",
    label: "Security",
    hint: "Update your password",
    icon: ShieldCheck,
  },
];

// TODO: replace these sample numbers with real counts from your Express API
const STATS: {
  label: string;
  value: number;
  icon: LucideIcon;
  href: string;
}[] = [
  { label: "Books added", value: 12, icon: BookPlus, href: "/my-books" },
  { label: "Books borrowed", value: 8, icon: BookMarked, href: "/my-borrows" },
  { label: "Reading now", value: 2, icon: Repeat2, href: "/my-borrows" },
];

function Counter({ to }: { to: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(mv, to, { duration: 1.2, ease: "easeOut" });
    return () => controls.stop();
  }, [mv, to]);
  return <motion.span>{rounded}</motion.span>;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Skeleton
export function ProfileSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6"
      role="status"
      aria-label="Loading profile"
    >
      <div className="overflow-hidden rounded-4xl border border-border/70 bg-card">
        <div className="h-36 animate-pulse bg-muted" />

        <div className="space-y-3 px-8 pb-8">
          <div className="-mt-12 size-24 animate-pulse rounded-full bg-muted ring-4 ring-card" />
          <div className="h-6 w-48 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded-full bg-muted" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[17rem_1fr]">
        <div className="h-48 animate-pulse rounded-3xl bg-muted" />
        <div className="h-96 animate-pulse rounded-3xl bg-muted" />
      </div>

      <span className="sr-only">Loading</span>
    </div>
  );
}

// View
export default function ProfileView() {
  const { data: session, isPending } = authClient.useSession();

  const [tab, setTab] = useState<TabId>("profile");
  const [providers, setProviders] = useState<string[] | null>(null);

  // which sign-in methods does this account have? (password, Google ...)
  useEffect(() => {
    let alive = true;

    authClient.listAccounts().then(({ data }) => {
      if (alive) setProviders((data ?? []).map((a) => a.providerId));
    });

    return () => {
      alive = false;
    };
  }, []);

  if (isPending) return <ProfileSkeleton />;

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-lg font-semibold">You&apos;re not logged in</p>

        <Link
          href="/login?callbackUrl=/profile"
          className="mt-3 inline-block text-emerald-600 underline-offset-4 hover:underline"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const user = session.user;
  const hasPassword = providers ? providers.includes("credential") : true;
  const hasGoogle = providers?.includes("google") ?? false;
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header card */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-4xl border border-border/70 bg-card shadow-xl shadow-emerald-900/5"
      >
        <div className="relative h-36 overflow-hidden bg-linear-to-br from-emerald-950 via-[#0b3b32] to-teal-700 sm:h-44">
          <div className="absolute -right-10 -top-16 size-64 rounded-full bg-emerald-400/30 blur-3xl" />

          <div className="absolute -bottom-20 left-10 size-56 rounded-full bg-amber-300/15 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[22px_22px] mask-[linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <div className="px-6 pb-7 sm:px-10">
          <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <motion.div
                whileHover={{ scale: 1.04, rotate: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Avatar className="size-28 ring-[6px] ring-card sm:size-32">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />

                  <AvatarFallback className="bg-linear-to-br from-emerald-500 to-teal-700 text-3xl font-semibold text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="min-w-0 pb-1">
                <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                  {user.name}
                </h1>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Reader
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    Member since {memberSince}
                  </span>

                  {hasGoogle && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
                      <FcGoogle className="size-3.5" />
                      Google
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* stats */}
          <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-4">
            {STATS.map((s, i) => {
              const Icon = s.icon;

              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.5 }}
                >
                  <Link
                    href={s.href}
                    className="group block rounded-2xl border border-border/70 bg-muted/40 p-4 outline-none transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:shadow-lg hover:shadow-emerald-900/5 focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                  >
                    <Icon className="size-5 text-emerald-600 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 dark:text-emerald-400" />
                    <p className="mt-3 text-2xl font-semibold tabular-nums sm:text-3xl">
                      <Counter to={s.value} />
                    </p>

                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {s.label}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ---------- Tabs & panel ---------- */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[17rem_1fr]">
        <nav
          aria-label="Profile sections"
          className="flex gap-2 overflow-x-auto rounded-3xl border border-border/70 bg-card p-2 lg:sticky lg:top-24 lg:flex-col lg:self-start"
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-emerald-500/60 lg:w-full",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="profile-tab-pill"
                    className="absolute inset-0 rounded-2xl bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/30"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span
                  className={cn(
                    "relative grid size-10 shrink-0 place-items-center rounded-xl transition-all duration-300 group-hover:scale-105",
                    active
                      ? "bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-700/30"
                      : "bg-muted",
                  )}
                >
                  <Icon className="size-4.5" />
                </span>

                <span className="relative leading-tight">
                  <span className="block text-sm font-semibold">{t.label}</span>

                  <span className="hidden text-xs text-muted-foreground lg:block">
                    {t.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {tab === "profile" && <ProfileForm user={user} />}

              {tab === "email" && (
                <EmailForm
                  user={user}
                  managedByGoogle={!hasPassword && hasGoogle}
                />
              )}

              {tab === "security" && <SecurityForm hasPassword={hasPassword} />}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
