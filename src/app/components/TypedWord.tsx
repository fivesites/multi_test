"use client";

import { motion } from "motion/react";

const TYPING_INTERVAL = 0.022;
const ERASING_INTERVAL = 0.014;

const letterVariants = {
  visible: { display: "inline", opacity: 1, transition: { duration: 0 } },
  hidden: { display: "none", opacity: 0, transition: { duration: 0 } },
};

export default function TypedWord({
  text,
  visible = true,
  delay = 0,
  eraseDelay = 0,
  speed = 1,
  eraseSpeed,
  className,
  cursor,
}: {
  text: string;
  visible?: boolean;
  delay?: number;
  eraseDelay?: number;
  speed?: number;
  eraseSpeed?: number;
  className?: string;
  cursor?: boolean | string;
}) {
  const cursorChar = typeof cursor === "string" ? cursor : "_";
  const cursorDelay = delay / 1000 + text.length * TYPING_INTERVAL * speed;

  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: TYPING_INTERVAL * speed,
            delayChildren: delay / 1000,
          },
        },
        hidden: {
          transition: {
            staggerChildren: ERASING_INTERVAL * (eraseSpeed ?? speed),
            staggerDirection: -1,
            delayChildren: eraseDelay / 1000,
          },
        },
      }}
    >
      {text.split("").map((char, i) => (
        <motion.span key={i} variants={letterVariants}>
          {char}
        </motion.span>
      ))}
      {cursor && visible && (
        <motion.span
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0, 0] }}
          transition={{
            delay: cursorDelay,
            duration: 1,
            repeat: Infinity,
            times: [0, 0, 0.5, 0.5, 1],
          }}
          className="bg-current text-background"
        >
          {cursorChar}
        </motion.span>
      )}
    </motion.span>
  );
}
