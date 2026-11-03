"use client";

/**
 * Use on the book details page:  <BorrowButton bookId={book._id} />
 * Logged-out visitors are sent to /login and returned to this page afterwards.
 */

import { BookMarked, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { borrowBookAction } from "@/lib/actions";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function BorrowButton({
  bookId,
  className,
}: {
  bookId: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  async function onBorrow() {
    if (!session) {
      toast.info("Please log in to borrow this book.", {
        id: "login-required",
      });

      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    setLoading(true);
    try {
      const res = await borrowBookAction(bookId); // user comes from the server session
      if (res.ok) toast.success(res.message);
      else toast.error(res.error);
    } catch {
      toast.error("Could not borrow this book. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onBorrow}
      disabled={isPending || loading}
      data-book-id={bookId}
      className={cn(
        "group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-linear-to-br from-emerald-500 to-teal-700 px-8 text-base font-semibold text-white shadow-lg shadow-emerald-900/25 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-emerald-500/30 active:translate-y-0 active:scale-95 disabled:opacity-70",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <BookMarked className="size-4" />
      )}
      {loading ? "Borrowing" : "Borrow this book"}

      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </button>
  );
}
