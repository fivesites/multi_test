"use client";

import { motion } from "framer-motion";

export function PageTransitionCurtain({ color }: { color: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ backgroundColor: color }}
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    />
  );
}
