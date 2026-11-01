import type { Metadata } from "next";
import { Suspense } from "react";

import AuthSkeleton from "@/components/auth/auth-skeleton";
import RegisterForm from "@/components/auth/register-form";

const description =
  "Create a free BookNook account to add books, borrow them for a few days and return them in a tap.";

export const metadata: Metadata = {
  title: "Register", // becomes "Register | BookNook" through the layout title template
  description,

  keywords: [
    "BookNook register",
    "join online library",
    "create library account",
    "free book borrowing",
  ],

  alternates: { canonical: "/register" },

  robots: { index: true, follow: true },

  openGraph: {
    title: "Register | BookNook",
    description,
    url: "/register",
    siteName: "BookNook",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Register | BookNook",
    description,
  },
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthSkeleton fields={4} rules />}>
      <RegisterForm />
    </Suspense>
  );
}
