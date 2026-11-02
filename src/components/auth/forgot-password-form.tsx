"use client";

import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import AuthShell from "@/components/auth/auth-shell";
import { ErrorBanner, Field, SubmitButton } from "@/components/auth/field";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.SubmitEvent<HTMLElement>) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // (older Better Auth versions call this authClient.forgetPassword)
    const { error } = await authClient.requestPasswordReset({
      email: email.trim(),
      redirectTo: "/reset-password",
    });
    setLoading(false);

    if (error) {
      const msg =
        error.message || "Could not send the reset link. Please try again.";
      setError(msg);
      toast.error(msg);
      return;
    }
    setSent(true);
    toast.success("Reset link sent. Check your inbox.");
  }

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a link to set a new one."
      panelTitle="No worries, it happens."
      panelText="Reset your password in a minute and get back to your books."
      footer={
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400"
        >
          <ArrowLeft className="size-4" /> Back to login
        </Link>
      }
    >
      {sent ? (
        <div
          className="flex flex-col items-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center"
          role="status"
        >
          <span className="grid size-14 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-600/30">
            <MailCheck className="size-7" />
          </span>
          <p className="mt-4 text-lg font-semibold">Check your inbox</p>
          <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
            If an account exists for {email.trim()}, a reset link is on its way.
          </p>
        </div>
      ) : (
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
          <SubmitButton loading={loading} loadingText="Sending link">
            Send reset link
          </SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}
