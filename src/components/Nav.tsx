"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  HamburgerMenuIcon,
  Cross1Icon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/philosophy", label: "Philosophy" },
  { href: "/connect", label: "Connect" },
];

type ScrollPos = "top" | "middle" | "bottom";

function useScrollPosition(): ScrollPos {
  const [pos, setPos] = useState<ScrollPos>("top");

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollY <= 40) {
        setPos("top");
      } else if (maxScroll > 0 && scrollY >= maxScroll - 40) {
        setPos("bottom");
      } else {
        setPos("middle");
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return pos;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const scrollPos = useScrollPosition();

  const handleClick = () => {
    if (open) {
      setOpen(false);
      return;
    }
    if (scrollPos === "top") {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    } else if (scrollPos === "bottom") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setOpen(true);
    }
  };

  const icon = open ? (
    <Cross1Icon className="size-5" />
  ) : scrollPos === "top" ? (
    <ArrowDownIcon className="size-5" />
  ) : scrollPos === "bottom" ? (
    <ArrowUpIcon className="size-5" />
  ) : (
    <HamburgerMenuIcon className="size-5" />
  );

  return (
    <>
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-md"
          onClick={handleClick}
          aria-label={open ? "Close menu" : "Menu"}
        >
          {icon}
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="nav-overlay"
            className="fixed inset-0 z-40  flex flex-col items-center justify-center p-3 h-min w-full"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.32, 0, 0.67, 0] }}
          >
            <nav className="flex flex-col items-center gap-6 rounded-3xl h-min w-full bg-background p-12">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.07 * i,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`font-absolution1 text-5xl md:text-7xl transition-opacity uppercase duration-200 ${
                      pathname === link.href
                        ? "opacity-100"
                        : "opacity-40 hover:opacity-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
