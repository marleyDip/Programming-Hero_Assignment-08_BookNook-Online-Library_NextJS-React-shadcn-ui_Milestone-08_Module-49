/** private route, already guarded by proxy.ts */

import ProfileView from "@/components/profile/profile-view";
import { getDashboardStats } from "@/lib/dashboard-stats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your BookNook profile, email address and password.",
  robots: { index: false, follow: false }, // private page
};

export default async function ProfilePage() {
  const dashboardStats = await getDashboardStats();

  return <ProfileView dashboardStats={dashboardStats} />;
}
