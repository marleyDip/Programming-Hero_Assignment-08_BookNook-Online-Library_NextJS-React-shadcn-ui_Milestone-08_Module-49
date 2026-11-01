"use client";

/** inputs, password rules, buttons */

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  type LucideIcon,
} from "lucide-react";

import { useId, useState } from "react";
import { FcGoogle } from "react-icons/fc";

import { PASSWORD_RULES } from "@/lib/auth-utils";
import { cn } from "@/lib/utils";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: LucideIcon;
  error?: string | null;
  labelAction?: React.ReactNode;
  right?: React.ReactNode;
};

export function Field({
  label,
  icon: Icon,
  error,
  labelAction,
  right,
  className,
  id,
  ...props
}: FieldProps) {
  const autoId = useId();
  const fid = id ?? autoId;

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={fid} className="text-sm font-medium">
          {label}
        </label>
        {labelAction}
      </div>

      <div
        className={cn(
          "group flex h-12 items-center gap-3 rounded-xl border bg-background/60 px-4 transition-all duration-300 focus-within:ring-4",
          error
            ? "border-rose-500/70 focus-within:border-rose-500 focus-within:ring-rose-500/15"
            : "border-border hover:border-emerald-500/40 focus-within:border-emerald-500 focus-within:ring-emerald-500/15",
        )}
      >
        <Icon className="size-4.5 shrink-0 text-muted-foreground transition-colors duration-300 group-focus-within:text-emerald-500" />
        <input
          id={fid}
          aria-invalid={!!error}
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          {...props}
        />
        {right}
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-1.5 text-xs text-rose-600 dark:text-rose-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PasswordField({
  label = "Password",
  ...props
}: Omit<FieldProps, "icon" | "type" | "right" | "label"> & { label?: string }) {
  const [show, setShow] = useState(false);

  return (
    <Field
      {...props}
      label={label}
      icon={Lock}
      type={show ? "text" : "password"}
      right={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-emerald-500/60"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
    />
  );
}

/** Live checklist & strength bar for the password rules */
export function PasswordRules({ password }: { password: string }) {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const total = PASSWORD_RULES.length;

  return (
    <div className="rounded-xl border border-border/70 bg-muted/40 p-3.5">
      <div className="flex gap-1.5" aria-hidden>
        {PASSWORD_RULES.map((r, i) => (
          <span
            key={r.id}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-500",
              i < passed
                ? passed === total
                  ? "bg-emerald-500"
                  : "bg-amber-400"
                : "bg-border",
            )}
          />
        ))}
      </div>

      <ul className="mt-3 grid gap-1.5 sm:grid-cols-3">
        {PASSWORD_RULES.map((r) => {
          const ok = r.test(password);

          return (
            <li
              key={r.id}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors duration-300",
                ok
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "grid size-4 place-items-center rounded-full border transition-all duration-300",
                  ok
                    ? "scale-110 border-emerald-500 bg-emerald-500 text-white"
                    : "border-border",
                )}
              >
                {ok && <Check className="size-2.5" strokeWidth={4} />}
              </span>
              {r.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ErrorBanner({ message }: { message?: string | null }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          className="overflow-hidden"
        >
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SubmitButton({
  loading,
  children,
  loadingText = "Please wait",
}: {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 text-base font-semibold text-white shadow-lg shadow-emerald-900/25 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-700/30 focus-visible:ring-4 focus-visible:ring-emerald-500/30 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0"
    >
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </span>

      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </button>
  );
}

export function GoogleButton({
  onClick,
  loading,
  label = "Continue with Google",
}: {
  onClick: () => void;
  loading: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="group flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background/60 text-sm font-medium outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-muted/60 hover:shadow-md focus-visible:ring-4 focus-visible:ring-emerald-500/20 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <FcGoogle className="size-5 transition-transform duration-300 group-hover:scale-110" />
      )}
      {label}
    </button>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      or
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
