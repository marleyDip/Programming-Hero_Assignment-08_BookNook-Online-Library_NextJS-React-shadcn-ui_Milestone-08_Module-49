"use client";

/**
 * Left: a premium 3D sidebar (tilts with the mouse, raised active item).
 * Right: the page you picked. Phones get a tab bar instead of the sidebar.
 */

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  BookMarked,
  BookPlus,
  Library,
  Lightbulb,
  Repeat2,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const ITEMS: { href: string; label: string; hint: string; icon: LucideIcon }[] =
  [
    {
      href: "/add-book",
      label: "Add Book",
      hint: "Share a new title",
      icon: BookPlus,
    },
    {
      href: "/my-books",
      label: "My Books",
      hint: "Books you've added",
      icon: BookMarked,
    },
    {
      href: "/my-borrows",
      label: "My Borrows",
      hint: "Books you're reading",
      icon: Repeat2,
    },
  ];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data } = authClient.useSession();
  const user = data?.user;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // gentle 3D tilt of the sidebar
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(sx, [-1, 1], [-5, 5]);
  const rotateX = useTransform(sy, [-1, 1], [4, -4]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      {/* mobile / tablet tab bar */}
      <nav
        aria-label="Dashboard"
        className="mb-6 grid grid-cols-3 gap-1 rounded-2xl border border-border/70 bg-card p-1.5 shadow-sm lg:hidden"
      >
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500/60 sm:flex-row sm:justify-center sm:gap-2 sm:text-sm",
                active
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="dash-tab-pill"
                  className="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 shadow-md shadow-emerald-700/30"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icon className="relative size-4.5" />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="grid gap-8 lg:grid-cols-[19rem_1fr] xl:grid-cols-[20rem_1fr]">
        {/* desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24" style={{ perspective: "1200px" }}>
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();

                mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
                my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
              }}
              onPointerLeave={() => {
                mx.set(0);
                my.set(0);
              }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative isolate overflow-hidden rounded-4xl bg-linear-to-br from-emerald-950 via-[#0b3b32] to-teal-800 p-4 text-white shadow-2xl shadow-emerald-950/30 ring-1 ring-white/10"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 -z-10 size-56 rounded-full bg-emerald-400/25 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-20 -left-10 -z-10 size-52 rounded-full bg-amber-300/10 blur-3xl" />

              <div className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-linear(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[22px_22px] mask-[linear-linear(to_bottom,black,transparent_85%)]" />

              {/* user card */}
              <div
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md"
                style={{ transform: "translateZ(30px)" }}
              >
                <Avatar className="size-12 ring-2 ring-white/30">
                  <AvatarImage src={user?.image ?? undefined} alt="" />

                  <AvatarFallback className="bg-linear-to-br from-emerald-400 to-teal-600 text-sm font-semibold text-white">
                    {user ? initials(user.name) : "…"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 leading-tight">
                  {user ? (
                    <>
                      <p className="truncate font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-white/60">
                        {user.email}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="h-4 w-28 animate-pulse rounded-full bg-white/20" />
                      <div className="mt-2 h-3 w-36 animate-pulse rounded-full bg-white/15" />
                    </>
                  )}
                </div>
              </div>

              <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Dashboard
              </p>

              {/* nav */}
              <nav
                aria-label="Dashboard"
                className="space-y-1.5"
                style={{ transform: "translateZ(20px)" }}
              >
                {ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="group relative block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      {active && (
                        <motion.span
                          layoutId="dash-pill"
                          className="absolute inset-0 rounded-2xl bg-white/15 shadow-[0_5px_0_-1px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.25)] ring-1 ring-white/25"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                        />
                      )}

                      {active && (
                        <motion.span
                          layoutId="dash-bar"
                          className="absolute -left-4 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-full bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.9)]"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                        />
                      )}

                      <motion.div
                        whileHover={{ x: active ? 0 : 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 22,
                        }}
                        className="relative flex items-center gap-3.5 px-3 py-3"
                      >
                        <span
                          className={cn(
                            "grid size-10 shrink-0 place-items-center rounded-xl transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110",
                            active
                              ? "bg-white text-emerald-800 shadow-lg"
                              : "bg-white/10 text-white/80 group-hover:bg-white/20",
                          )}
                        >
                          <Icon className="size-5" />
                        </span>

                        <span className="leading-tight">
                          <span
                            className={cn(
                              "block text-sm font-semibold",
                              !active && "text-white/85",
                            )}
                          >
                            {item.label}
                          </span>

                          <span className="block text-xs text-white/50">
                            {item.hint}
                          </span>
                        </span>
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>

              <div className="my-5 h-px bg-white/10" />

              <div
                className="space-y-1"
                style={{ transform: "translateZ(12px)" }}
              >
                {[
                  {
                    href: "/profile",
                    label: "Profile settings",
                    icon: Settings2,
                  },
                  {
                    href: "/books",
                    label: "Browse the library",
                    icon: Library,
                  },
                ].map((l) => {
                  const Icon = l.icon;

                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      <Icon className="size-4" />
                      {l.label}
                      <ArrowUpRight className="ml-auto size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </Link>
                  );
                })}
              </div>

              {/* tip */}
              <div
                className="mt-5 flex gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3.5 text-xs leading-relaxed text-amber-100/90"
                style={{ transform: "translateZ(24px)" }}
              >
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-300" />
                Return books on time so the next reader can enjoy them too.
              </div>
            </motion.div>
          </div>
        </aside>

        {/* ---------- content ---------- */}
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
