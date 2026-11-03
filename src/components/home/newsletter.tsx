"use client";

/**
 * Newsletter section
 * Posts to POST {NEXT_PUBLIC_API_URL}/api/newsletter. Without that env var it
 * simulates a successful signup so you can test the design.
 */

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  Loader2,
  Mail,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PERKS = [
  "New arrivals, delivered every week",
  "Hand-picked reading lists",
  "No spam. Unsubscribe anytime",
];

type Status = "idle" | "loading" | "success" | "error";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(0);

  // const isLoading = status === "loading";
  // const isSuccess = status === "success";

  function fail(msg: string) {
    setStatus("error");
    setMessage(msg);

    setShake((n) => n + 1);
    toast.error(msg);
  }

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const value = email.trim().toLowerCase();

    if (!EMAIL_RE.test(value))
      return fail("Please enter a valid email address.");

    if (!API_URL) {
      return fail("Newsletter service is currently unavailable.");
    }

    setStatus("loading");
    setMessage("");

    try {
      /* if (API_URL) {
        const res = await fetch(`${API_URL}/api/newsletter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: value }),
        });

        const data = await res.json().catch(() => ({}));

        if (res.status === 409) {
          setStatus("success");
          setMessage("You're already on the list. Thanks for being here!");
          toast.info("You're already subscribed", {
            description: "Thanks for being part of BookNook.",
          });
          return;
        }

        if (!res.ok)
          return fail(
            data.message || "Something went wrong. Please try again.",
          );
      } else {
        await new Promise((r) => setTimeout(r, 900)); // dummy mode
      } */

      const res = await fetch(`${API_URL}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });

      const data = await res.json().catch(() => ({}));

      // Duplicate email
      if (res.status === 409) {
        setStatus("success");
        setMessage("You're already on the list. Thanks for being here!");

        toast.info("You're already subscribed", {
          description: "Thanks for being part of BookNook.",
        });

        return; // IMPORTANT: stop here
      }

      // Other errors
      if (!res.ok) {
        return fail(data.message || "Something went wrong. Please try again.");
      }

      // Only a new subscription reaches here
      setStatus("success");
      setMessage("Check your inbox soon for your first fresh reads.");

      toast.success("Subscribed successfully!", {
        description: "Fresh reads are on their way to your inbox.",
      });
    } catch (error) {
      console.error("Newsletter error:", error);

      fail("Couldn't reach the server. Please try again.");
    }
  }

  function reset() {
    setEmail("");
    setStatus("idle");
    setMessage("");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6">
      <div className="relative isolate overflow-hidden rounded-4xl bg-linear-to-br from-emerald-950 via-[#0b3b32] to-teal-800 px-6 py-14 shadow-2xl shadow-emerald-950/25 sm:px-12 lg:px-16 lg:py-20">
        {/* decoration */}
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 size-105 rounded-full bg-emerald-400/25 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 size-95 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-linear(rgba(255,255,255,0.09)_1px,transparent_1px)] bg-size-[24px_24px] mask-[linear-linear(to_bottom,black,transparent_90%)]" />

        <motion.span
          aria-hidden
          className="absolute right-[44%] top-10 hidden text-emerald-200/30 lg:block"
          animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <BookOpen className="size-12" />
        </motion.span>

        <motion.span
          aria-hidden
          className="absolute bottom-12 left-[46%] hidden text-amber-200/30 lg:block"
          animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="size-9" />
        </motion.span>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-emerald-300 backdrop-blur-md">
              <Mail className="size-3.5" />
              Newsletter
            </span>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Fresh reads, straight to your inbox
            </h2>

            <p className="mt-4 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
              Join our readers and get a short weekly note with the newest
              books, community picks and what&apos;s worth borrowing next.
            </p>

            <ul className="mt-8 space-y-3">
              {PERKS.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="flex items-center gap-3 text-sm text-white/85 sm:text-base"
                >
                  <span className="grid size-6 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  {p}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* form card */}
          <div className="relative rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center py-6 text-center"
                  role="status"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 15,
                      delay: 0.1,
                    }}
                    className="grid size-16 place-items-center rounded-full bg-white text-emerald-700 shadow-xl"
                  >
                    <Check className="size-8" strokeWidth={3} />
                  </motion.div>

                  <p className="mt-5 text-xl font-semibold text-white">
                    You&apos;re on the list!
                  </p>

                  <p className="mt-1.5 max-w-xs text-sm text-white/70">
                    {message}
                  </p>

                  <button
                    type="button"
                    onClick={reset}
                    className="mt-6 rounded-full px-3 py-1.5 text-sm text-white/70 underline-offset-4 outline-none transition-colors hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    Use a different email
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <label
                    htmlFor="newsletter-email"
                    className="text-sm font-medium text-white"
                  >
                    Your email address
                  </label>

                  <motion.div
                    key={shake}
                    animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
                    transition={{ duration: 0.4 }}
                    className={cn(
                      "mt-3 flex items-center gap-2 rounded-full border bg-white/10 p-1.5 pl-4 transition-all duration-300 focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-emerald-300/60",
                      status === "error"
                        ? "border-rose-300/70"
                        : "border-white/20",
                    )}
                  >
                    <Mail className="size-4 shrink-0 text-white/60" />

                    <input
                      id="newsletter-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      disabled={status === "loading"}
                      aria-invalid={status === "error"}
                      aria-describedby="newsletter-msg"
                      className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white placeholder:text-white/40 focus:outline-none sm:text-base"
                    />

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="group relative inline-flex h-11 shrink-0 items-center gap-2 overflow-hidden rounded-full bg-white px-5 text-sm font-semibold text-emerald-950 shadow-lg outline-none transition-all duration-300 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-white/80 active:scale-95 disabled:opacity-80 disabled:hover:scale-100"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Joining
                        </>
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </motion.div>

                  <p
                    id="newsletter-msg"
                    className="mt-3 min-h-5 text-sm text-white/50"
                  >
                    We respect your inbox. One email a week, at most.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
