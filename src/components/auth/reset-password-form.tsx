"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import AuthShell from "@/components/auth/auth-shell";
import {
  ErrorBanner,
  PasswordField,
  PasswordRules,
  SubmitButton,
} from "@/components/auth/field";
import { authClient } from "@/lib/auth-client";
import { validatePassword } from "@/lib/auth-utils";

export default function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token");

  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const pwError = validatePassword(password);
    setFieldError(pwError);
    if (pwError) return;

    setLoading(true);
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token: token ?? "",
    });
    setLoading(false);

    if (error) {
      const msg = error.message || "This reset link is invalid or has expired.";
      setError(msg);
      toast.error(msg);
      return;
    }
    toast.success("Password updated. Please log in.");
    router.push("/login");
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before."
      panelTitle="Almost back in."
      panelText="Create a new password and jump right back to your shelf."
      footer={
        <Link
          href="/login"
          className="font-semibold text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400"
        >
          Back to login
        </Link>
      }
    >
      {!token ? (
        <ErrorBanner message="This reset link is missing or invalid. Please request a new one." />
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <ErrorBanner message={error} />
          <PasswordField
            label="New password"
            autoComplete="new-password"
            placeholder="Create a new password"
            value={password}
            error={fieldError}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordRules password={password} />
          <div className="pt-1">
            <SubmitButton loading={loading} loadingText="Updating">
              Update password
            </SubmitButton>
          </div>
        </form>
      )}
    </AuthShell>
  );
}
