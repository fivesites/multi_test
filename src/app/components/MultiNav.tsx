"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUI, type Panel } from "@/context/UIContext";

export default function MultiNav() {
  const { panel, setPanel, setActiveFilter, setOpenedCard } = useUI();
  const navExpanded = panel !== "showreel";

  function handleNavClick(p: Panel) {
    setPanel(p);
    if (p !== "projects") {
      setOpenedCard(null);
    }
  }

  return (
    <motion.div
      className="fixed z-20 top-0 left-0 right-0 px-4 pt-4 pb-2"
      animate={{ backgroundColor: navExpanded ? "var(--background)" : "transparent" }}
      transition={{ duration: 0.4 }}
    >
      <div
        className={cn(
          "flex flex-row items-center font-rounded text-2xl  text-red-200 h-full",
          navExpanded ? "justify-between" : "justify-center gap-x-8",
        )}
      >
        <motion.div
          layout
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Button
            variant="glow"
            className="font-rounded cursor-pointer gap-0 flex leading-tight tracking-normal text-red-100"
            onClick={() => handleNavClick("showreel")}
          >
            Multi²
          </Button>
        </motion.div>

        <motion.div
          layout
          className="flex items-baseline justify-start gap-x-1 leading-tight"
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Button
            variant={panel === "projects" ? "glow" : "link"}
            className={cn(
              "font-rounded",
              panel === "projects" ? "tracking-wide" : "tracking-tight",
            )}
            onClick={() => handleNavClick("projects")}
          >
            Work
          </Button>
          <Button
            variant="link"
            className="font-rounded px-0 pointer-events-none"
          >
            /
          </Button>
          <Button
            variant={panel === "about" ? "glow" : "link"}
            className={cn(
              "font-rounded",
              panel === "about" ? "tracking-wide" : "tracking-tight",
            )}
            onClick={() => handleNavClick("about")}
          >
            About
          </Button>
          <Button
            variant="link"
            className="font-rounded px-0 pointer-events-none"
          >
            /
          </Button>
          <Button
            variant={panel === "connect" ? "glow" : "link"}
            className={cn(
              "font-rounded",
              panel === "connect" ? "tracking-wide" : "tracking-tight",
            )}
            onClick={() => handleNavClick("connect")}
          >
            Connect
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
