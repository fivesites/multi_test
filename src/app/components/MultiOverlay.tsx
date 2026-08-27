"use client";

import { motion } from "motion/react";

/** Splash over the Squared menu. Clicking multi2.co dismisses it. */
export default function MultiOverlay({ onClose }: { onClose?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 inset-0 z-100 flex flex-col items-center justify-center w-full h-screen bg-blue-800 gap-8"
    >
      <h2 className="font-visual text-9xl tracking-tight font-light text-neutral-800 ">
        multisquared
      </h2>
      <button
        onClick={onClose}
        className="absolute bottom-8 inset-x-0 text-center text-lg font-visual text-neutral-800 font-normal tracking-wide underline cursor-pointer transition-opacity hover:opacity-60"
      >
        multi2.co
      </button>
    </motion.div>
  );
}
