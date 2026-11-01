import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
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

export const metadata: Metadata = {
  title: {
    default: "BookNook — Read, borrow, discover",
    template: "%s | BookNook",
  },
  description:
    "BookNook is a community library where readers discover books, add their own titles and borrow from each other.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="relative isolate flex min-h-full flex-col bg-background text-foreground"
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* ambient glow div stays here */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -left-32 -top-40 h-120 w-120 rounded-full bg-emerald-400/25 blur-3xl dark:bg-emerald-500/15" />

            <div className="absolute -top-24 right-0 h-105 w-105 rounded-full bg-teal-300/25 blur-3xl dark:bg-teal-500/10" />

            <div className="absolute bottom-0 left-1/2 h-90 w-150 -translate-x-1/2 rounded-full bg-amber-200/20 blur-3xl dark:bg-amber-400/5" />
          </div>

          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

// export default function RootLayout({ children }: LayoutProps<"/">) {
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
