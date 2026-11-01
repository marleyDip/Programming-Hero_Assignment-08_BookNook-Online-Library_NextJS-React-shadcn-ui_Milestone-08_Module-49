/** Place at: src/app/(auth)/login/page.tsx */
import type { Metadata } from "next";
import { Suspense } from "react";

import AuthSkeleton from "@/components/auth/auth-skeleton";
import LoginForm from "@/components/auth/login-form";

const description =
  "Log in to BookNook to borrow books, track your borrows and share your own titles with the community.";

export const metadata: Metadata = {
  title: "Login", // becomes "Login | BookNook" through the layout title template
  description,
  keywords: [
    "BookNook login",
    "online library login",
    "borrow books online",
    "book sharing community",
  ],
  alternates: { canonical: "/login" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Login | BookNook",
    description,
    url: "/login",
    siteName: "BookNook",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Login | BookNook",
    description,
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthSkeleton fields={2} />}>
      <LoginForm />
    </Suspense>
  );
}
