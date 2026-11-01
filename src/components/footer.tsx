"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  Heart,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import { Logo } from "@/components/navbar";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { useSyncExternalStore } from "react";

// Edit your content here
const CONTACT = {
  email: "hello@booknook.com",
  phone: "+880 1600 000000",
  address: "Dhaka, Bangladesh",
};

const DEVELOPER = {
  name: "Md Sofian Hasan",
  href: "https://marleydip.netlify.app/",
};

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/", icon: FaGithub },
  { label: "Facebook", href: "https://facebook.com/", icon: FaFacebookF },
  { label: "X (Twitter)", href: "https://x.com/", icon: FaXTwitter },
  { label: "LinkedIn", href: "https://linkedin.com/", icon: FaLinkedinIn },
  { label: "Instagram", href: "https://instagram.com/", icon: FaInstagram },
];

const COLUMNS = [
  {
    title: "Explore",

    links: [
      { label: "Home", href: "/" },
      { label: "All Books", href: "/books" },
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
  {
    title: "Support",

    links: [
      { label: "About BookNook", href: "/about" },
      { label: "How it works", href: "/how-it-works" },
      { label: "FAQ", href: "/faq" },
      { label: "Help center", href: "/help" },
    ],
  },
  {
    title: "Legal",

    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

// Small pieces
function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-emerald-500/60"
    >
      <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-linear-to-r after:from-emerald-500 after:to-teal-500 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
        {children}
      </span>

      <ArrowUpRight className="size-3.5 -translate-x-1 text-emerald-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  );
}

function ContactRow({
  icon: Icon,
  label,
  href,
}: {
  icon: typeof Mail;
  label: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-border/60 bg-card/70 text-emerald-600 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 dark:text-emerald-400">
        <Icon className="size-4" />
      </span>

      <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
        {label}
      </span>
    </>
  );

  const cls =
    "group flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60";
  return href ? (
    <a href={href} className={cls}>
      {content}
    </a>
  ) : (
    <div className={cls}>{content}</div>
  );
}

// Current year without an effect (avoids setState-in-effect and keeps
// new Date() out of the server prerender
const subscribeNoop = () => () => {};
const getClientYear = () => new Date().getFullYear();
const getServerYear = () => null;

// Footer
export default function Footer() {
  const reduce = useReducedMotion();

  // null on the server / during hydration, real year on the client
  const year = useSyncExternalStore(
    subscribeNoop,
    getClientYear,
    getServerYear,
  );

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },

    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border/60 bg-card/40 backdrop-blur-sm">
      {/* glowing top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/70 to-transparent" />

      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[60%] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6"
      >
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <motion.div variants={item} className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A community library where readers discover great books, share
              their own titles, and borrow from each other. Add a book, borrow a
              book, return a book.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="group grid size-10 place-items-center rounded-full border border-border/70 bg-card/70 text-muted-foreground outline-none transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-linear-to-br hover:from-emerald-500 hover:to-teal-700 hover:text-white hover:shadow-lg hover:shadow-emerald-700/30 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:translate-y-0 active:scale-90"
                >
                  <Icon className="size-4 transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5">
            {COLUMNS.map((col) => (
              <motion.div key={col.title} variants={item}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                  {col.title}
                </h3>

                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <FooterLink href={l.href}>{l.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <motion.div variants={item} className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
              Contact
            </h3>

            <div className="mt-5 space-y-3.5">
              <ContactRow
                icon={Mail}
                label={CONTACT.email}
                href={`mailto:${CONTACT.email}`}
              />

              <ContactRow
                icon={Phone}
                label={CONTACT.phone}
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              />

              <ContactRow icon={MapPin} label={CONTACT.address} />
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          variants={item}
          className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row"
        >
          {/* <p>© {new Date().getFullYear()} BookNook. All rights reserved.</p> */}

          <p>
            ©{" "}
            <span className="inline-block min-w-[4ch] tabular-nums">
              {year ?? ""}
            </span>{" "}
            BookNook. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5">
            Crafted with
            <Heart className="size-3.5 fill-rose-500 text-rose-500 transition-transform duration-300 hover:scale-125" />
            by
            <a
              href={DEVELOPER.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
            >
              {DEVELOPER.name}
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-100 bg-linear-to-r from-emerald-500 to-teal-500 transition-transform duration-300 group-hover:scale-x-0" />
            </a>
          </p>

          <button
            type="button"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
            }
            className={cn(
              "group inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-xs font-medium text-foreground outline-none transition-all duration-300",
              "hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-emerald-500/10 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95",
            )}
          >
            Back to top
            <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      </motion.div>

      {/* oversized faded wordmark */}
      <div
        aria-hidden
        className="pointer-events-none mb-[-0.18em] select-none text-center text-[19vw] font-bold leading-none tracking-tighter text-transparent sm:text-[11rem]"
      >
        <span className="bg-linear-to-b from-emerald-500/25 via-emerald-500/5 to-transparent bg-clip-text">
          BookNook
        </span>
      </div>
    </footer>
  );
}
