"use client";

import {
  BookMarked,
  BookPlus,
  ChevronRight,
  LogOut,
  Repeat2,
  User,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type AppUser = { name: string; email: string; photoURL?: string | null };

const LINKS: { href: string; title: string; hint: string; icon: LucideIcon }[] =
  [
    {
      href: "/profile",
      title: "My Profile",
      hint: "View and edit your details",
      icon: User,
    },
    {
      href: "/my-books",
      title: "My Books",
      hint: "Books you've added",
      icon: BookMarked,
    },
    {
      href: "/my-borrows",
      title: "My Borrows",
      hint: "Books you're reading now",
      icon: Repeat2,
    },
    {
      href: "/add-book",
      title: "Add a Book",
      hint: "Share a new title",
      icon: BookPlus,
    },
  ];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function MenuRow({
  icon: Icon,
  title,
  hint,
  index,
  danger,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
  index: number;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      style={{
        animationDelay: `${70 + index * 45}ms`,
        animationFillMode: "backwards",
      }}
      className={cn(
        "group/item animate-in fade-in-0 slide-in-from-left-2 cursor-pointer gap-3 rounded-xl px-2.5 py-2.5 outline-none duration-300",
        danger
          ? "text-rose-600 focus:bg-rose-500/10 focus:text-rose-600 data-highlighted:bg-rose-500/10 dark:text-rose-400 dark:focus:text-rose-400"
          : "focus:bg-emerald-500/10 data-highlighted:bg-emerald-500/10",
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-xl transition-all duration-300 group-data-highlighted/item:-rotate-6 group-data-highlighted/item:scale-110",
          danger
            ? "bg-rose-500/10 text-rose-600 group-data-highlighted/item:bg-rose-500 group-data-highlighted/item:text-white dark:text-rose-400"
            : "bg-muted text-muted-foreground group-data-highlighted/item:bg-linear-to-br group-data-highlighted/item:from-emerald-500 group-data-highlighted/item:to-teal-700 group-data-highlighted/item:text-white group-data-highlighted/item:shadow-md group-data-highlighted/item:shadow-emerald-700/30",
        )}
      >
        <Icon className="size-4" />
      </span>

      <span className="min-w-0 flex-1 leading-tight">
        <span className="block text-sm font-medium">{title}</span>
        {hint && (
          <span className="block truncate text-xs text-muted-foreground">
            {hint}
          </span>
        )}
      </span>

      <ChevronRight className="size-4 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-300 group-data-highlighted/item:translate-x-0 group-data-highlighted/item:opacity-100" />
    </DropdownMenuItem>
  );
}

export function UserMenu({
  user,
  onLogout,
}: {
  user: AppUser;
  onLogout: () => void;
}) {
  const router = useRouter();
  const initials = getInitials(user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="group relative cursor-pointer rounded-full p-0.5 outline-none transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-90"
      >
        {/* spinning gradient ring (hover / open) */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#34d399,#14b8a6,#fcd34d,#34d399)] opacity-0 blur-[0.5px] transition-opacity duration-300 animation-duration-[3s] group-hover:animate-spin group-hover:opacity-100 group-data-popup-open:animate-spin group-data-popup-open:opacity-100 group-data-[state=open]:animate-spin group-data-[state=open]:opacity-100"
        />

        <Avatar className="relative size-9 ring-2 ring-background">
          <AvatarImage src={user.photoURL ?? undefined} alt={user.name} />

          <AvatarFallback className="bg-linear-to-br from-emerald-500 to-teal-700 text-xs font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* online dot */}
        <span
          aria-hidden
          className="absolute -bottom-0.5 -right-px flex size-3"
        >
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/60" />

          <span className="relative inline-flex size-3 rounded-full bg-emerald-400 ring-2 ring-background" />
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={14}
        className="w-72 overflow-hidden rounded-3xl border-border/60 bg-popover/95 p-1.5 shadow-2xl shadow-black/15 backdrop-blur-xl"
      >
        {/* profile header */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="block p-0 font-normal">
            <div className="relative overflow-hidden rounded-[1.25rem]">
              <div className="relative h-20 bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-700">
                <div className="absolute -right-6 -top-8 size-28 rounded-full bg-white/20 blur-2xl" />

                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] bg-size-[14px_14px] mask-[linear-gradient(to_bottom,black,transparent)]" />

                <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
                  <span className="size-1.5 rounded-full bg-amber-300" />
                  Reader
                </span>
              </div>

              <div className="bg-card/60 px-4 pb-4">
                <Avatar className="-mt-8 size-16 ring-4 ring-popover">
                  <AvatarImage src={user.photoURL ?? undefined} alt="" />

                  <AvatarFallback className="bg-linear-to-br from-emerald-500 to-teal-700 text-lg font-semibold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <p className="mt-2.5 truncate text-base font-semibold tracking-tight text-foreground">
                  {user.name}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1.5" />

        {/* quick links */}
        {LINKS.map((l, i) => (
          <MenuRow
            key={l.href}
            icon={l.icon}
            title={l.title}
            hint={l.hint}
            index={i}
            onClick={() => router.push(l.href)}
          />
        ))}

        <DropdownMenuSeparator className="my-1.5" />

        <MenuRow
          icon={LogOut}
          title="Logout"
          index={LINKS.length}
          danger
          onClick={onLogout}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
