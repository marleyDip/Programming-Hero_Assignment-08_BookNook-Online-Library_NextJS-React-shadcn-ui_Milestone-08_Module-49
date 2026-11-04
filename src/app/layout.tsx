import {
  CircleCheck,
  CircleX,
  Info,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import { Toaster } from "sonner";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import SplashScreen from "@/components/splash-screen";
import { ThemeProvider } from "@/components/theme-provider";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* export const metadata: Metadata = {
  title: {
    default: "BookNook — Read, borrow, discover",
    template: "%s | BookNook",
  },
  description:
    "BookNook is a community library where readers discover books, add their own titles and borrow from each other.",
}; */

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),

  title: {
    default: "BookNook - Read, borrow, discover",
    template: "%s | BookNook",
  },

  description:
    "BookNook is a community library where readers discover books, add their own titles and borrow from each other.",

  applicationName: "BookNook",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="relative isolate flex min-h-full flex-col bg-background text-foreground"
      >
        <SplashScreen />

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* ambient glow div stays here */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -left-32 -top-40 h-120 w-120 rounded-full bg-emerald-400/25 blur-3xl dark:bg-emerald-500/15" />

            <div className="absolute -top-24 right-0 h-105 w-105 rounded-full bg-teal-300/25 blur-3xl dark:bg-teal-500/10" />

            <div className="absolute bottom-0 left-1/2 h-90 w-150 -translate-x-1/2 rounded-full bg-amber-200/20 blur-3xl dark:bg-amber-400/5" />
          </div>

          {/* Navbar */}
          <Navbar />

          {/* <Suspense fallback={<div className="h-18" />}>
            <Navbar />
          </Suspense> */}

          <main className="flex-1">{children}</main>

          <Footer />

          {/* Sonner Toaster */}
          <Toaster
            theme="dark"
            position="bottom-right"
            closeButton
            gap={12}
            icons={{
              loading: (
                <LoaderCircle
                  size={18}
                  className="animate-spin text-violet-300"
                />
              ),

              success: <CircleCheck size={18} className="text-emerald-300" />,

              error: <CircleX size={18} className="text-red-300" />,

              warning: <TriangleAlert size={18} className="text-amber-300" />,

              info: <Info size={18} className="text-sky-300" />,
            }}
            toastOptions={{
              classNames: {
                toast:
                  "group relative overflow-hidden !border !text-[#f5f6f2] !backdrop-blur-2xl !shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_48px_rgba(0,0,0,0.5)] before:absolute before:inset-y-0 before:left-0 before:w-1",

                default:
                  "!border-white/10 !bg-linear-to-br !from-[#14111f]/95 !to-[#0b0c0e]/95 before:bg-white/30",

                loading:
                  "!border-violet-400/25 !bg-linear-to-br !from-violet-950/90 !to-[#0b0c0e]/95 before:animate-pulse before:bg-violet-400 !shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_48px_rgba(0,0,0,0.5),0_0_30px_rgba(139,92,246,0.2)] [&_[data-title]]:!text-violet-100 [&_[data-description]]:!text-violet-200/70 [&_[data-icon]]:!border-violet-400/20 [&_[data-icon]]:!bg-violet-400/10",

                success:
                  "!border-emerald-400/25 !bg-linear-to-br !from-emerald-950/90 !to-[#0b0c0e]/95 before:bg-emerald-400 [&_[data-title]]:!text-emerald-100 [&_[data-description]]:!text-emerald-200/70 [&_[data-icon]]:!border-emerald-400/20 [&_[data-icon]]:!bg-emerald-400/10 [&_[data-close-button]]:!border-emerald-400/30 [&_[data-close-button]]:!bg-emerald-400/10 [&_[data-close-button]]:!text-emerald-200 [&_[data-close-button]:hover]:!bg-emerald-400/25 [&_[data-close-button]:hover]:!text-white [&_[data-button]:not([data-cancel])]:!bg-emerald-400 [&_[data-button]:not([data-cancel])]:!text-emerald-950 [&_[data-button]:not([data-cancel])]:!shadow-[0_4px_14px_rgba(52,211,153,0.25)] [&_[data-button]:not([data-cancel]):hover]:!bg-emerald-300 [&_[data-cancel]]:!border-emerald-400/20 [&_[data-cancel]]:!bg-emerald-400/5 [&_[data-cancel]]:!text-emerald-200 [&_[data-cancel]:hover]:!bg-emerald-400/15",

                error:
                  "!border-red-400/25 !bg-linear-to-br !from-red-950/90 !to-[#0b0c0e]/95 before:bg-red-400 [&_[data-title]]:!text-red-100 [&_[data-description]]:!text-red-200/70 [&_[data-icon]]:!border-red-400/20 [&_[data-icon]]:!bg-red-400/10 [&_[data-close-button]]:!border-red-400/30 [&_[data-close-button]]:!bg-red-400/10 [&_[data-close-button]]:!text-red-200 [&_[data-close-button]:hover]:!bg-red-400/25 [&_[data-close-button]:hover]:!text-white [&_[data-button]:not([data-cancel])]:!bg-red-400 [&_[data-button]:not([data-cancel])]:!text-red-950 [&_[data-button]:not([data-cancel])]:!shadow-[0_4px_14px_rgba(248,113,113,0.25)] [&_[data-button]:not([data-cancel]):hover]:!bg-red-300 [&_[data-cancel]]:!border-red-400/20 [&_[data-cancel]]:!bg-red-400/5 [&_[data-cancel]]:!text-red-200 [&_[data-cancel]:hover]:!bg-red-400/15",

                warning:
                  "!border-amber-400/25 !bg-linear-to-br !from-amber-950/90 !to-[#0b0c0e]/95 before:bg-amber-400 [&_[data-title]]:!text-amber-100 [&_[data-description]]:!text-amber-200/70 [&_[data-icon]]:!border-amber-400/20 [&_[data-icon]]:!bg-amber-400/10 [&_[data-close-button]]:!border-amber-400/30 [&_[data-close-button]]:!bg-amber-400/10 [&_[data-close-button]]:!text-amber-200 [&_[data-close-button]:hover]:!bg-amber-400/25 [&_[data-close-button]:hover]:!text-white [&_[data-button]:not([data-cancel])]:!bg-amber-400 [&_[data-button]:not([data-cancel])]:!text-amber-950 [&_[data-button]:not([data-cancel])]:!shadow-[0_4px_14px_rgba(251,191,36,0.25)] [&_[data-button]:not([data-cancel]):hover]:!bg-amber-300 [&_[data-cancel]]:!border-amber-400/20 [&_[data-cancel]]:!bg-amber-400/5 [&_[data-cancel]]:!text-amber-200 [&_[data-cancel]:hover]:!bg-amber-400/15",

                info: "!border-sky-400/25 !bg-linear-to-br !from-sky-950/90 !to-[#0b0c0e]/95 before:bg-sky-400 [&_[data-title]]:!text-sky-100 [&_[data-description]]:!text-sky-200/70 [&_[data-icon]]:!border-sky-400/20 [&_[data-icon]]:!bg-sky-400/10 [&_[data-close-button]]:!border-sky-400/30 [&_[data-close-button]]:!bg-sky-400/10 [&_[data-close-button]]:!text-sky-200 [&_[data-close-button]:hover]:!bg-sky-400/25 [&_[data-close-button]:hover]:!text-white [&_[data-button]:not([data-cancel])]:!bg-sky-400 [&_[data-button]:not([data-cancel])]:!text-sky-950 [&_[data-button]:not([data-cancel])]:!shadow-[0_4px_14px_rgba(56,189,248,0.25)] [&_[data-button]:not([data-cancel]):hover]:!bg-sky-300 [&_[data-cancel]]:!border-sky-400/20 [&_[data-cancel]]:!bg-sky-400/5 [&_[data-cancel]]:!text-sky-200 [&_[data-cancel]:hover]:!bg-sky-400/15",

                icon: "!mr-1 !grid !size-9 !place-content-center !place-items-center !rounded-xl !border !border-white/10 !bg-white/5",

                title: "!text-sm !font-semibold !tracking-tight",

                description: "!text-xs !leading-5 !text-[#9da6a1]",

                closeButton:
                  "!left-auto !right-2 !top-2 !size-6 !transform-none !rounded-full !border !border-white/15 !bg-white/5 !text-slate-300 !opacity-100 !backdrop-blur-md !transition-all !duration-200 hover:!scale-110 hover:!border-white/30 hover:!bg-white/10 hover:!text-white active:!scale-95",

                actionButton:
                  "!h-8 !rounded-lg !bg-[#ccff00] !px-3 !text-xs !font-semibold !text-[#0b0c0e] !shadow-[0_4px_14px_rgba(204,255,0,0.18)] !transition-all !duration-200 hover:!-translate-y-0.5 hover:!bg-[#d9ff4d] active:!translate-y-0 active:!scale-95",

                cancelButton:
                  "!h-8 !rounded-lg !border !border-white/10 !bg-white/5 !px-3 !text-xs !font-medium !text-slate-300 !transition-all !duration-200 hover:!bg-white/10 hover:!text-white active:!scale-95",
              },

              style: {
                borderRadius: "18px",
                padding: "14px 40px 14px 18px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html
//       lang="en"
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <body className="flex min-h-full flex-col">
//         <Navbar />

//         <main className="">{children}</main>
//       </body>
//     </html>
//   );
// }
