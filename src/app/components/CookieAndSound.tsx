"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export default function CookieAndSound() {
  const [visibleCookie, setVisibleCookie] = useState(false);
  const [visibleSound, setVisibleSound] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const cookieConsent = localStorage.getItem("cookie-consent");
      if (!cookieConsent) {
        setVisibleCookie(true);
      } else if (!localStorage.getItem("sound-consent")) {
        setVisibleSound(true);
      }
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  function acceptCookies() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisibleCookie(false);
    setVisibleSound(true);
  }

  function declineCookies() {
    localStorage.setItem("cookie-consent", "declined");
    setVisibleCookie(false);
  }

  function acceptSound() {
    localStorage.setItem("sound-consent", "accepted");
    setVisibleSound(false);
  }

  function declineSound() {
    localStorage.setItem("sound-consent", "declined");
    setVisibleSound(false);
  }

  return (
    <AnimatePresence>
      {visibleCookie && (
        <motion.div
          key="cookie"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-0 left-0 right-0 z-50 flex flex-wrap gap-0 px-8 lg:px-8 pb-8 font-visual font-normal tracking-normal justify-start pText buttonColors   items-baseline"
        >
          <p className="pText noClickColors">
            We use cookies to improve your{" "}
            <Link
              className="pText noClickColors  transition-colors"
              href="/privacy-policy"
            >
              experience
            </Link>
            .{" "}
            <button
              className="buttonTextSM buttonColors"
              onClick={acceptCookies}
            >
              Yes
            </button>
            <span className="tbuttonTextSM buttonColors">, </span>
            <button
              className="buttonTextSM buttonColors"
              onClick={declineCookies}
            >
              No
            </button>
          </p>
        </motion.div>
      )}
      {visibleSound && (
        <motion.div
          key="sound"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-0 left-0 right-0 z-50 flex flex-wrap gap-0 px-8 lg:px-8 pb-8 font-visual font-normal tracking-normal justify-start pText buttonColors   items-baseline"
        >
          <p className="pText noClickColors whitespace-normal">
            Enable sound?{" "}
            <button className="buttonTextSM buttonColors" onClick={acceptSound}>
              Yes
            </button>
            <span className="buttonTextSM buttonColors">, </span>
            <button
              className="buttonTextSM buttonColors"
              onClick={declineSound}
            >
              No
            </button>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
