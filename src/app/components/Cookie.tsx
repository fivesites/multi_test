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
          className="fixed bottom-0 left-0 right-0 z-50 flex flex-wrap gap-0 px-8 lg:px-8 pb-8  font-visual font-normal tracking-normal justify-start text-2xl lg:text-4xl items-baseline"
        >
          <p className=" text-2xl  leading-tight  text-liguriskt whitespace-normal">
            We use cookies to improve your experience.{" "}
            <Link href="/privacy-policy" className="text-lava ">
              Privacy policy.
            </Link>
          </p>{" "}
          <Button
            variant="link"
            className=" text-2xl lg:px-0 font-normal tracking-normal"
            onClick={accept}
          >
            Accept
          </Button>
          <span className=" mx-1">,</span>
          <Button
            variant="nav"
            className=" text-2xl px-0 font-normal tracking-normal"
            onClick={decline}
          >
            Decline
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
