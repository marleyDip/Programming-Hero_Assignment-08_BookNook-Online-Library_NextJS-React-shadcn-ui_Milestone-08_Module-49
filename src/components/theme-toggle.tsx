"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // Avoid a hydration mismatch: the real theme is only known on the client.
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const isDark = mounted && resolvedTheme === "dark";

  function toggle() {
    const next = isDark ? "light" : "dark";
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Smooth cross-fade between themes where the browser supports it
    if (!reduce && "startViewTransition" in document) {
      (
        document as Document & { startViewTransition: (cb: () => void) => void }
      ).startViewTransition(() => setTheme(next));
    } else {
      setTheme(next);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "group relative size-9 overflow-hidden rounded-full transition-all duration-300 hover:bg-foreground/6 active:scale-90",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute size-4.5 text-amber-500 transition-all duration-500 ease-out group-hover:rotate-45",
          isDark
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100",
        )}
      />

      <Moon
        className={cn(
          "absolute size-4.5 text-emerald-400 transition-all duration-500 ease-out group-hover:-rotate-12",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0",
        )}
      />
    </button>
  );
}
