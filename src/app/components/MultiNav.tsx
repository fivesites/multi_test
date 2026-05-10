"use client";

import { Fragment } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUI, type Panel } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import DarkModeButton from "./DarkModeButton";

const CATEGORY_LABELS: Record<string, string> = {
  photo: "Photo",
  video: "Video",
  production: "Production",
  "art-direction": "Art Direction",
  concept: "Concept",
  "sound-design": "Sound Design",
  vax: "Vax",
  dop: "DOP",
  "post-processing": "Post-processing",
};

const filterItemVariants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export default function MultiNav() {
  const {
    panel,
    setPanel,
    setOpenedCard,
    showSettings,
    setShowSettings,
    showGrid,
    setShowGrid,
    showList,
    setShowList,
    activeFilter,
    setActiveFilter,
    glowMode,
    setGlowMode,
    search,
    setSearch,
    numCols,
    setNumCols,
  } = useUI();
  const { categories } = useWork();

  const navExpanded = panel !== "showreel";

  function handleNavClick(p: Panel) {
    setPanel(p);
    if (p !== "projects") setOpenedCard(null);
    if (p === "showreel") setShowSettings(false);
  }

  function handleFilterChange(cat: string) {
    setPanel("projects");
    setActiveFilter(cat);
    setOpenedCard(null);
    setSearch("");
    setShowSettings(false);
  }

  function toggleView(mode: "grid" | "list") {
    if (mode === "grid") {
      setShowGrid(true);
      setShowList(false);
    } else {
      setShowList(true);
      setShowGrid(false);
    }
  }

  const settingsContent = (
    <>
      <Button
        variant={showList ? "glow" : "link"}
        className="font-rounded px-0 leading-tight"
        onClick={() => toggleView("list")}
      >
        List
      </Button>
      <Button variant="link" className="font-rounded px-0 pointer-events-none">
        /
      </Button>
      <Button
        variant={showGrid ? "glow" : "link"}
        className="font-rounded px-0 leading-tight flex lg:hidden"
        onClick={() => toggleView("grid")}
      >
        Thumbs
      </Button>
      <Button
        variant={showGrid ? "glow" : "link"}
        className="font-rounded px-0 leading-tight hidden lg:flex"
        onClick={() => toggleView("grid")}
      >
        Thumbnails
      </Button>
      <Button variant="link" className="font-rounded px-0 pointer-events-none">
        /
      </Button>
      <Button
        variant={glowMode ? "glow" : "link"}
        className="font-rounded px-0 leading-tight"
        onClick={() => setGlowMode(!glowMode)}
      >
        Glow
      </Button>
      <Button variant="link" className="font-rounded px-0 pointer-events-none">
        /
      </Button>
      <Button
        variant="link"
        className="font-rounded px-0 leading-tight"
        onClick={() => setNumCols(Math.max(1, numCols - 1))}
        disabled={numCols <= 1}
      >
        Zoom out
      </Button>
      <Button variant="link" className="font-rounded px-0 pointer-events-none">
        /
      </Button>

      <Button
        variant="link"
        className="font-rounded px-0 leading-tight"
        onClick={() => setNumCols(Math.min(8, numCols + 1))}
        disabled={numCols >= 8}
      >
        Zoom in
      </Button>
      <Button variant="link" className="font-rounded px-0 pointer-events-none">
        /
      </Button>
      <DarkModeButton className="font-rounded tracking-normal gap-x-2" />
    </>
  );

  return (
    <motion.div
      className={`fixed z-20 top-0 left-0 right-0 px-[9px] lg:px-[24px] pt-[9px] lg:pt-[12px] lg:h-[17dvh] flex flex-col justify-between items-center pb-[9px] lg:pb-[12px] transition-[height,background-color] duration-300 ${showSettings || panel === "projects" ? "h-[16dvh]" : "h-[8dvh]"} ${panel === "showreel" ? "bg-transparent" : "bg-background"}`}
      transition={{ duration: 0.4 }}
    >
      {/* Row 1: logo + nav links (desktop: settings inline) */}
      <div
        className={cn(
          "flex flex-row items-baseline font-rounded text-red-200 [.no-glow_&]:text-neutral-400 w-full lg:items-baseline",
          navExpanded
            ? "justify-between lg:justify-start  lg:gap-x-16"
            : "justify-center gap-x-[18px]",
        )}
      >
        <motion.div
          layout
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Button
            variant="glow"
            className="font-rounded cursor-pointer gap-0 flex leading-tight tracking-normal text-red-100 [.no-glow_&]:text-red-500"
            onClick={() => handleNavClick("showreel")}
          >
            Multi²
          </Button>
        </motion.div>

        <motion.div
          layout
          className="flex flex-wrap items-baseline justify-start gap-x-1 leading-tight"
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
          {panel !== "showreel" && (
            <>
              <Button
                variant="link"
                className="font-rounded px-0 pointer-events-none"
              >
                /
              </Button>
              <Button
                variant={showSettings ? "glow" : "link"}
                className="font-rounded px-0 tracking-normal"
                onClick={() => setShowSettings(!showSettings)}
              >
                {showSettings ? "Hide" : "Settings"}
              </Button>
            </>
          )}
        </motion.div>

        {/* Desktop top-right: settings buttons */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              key="settings-desktop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="hidden lg:flex items-baseline gap-x-1 ml-auto font-rounded text-red-200 [.no-glow_&]:text-neutral-400"
            >
              {settingsContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Row 2 (mobile only): settings OR filters — smooth crossfade between them */}
      <div className="lg:hidden w-full">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex flex-wrap justify-start gap-x-1 items-baseline font-rounded text-red-300 [.no-glow_&]:text-neutral-400 py-0 w-full"
            >
              {settingsContent}
            </motion.div>
          ) : panel === "projects" ? (
            <motion.div
              key="filters"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex flex-wrap justify-start gap-x-1 items-baseline font-rounded text-red-300 [.no-glow_&]:text-neutral-400 py-0 w-full"
            >
              {["all", ...categories].map((cat, i) => (
                <Fragment key={cat}>
                  {i > 0 && (
                    <Button
                      variant="link"
                      className="font-rounded px-0 leading-tight pointer-events-none"
                    >
                      /
                    </Button>
                  )}
                  <Button
                    variant={activeFilter === cat ? "glow" : "link"}
                    onClick={() => handleFilterChange(cat)}
                    className={cn(
                      "font-rounded inline px-0 leading-tight",
                      activeFilter === cat
                        ? "tracking-wide"
                        : "tracking-normal",
                    )}
                  >
                    {cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
                  </Button>
                </Fragment>
              ))}
              <Button
                variant="link"
                className="font-rounded px-0 leading-tight pointer-events-none mr-1"
              >
                /
              </Button>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none font-rounded text-[18px] lg:text-[24px] py-0 h-auto text-neutral-300 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 w-32 transition-all duration-200"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Row 3: category filter buttons — desktop only */}
      <AnimatePresence>
        {panel === "projects" && (
          <motion.div
            key="filters-desktop"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.06, delayChildren: 0.05 },
              },
            }}
            className="hidden lg:flex flex-wrap justify-start gap-x-1 items-baseline font-rounded text-red-300 [.no-glow_&]:text-neutral-400 py-0 w-full"
          >
            {["all", ...categories].map((cat, i) => (
              <Fragment key={cat}>
                {i > 0 && (
                  <motion.span variants={filterItemVariants}>
                    <Button
                      variant="link"
                      className="font-rounded  px-0 leading-tight pointer-events-none"
                    >
                      /
                    </Button>
                  </motion.span>
                )}
                <motion.span
                  className="flex items-baseline gap-x-2"
                  variants={filterItemVariants}
                >
                  <Button
                    variant={activeFilter === cat ? "glow" : "link"}
                    onClick={() => handleFilterChange(cat)}
                    className={cn(
                      "font-rounded inline px-0 leading-tight",
                      activeFilter === cat
                        ? "tracking-wide"
                        : "tracking-normal",
                    )}
                  >
                    {cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
                  </Button>
                </motion.span>
              </Fragment>
            ))}

            <motion.span variants={filterItemVariants}>
              <Button
                variant="link"
                className="font-rounded  px-0 leading-tight pointer-events-none mr-1"
              >
                /
              </Button>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none font-rounded text-[18px] lg:text-[24px] py-0 h-auto text-neutral-300 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 w-24 focus:w-48 transition-all duration-200"
              />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {panel !== "showreel" && (
        <div className="absolute bottom-0 left-[9px] right-[9px] lg:left-[24px] lg:right-[24px] h-[1px] bg-red-200 dark:bg-neutral-400  [.no-glow_&]:bg-neutral-400 " />
      )}
    </motion.div>
  );
}
