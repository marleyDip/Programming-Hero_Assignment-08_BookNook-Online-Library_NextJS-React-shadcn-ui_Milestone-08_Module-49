/** Global 404 page */

import NotFoundScene from "@/components/not-found-scene";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you are looking for doesn't exist or has moved. Head back to BookNook and keep reading.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundScene />;
}
