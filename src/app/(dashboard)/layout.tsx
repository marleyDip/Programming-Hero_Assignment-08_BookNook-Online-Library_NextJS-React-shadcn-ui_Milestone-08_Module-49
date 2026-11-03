/**
 *  The "(dashboard)" folder does not change the URLs: they stay /add-book, /my-books, /my-borrows. */

import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
