"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Cookie() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-6 gap-4 px-4 lg:px-8 py-3  font-visual font-medium text-lg items-baseline"
        >
          <p className="  leading-tight  text-liguriskt whitespace-nowrap">
            We use cookies to improve your experience.{" "}
            <Link href="/privacy-policy" className="text-lava ">
              Privacy policy.
            </Link>
          </p>
          <div className="col-start-3 flex items-center gap-0 shrink-0">
            <Button variant="link" className="text-sm px-0" onClick={accept}>
              Accept
            </Button>
            <span className="text-lyx mx-1">,</span>
            <Button variant="nav" className="text-sm px-0" onClick={decline}>
              Decline
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
