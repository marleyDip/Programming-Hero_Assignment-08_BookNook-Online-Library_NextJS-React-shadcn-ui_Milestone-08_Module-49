"use client";

/* A template remounts on every navigation, so each page flips in with a 3D entrance. */

import { motion } from "framer-motion";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 10, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1400, transformOrigin: "top center" }}
    >
      {children}
    </motion.div>
  );
}
