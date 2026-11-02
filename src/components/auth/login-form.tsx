"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import AuthShell from "@/components/auth/auth-shell";
import {
  ErrorBanner,
  Field,
  GoogleButton,
  OrDivider,
  PasswordField,
  SubmitButton,
} from "@/components/auth/field";
import { authClient } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/auth-utils";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const rawCallback = params.get("callbackUrl");
  const callbackUrl = safeRedirect(rawCallback);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // After registering we land here with ?registered=1
  const justRegistered = params.get("registered") === "1";

  useEffect(() => {
    if (justRegistered)
      toast.success("Account created! Please log in.", { id: "registered" });
  }, [justRegistered]);

  // Visitor was sent here from a private page or the Borrow button
  const wasRedirected = Boolean(rawCallback);

  useEffect(() => {
    if (wasRedirected && !justRegistered)
      toast.info("Please log in to continue.", { id: "login-required" });
  }, [wasRedirected, justRegistered]);

  async function onSubmit(e: React.SubmitEvent<HTMLElement>) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { error } = await authClient.signIn.email({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      const msg = error.message || "Invalid email or password.";
      setError(msg);
      toast.error(msg);
      return;
    }

    toast.success("Welcome back!");
    router.push(callbackUrl);
    router.refresh();
  }

  async function onGoogle() {
    setError(null);
    setGoogleLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackUrl,
    });

    if (error) {
      setGoogleLoading(false);
      const msg = error.message || "Google sign-in failed. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  }

  const registerHref = rawCallback
    ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/register";

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to borrow books, track your borrows and share your own."
      panelTitle="Your next great read is waiting."
      panelText="Pick up right where you left off. Your shelf, your borrows and your community are one login away."
      footer={
        <>
          New to BookNook?{" "}
          <Link
            href={registerHref}
            className="font-semibold text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <ErrorBanner message={error} />

        <Field
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordField
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          labelAction={
            <Link
              href="/forgot-password"
              className="rounded text-xs font-medium text-emerald-600 outline-none underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:text-emerald-400"
            >
              Forgot password?
            </Link>
          }
        />

        <SubmitButton loading={loading} loadingText="Logging in">
          Login
        </SubmitButton>
      </form>

      <div className="mt-6 space-y-6">
        <OrDivider />
        <GoogleButton onClick={onGoogle} loading={googleLoading} />
      </div>
    </AuthShell>
  );
}
