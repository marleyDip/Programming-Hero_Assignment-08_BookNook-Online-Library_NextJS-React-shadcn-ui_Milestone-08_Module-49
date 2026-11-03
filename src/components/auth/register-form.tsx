"use client";

import { Image as ImageIcon, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import AuthShell from "@/components/auth/auth-shell";
import {
  ErrorBanner,
  Field,
  GoogleButton,
  OrDivider,
  PasswordField,
  PasswordRules,
  SubmitButton,
} from "@/components/auth/field";
import { authClient } from "@/lib/auth-client";
import { safeRedirect, validatePassword } from "@/lib/auth-utils";

type Errors = Partial<Record<"name" | "email" | "photo" | "password", string>>;

function isValidUrl(value: string) {
  try {
    const u = new URL(value);

    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const rawCallback = params.get("callbackUrl");
  const callbackUrl = safeRedirect(rawCallback);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const next: Errors = {};
    if (!name.trim()) next.name = "Please enter your name.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Please enter a valid email address.";

    if (photo.trim() && !isValidUrl(photo.trim()))
      next.photo = "Enter a full link starting with https://";
    const pwError = validatePassword(password);
    if (pwError) next.password = pwError;

    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error(next.password ?? "Please fix the highlighted fields.");
      return; // invalid password (or any field) => no registration
    }

    setLoading(true);

    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      image: photo.trim() || undefined,
    });
    setLoading(false);

    if (error) {
      const msg =
        error.message || "Could not create your account. Please try again.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    // Registered successfully -> send them to Login (keeping their desired page)
    const q = new URLSearchParams({ registered: "1" });
    if (rawCallback) q.set("callbackUrl", callbackUrl);
    router.push(`/login?${q.toString()}`);
  }

  async function onGoogle() {
    setFormError(null);

    setGoogleLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackUrl,
    });

    if (error) {
      setGoogleLoading(false);
      const msg = error.message || "Google sign-in failed. Please try again.";
      setFormError(msg);
      toast.error(msg);
    }
  }

  const loginHref = rawCallback
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login";

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join BookNook to add books, borrow them and return them in a tap."
      panelTitle="Add a book, borrow a book, return a book."
      panelText="Join a community of readers who keep great stories moving from hand to hand."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={loginHref}
            className="font-semibold text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400"
          >
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <ErrorBanner message={formError} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Name"
            icon={User}
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            error={errors.name}
            onChange={(e) => setName(e.target.value)}
          />

          <Field
            label="Email"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            error={errors.email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

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

        <PasswordField
          autoComplete="new-password"
          placeholder="Create a password"
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordRules password={password} />

        <div className="pt-1">
          <SubmitButton loading={loading} loadingText="Creating account">
            Register
          </SubmitButton>
        </div>
      </form>

      <div className="mt-6 space-y-6">
        <OrDivider />
        <GoogleButton
          onClick={onGoogle}
          loading={googleLoading}
          label="Sign up with Google"
        />
      </div>
    </AuthShell>
  );
}
