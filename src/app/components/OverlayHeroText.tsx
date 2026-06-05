"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "motion/react";

export default function OverlayHeroText({ text }: { text: string }) {
  const [vh, setVh] = useState(0);
  const [interactive, setInteractive] = useState(false);
  const vhRef = useRef(0);

  useEffect(() => {
    const update = () => {
      setVh(window.innerHeight);
      vhRef.current = window.innerHeight;
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.5,
  });

  const translateY = useTransform(smoothY, [0, vh], [vh, 0], { clamp: true });
  const opacity = useTransform(smoothY, [vh * 0.3, vh], [0, 1], {
    clamp: true,
  });
  const textShadow = useTransform(
    opacity,
    (o) =>
      `0 0 ${o * 40}px white, 0 0 ${o * 80}px white, 0 0 ${o * 120}px white`,
  );

  useMotionValueEvent(smoothY, "change", (v) => {
    setInteractive(v >= vhRef.current * 0.95);
  });

  if (vh === 0) return null;

  const headingClass =
    "font-visual text-6xl lg:text-9xl text-red-700 uppercase leading-none text-center font-normal tracking-tighter";

  return (
    <motion.div
      className="fixed inset-x-0 top-0 h-dvh lg:h-screen z-80 flex flex-col items-center justify-start px-4 pt-16 pointer-events-none"
      style={{ translateY }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {interactive ? (
          <motion.h1
            key="connect"
            className={headingClass}
            style={{ textShadow }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Link href="mailto:hello@multi2.co" className="pointer-events-auto">Connect with us</Link>
          </motion.h1>
        ) : (
          <motion.h1
            key="tagline"
            className={headingClass}
            style={{ textShadow }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            We multiply what matters
          </motion.h1>
        )}
      </AnimatePresence>
      {text && (
        <motion.p
          className="relative font-visual text-2xl lg:text-3xl tracking-tight max-w-5xl leading-tight text-red-700 mt-4 text-center"
          style={{ textShadow }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
}
