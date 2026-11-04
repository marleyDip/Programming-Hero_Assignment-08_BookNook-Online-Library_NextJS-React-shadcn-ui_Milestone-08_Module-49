"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookMarked,
  BookOpen,
  BookPlus,
  Library,
  Menu,
  Repeat2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useSyncExternalStore } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { UserMenu } from "./user-menu";

// AUTH PLACEHOLDER: replace with your real auth (NextAuth, Firebase, etc.)
/* type AppUser = { name: string; email: string; photoURL?: string | null };

function useAuth(): { user: AppUser | null; logout: () => void } {
  // Example: const { data } = useSession(); return { user: data?.user ?? null, logout: () => signOut() }
  const [user, setUser] = useState<AppUser | null>(null); // set a user object to preview the logged-in state
  return { user, logout: () => setUser(null) };
} */

// Auth (Better Auth session)
type AppUser = { name: string; email: string; photoURL?: string | null };

// Remembers (in this browser) whether the last visit was logged in, so the
// loading skeleton can match what will appear: avatar & private links for a
// returning member, or Login / Register buttons for a visitor.
const AUTH_HINT_KEY = "booknook:authed";

const subscribeHint = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};

const readHint = () => {
  try {
    return localStorage.getItem(AUTH_HINT_KEY) === "1";
  } catch {
    return false;
  }
};

function useAuth(): {
  user: AppUser | null;
  pending: boolean;
  likelyAuthed: boolean;
  logout: () => Promise<void>;
} {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const likelyAuthed = useSyncExternalStore(
    subscribeHint,
    readHint,
    () => false,
  );

  const user: AppUser | null = data?.user
    ? {
        name: data.user.name,
        email: data.user.email,
        photoURL: data.user.image,
      }
    : null;

  // once the session is known, remember it for the next page load
  const isAuthed = Boolean(data?.user);

  useEffect(() => {
    if (isPending) return;

    try {
      localStorage.setItem(AUTH_HINT_KEY, isAuthed ? "1" : "0");
    } catch {}
  }, [isPending, isAuthed]);

  async function logout() {
    await authClient.signOut();

    toast.success("Logged out successfully.");
    router.push("/");
    router.refresh();
  }

  return { user, pending: isPending, likelyAuthed, logout };
}

// Links
type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  private?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home", icon: BookOpen },
  { href: "/books", label: "All Books", icon: Library },
  { href: "/add-book", label: "Add Book", icon: BookPlus, private: true },
  { href: "/my-books", label: "My Books", icon: BookMarked, private: true },
  { href: "/my-borrows", label: "My Borrows", icon: Repeat2, private: true },
];

const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

// Logo
export function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label="BookNook home"
    >
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-900/20 ring-1 ring-white/20 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-700/30 group-active:scale-95">
        <BookOpen className="size-4.5" strokeWidth={2.2} />
        {/* bookmark ribbon */}
        <span className="absolute -top-px right-1.75 h-3 w-1.25 rounded-b-[2px] bg-amber-300 transition-all duration-300 group-hover:h-4" />

        {/* shine sweep */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </span>

      <span className="text-[1.15rem] font-semibold tracking-tight text-foreground">
        BookNook
      </span>
    </Link>
  );
}

// Loading placeholders (shown while authClient.useSession() is loading)
function LinkSkeletons() {
  return (
    <>
      {["w-[5.5rem]", "w-[5.5rem]", "w-[6.5rem]"].map((w, i) => (
        <span
          key={i}
          aria-hidden
          style={{ animationDelay: `${i * 120}ms` }}
          className={cn("h-8 animate-pulse rounded-full bg-muted", w)}
        />
      ))}
    </>
  );
}

function AuthButtonsSkeleton() {
  return (
    <div role="status" className="flex items-center gap-2">
      <span className="hidden h-10 w-18 animate-pulse rounded-full bg-muted sm:block" />

      <span
        className="h-10 w-23 animate-pulse rounded-full bg-muted"
        style={{ animationDelay: "120ms" }}
      />

      <span className="sr-only">Loading</span>
    </div>
  );
}

function AccountLoading() {
  return (
    <div role="status" aria-live="polite" className="relative size-9">
      <span className="absolute inset-0 animate-pulse rounded-full bg-muted" />

      <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-emerald-500 animation-duration-[0.9s]" />

      <span className="sr-only">Loading your account</span>
    </div>
  );
}

// Desktop links with gliding hover pill & gliding active underline
function DesktopLinksView({
  links,
  pathname,
  loading,
}: {
  links: NavLink[];
  pathname: string;
  loading?: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const transition = reduce ? { duration: 0 } : SPRING;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Main"
      className="relative hidden items-center gap-1 md:flex"
      onMouseLeave={() => setHovered(null)}
    >
      {links.map((link) => {
        const active = isActive(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            onMouseEnter={() => setHovered(link.href)}
            onFocus={() => setHovered(link.href)}
            onBlur={() => setHovered(null)}
            className={cn(
              "group relative rounded-full px-3.5 py-2 text-sm font-medium outline-none transition-colors duration-200",
              "focus-visible:ring-2 focus-visible:ring-emerald-500/60",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {/* hover pill glides between links */}
            <AnimatePresence>
              {hovered === link.href && (
                <motion.span
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-foreground/6 ring-1 ring-inset ring-foreground/6 dark:bg-white/8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                />
              )}
            </AnimatePresence>

            <motion.span
              className="relative flex items-center gap-1.5"
              whileTap={reduce ? undefined : { scale: 0.95 }}
            >
              <Icon
                className={cn(
                  "size-3.75 transition-all duration-300",
                  active
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "opacity-70 group-hover:-translate-y-px group-hover:scale-110 group-hover:text-emerald-600 group-hover:opacity-100 dark:group-hover:text-emerald-400",
                )}
              />
              {link.label}
            </motion.span>

            {/* active indicator glides to the current page */}
            {active && (
              <motion.span
                layoutId="nav-active-bar"
                className="absolute inset-x-3.5 -bottom-0.75 h-[2.5px] rounded-full bg-linear-to-r from-emerald-500 to-teal-500"
                transition={transition}
              />
            )}
          </Link>
        );
      })}

      {loading && <LinkSkeletons />}
    </nav>
  );
}

/** Reads the URL. Must sit inside <Suspense> (needed on dynamic routes like /books/[id]). */
function DesktopLinks({
  links,
  loading,
}: {
  links: NavLink[];
  loading?: boolean;
}) {
  const pathname = usePathname();

  return (
    <DesktopLinksView links={links} pathname={pathname} loading={loading} />
  );
}

// User menu
/* function UserMenu({ user, onLogout }: { user: AppUser; onLogout: () => void }) {
  const router = useRouter();

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="group cursor-pointer rounded-full outline-none ring-2 ring-transparent ring-offset-2 ring-offset-background transition-all duration-300 hover:ring-emerald-500/50 focus-visible:ring-emerald-500 active:scale-90 data-[state=open]:ring-emerald-500 ata-popup-open:ring-emerald-500"
        aria-label="Open user menu"
      >
        <Avatar className="size-9 transition-transform duration-300 group-hover:scale-[1.04]">
          <AvatarImage src={user.photoURL ?? undefined} alt={user.name} />

          <AvatarFallback className="bg-linear-to-br from-emerald-500 to-teal-700 text-xs font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-64 rounded-2xl border-border/60 bg-popover/90 p-1.5 shadow-xl shadow-black/10 backdrop-blur-xl"
      >
        <DropdownMenuGroup>
          {" "}
          <DropdownMenuLabel className="flex items-center gap-3 px-2.5 py-2.5">
            <Avatar className="size-10">
              <AvatarImage src={user.photoURL ?? undefined} alt="" />

              <AvatarFallback className="bg-linear-to-br from-emerald-500 to-teal-700 text-xs font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="cursor-pointer gap-2.5 rounded-xl px-2.5 py-2 transition-transform focus:translate-x-0.5"
        >
          <User className="size-4" />
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer gap-2.5 rounded-xl px-2.5 py-2 text-red-600 transition-transform focus:translate-x-0.5 focus:bg-red-500/10 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
        >
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} */

// Auth buttons
function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "hidden rounded-full px-4 transition-all hover:bg-foreground/6 sm:inline-flex",
        )}
      >
        Login
      </Link>

      <Link
        href="/register"
        className={cn(
          buttonVariants(),
          "group relative overflow-hidden rounded-full border-0 bg-linear-to-br from-emerald-500 to-teal-700 px-5 text-white shadow-md shadow-emerald-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-lg hover:shadow-emerald-700/30 active:translate-y-0 active:scale-95",
        )}
      >
        <span className="relative z-10">Register</span>

        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </Link>
    </div>
  );
}

// Mobile menu
function MobileMenuView({
  links,
  pathname,
  loggedIn,
  loading,
}: {
  links: NavLink[];
  pathname: string;
  loggedIn: boolean;
  loading?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "rounded-full md:hidden",
        )}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-72.5 p-0">
        <SheetHeader className="border-b p-5">
          <SheetTitle>
            <span onClick={() => setOpen(false)}>
              <Logo />
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-1 p-3">
          {links.map((link, i) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -12 }}
                animate={open ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.04 * i, ...SPRING }}
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                    active
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "text-muted-foreground hover:bg-foreground/5 hover:pl-4 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4.5" />
                  {link.label}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {!loggedIn && !loading && (
          <div className="mt-2 flex flex-col gap-2 border-t p-4">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-full",
              )}
            >
              Login
            </Link>

            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants(),
                "rounded-full border-0 bg-linear-to-br from-emerald-500 to-teal-700 text-white hover:text-white",
              )}
            >
              Register
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function MobileMenu(props: {
  links: NavLink[];
  loggedIn: boolean;
  loading?: boolean;
}) {
  const pathname = usePathname();

  return <MobileMenuView {...props} pathname={pathname} />;
}

// Navbar
export default function Navbar() {
  // const pathname = usePathname();

  const { user, pending, likelyAuthed, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Private links only appear when logged in
  const visibleLinks = NAV_LINKS.filter((l) => !l.private || user);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/70 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl supports-backdrop-filter:bg-background/60"
          : "border-b border-transparent bg-background/0",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6",
          scrolled ? "h-16" : "h-18",
        )}
      >
        <div className="flex items-center gap-2">
          {/* <MobileMenu
            links={visibleLinks}
            pathname={pathname}
            loggedIn={!!user}
            loading={pending && likelyAuthed}
          /> */}

          <Suspense
            fallback={
              <MobileMenuView
                links={visibleLinks}
                pathname=""
                loggedIn={!!user}
                loading={pending && likelyAuthed}
              />
            }
          >
            <MobileMenu
              links={visibleLinks}
              loggedIn={!!user}
              loading={pending && likelyAuthed}
            />
          </Suspense>

          <Logo />
        </div>

        {/* <DesktopLinks
          links={visibleLinks}
          pathname={pathname}
          loading={pending && likelyAuthed}
        /> */}

        <Suspense
          fallback={
            <DesktopLinksView
              links={visibleLinks}
              pathname=""
              loading={pending && likelyAuthed}
            />
          }
        >
          <DesktopLinks
            links={visibleLinks}
            loading={pending && likelyAuthed}
          />
        </Suspense>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {pending ? (
            likelyAuthed ? (
              <AccountLoading />
            ) : (
              <AuthButtonsSkeleton />
            )
          ) : user ? (
            <UserMenu user={user} onLogout={logout} />
          ) : (
            <AuthButtons />
          )}
        </div>
      </div>
    </header>
  );
}
