"use client";

import { motion } from "framer-motion";
import {
  Check,
  ImageIcon,
  Info,
  Mail,
  MailCheck,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  ErrorBanner,
  Field,
  PasswordField,
  PasswordRules,
  SubmitButton,
} from "@/components/auth/field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { validatePassword } from "@/lib/auth-utils";
import { cn } from "@/lib/utils";

export type ProfileUser = {
  name: string;
  email: string;
  image?: string | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PanelHeader({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-7">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function Notice({
  icon: Icon,
  children,
}: {
  icon: typeof Info;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 text-sm text-sky-800 dark:text-sky-200">
      <Icon className="mt-0.5 size-4 shrink-0" />
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

// Profile
export function ProfileForm({ user }: { user: ProfileUser }) {
  const [name, setName] = useState(user.name);
  const [photo, setPhoto] = useState(user.image ?? "");
  const [errors, setErrors] = useState<{ name?: string; photo?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dirty =
    name.trim() !== user.name || photo.trim() !== (user.image ?? "");
  const previewOk = photo.trim() && isValidUrl(photo.trim());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const next: typeof errors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (photo.trim() && !isValidUrl(photo.trim()))
      next.photo = "Enter a full link starting with https://";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const { error } = await authClient.updateUser({
      name: name.trim(),
      image: photo.trim() || null,
    });
    setLoading(false);

    if (error) {
      const msg = error.message || "Could not update your profile.";
      setFormError(msg);
      toast.error(msg);
      return;
    }
    toast.success("Profile updated.");
  }

  return (
    <div>
      <PanelHeader
        title="Profile details"
        text="This is how you appear across BookNook."
      />

      {/* live preview */}
      <div className="mb-7 flex items-center gap-4 rounded-2xl border border-border/70 bg-muted/40 p-4">
        <Avatar className="size-16 ring-4 ring-background">
          <AvatarImage src={previewOk ? photo.trim() : undefined} alt="" />

          <AvatarFallback className="bg-linear-to-br from-emerald-500 to-teal-700 text-lg font-semibold text-white">
            {initials(name || user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate font-semibold">{name.trim() || "Your name"}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">
            Live preview
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <ErrorBanner message={formError} />
        <Field
          label="Full name"
          icon={User}
          autoComplete="name"
          value={name}
          error={errors.name}
          onChange={(e) => setName(e.target.value)}
        />
        <Field
          label="Photo URL"
          icon={ImageIcon}
          type="url"
          autoComplete="off"
          placeholder="https://example.com/your-photo.jpg"
          value={photo}
          error={errors.photo}
          onChange={(e) => setPhoto(e.target.value)}
        />
        <div
          className={cn(
            "transition-opacity",
            !dirty && "pointer-events-none opacity-50",
          )}
        >
          <SubmitButton loading={loading} loadingText="Saving">
            Save changes
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}

// Email
export function EmailForm({
  user,
  managedByGoogle,
}: {
  user: ProfileUser;
  managedByGoogle: boolean;
}) {
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const value = newEmail.trim().toLowerCase();
    if (!EMAIL_RE.test(value))
      return setError("Please enter a valid email address.");
    if (value === user.email.toLowerCase())
      return setError("That is already your email address.");
    setError(null);

    setLoading(true);
    const { error } = await authClient.changeEmail({
      newEmail: value,
      callbackURL: "/profile",
    });
    setLoading(false);

    if (error) {
      const msg = error.message || "Could not change your email.";
      setFormError(msg);
      toast.error(msg);
      return;
    }
    setNewEmail("");
    toast.success("Email updated.");
  }

  return (
    <div>
      <PanelHeader
        title="Email address"
        text="Use an email you can access. It is also how you log in."
      />

      <div className="mb-7 flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/40 p-4">
        <span className="grid size-11 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <MailCheck className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Current email
          </p>
          <p className="truncate font-semibold">{user.email}</p>
        </div>
      </div>

      {managedByGoogle ? (
        <Notice icon={Info}>
          You signed in with Google, so your email is managed by your Google
          account and can&apos;t be changed here.
        </Notice>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <ErrorBanner message={formError} />
          <Field
            label="New email"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="new-email@example.com"
            value={newEmail}
            error={error}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <SubmitButton loading={loading} loadingText="Updating">
            Update email
          </SubmitButton>
        </form>
      )}
    </div>
  );
}

// Security
export function SecurityForm({ hasPassword }: { hasPassword: boolean }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [revokeOthers, setRevokeOthers] = useState(true);
  const [errors, setErrors] = useState<{
    current?: string;
    next?: string;
    confirm?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const errs: typeof errors = {};
    if (!current) errs.current = "Enter your current password.";
    const pw = validatePassword(next);
    if (pw) errs.next = pw;
    else if (next === current)
      errs.next = "Your new password must be different from the current one.";
    if (confirm !== next) errs.confirm = "Passwords do not match.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    const { error } = await authClient.changePassword({
      currentPassword: current,
      newPassword: next,
      revokeOtherSessions: revokeOthers,
    });
    setLoading(false);

    if (error) {
      const msg = error.message || "Could not change your password.";
      setFormError(msg);
      toast.error(msg);
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    toast.success("Password changed successfully.");
  }

  return (
    <div>
      <PanelHeader
        title="Password & security"
        text="Keep your account safe with a strong, unique password."
      />

      {!hasPassword ? (
        <Notice icon={ShieldCheck}>
          You signed in with Google, so you don&apos;t have a BookNook password.
          Your account is secured by Google.
        </Notice>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <ErrorBanner message={formError} />

          <PasswordField
            label="Current password"
            autoComplete="current-password"
            value={current}
            error={errors.current}
            onChange={(e) => setCurrent(e.target.value)}
          />

          <PasswordField
            label="New password"
            autoComplete="new-password"
            value={next}
            error={errors.next}
            onChange={(e) => setNext(e.target.value)}
          />

          <PasswordRules password={next} />

          <PasswordField
            label="Confirm new password"
            autoComplete="new-password"
            value={confirm}
            error={errors.confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <label className="flex cursor-pointer items-start gap-3 rounded-xl p-1">
            <input
              type="checkbox"
              checked={revokeOthers}
              onChange={(e) => setRevokeOthers(e.target.checked)}
              className="peer sr-only"
            />

            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border border-border bg-background text-white transition-all duration-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 peer-focus-visible:ring-4 peer-focus-visible:ring-emerald-500/20 [&>svg]:scale-0 peer-checked:[&>svg]:scale-100">
              <Check
                className="size-3.5 transition-transform duration-200"
                strokeWidth={3.5}
              />
            </span>

            <span className="text-sm leading-snug">
              Sign out of my other devices
              <span className="block text-xs text-muted-foreground">
                Recommended after changing your password.
              </span>
            </span>
          </label>

          <motion.div whileTap={{ scale: 0.99 }} className="pt-1">
            <SubmitButton loading={loading} loadingText="Updating">
              Change password
            </SubmitButton>
          </motion.div>
        </form>
      )}
    </div>
  );
}
