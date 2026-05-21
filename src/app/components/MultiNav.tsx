"use client";

import { Fragment, useRef, useEffect } from "react";
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
    search,
    setSearch,
    numCols,
    setNumCols,
  } = useUI();
  const { categories, items } = useWork();

  const countForCat = (cat: string) =>
    new Set(
      items
        .filter((item) =>
          cat === "all" ? item.isPrimary : item.categories.includes(cat),
        )
        .map((item) => item.slug),
    ).size;

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
      {panel === "projects" && (
        <>
          <Button
            variant={showList ? "link" : "nav"}
            className="font-rounded px-0 leading-tight"
            onClick={() => toggleView("list")}
          >
            List
          </Button>
          <Button
            variant="nav"
            className="font-rounded px-0 pointer-events-none"
          >
            /
          </Button>
          <Button
            variant={showGrid ? "link" : "nav"}
            className="font-rounded px-0 leading-tight flex lg:hidden"
            onClick={() => toggleView("grid")}
          >
            Thumbs
          </Button>
          <Button
            variant={showGrid ? "link" : "nav"}
            className="font-rounded px-0 leading-tight hidden lg:flex"
            onClick={() => toggleView("grid")}
          >
            Thumbnails
          </Button>
          <Button
            variant="nav"
            className="font-rounded px-0 pointer-events-none"
          >
            /
          </Button>
        </>
      )}
      {panel === "projects" && showGrid && (
        <>
          <Button
            variant="nav"
            className="font-rounded px-0 leading-tight"
            onClick={() => setNumCols(Math.min(8, numCols + 1))}
            disabled={numCols >= 8}
          >
            Zoom out
          </Button>
          <Button
            variant="nav"
            className="font-rounded px-0 pointer-events-none"
          >
            /
          </Button>
          <Button
            variant="nav"
            className="font-rounded px-0 leading-tight"
            onClick={() => setNumCols(Math.max(1, numCols - 1))}
            disabled={numCols <= 1}
          >
            Zoom in
          </Button>
          <Button
            variant="nav"
            className="font-rounded px-0 pointer-events-none"
          >
            /
          </Button>
        </>
      )}
      <DarkModeButton className="font-rounded tracking-normal gap-x-2" />
    </>
  );

  const navRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        "--nav-height",
        `${el.offsetHeight}px`,
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      ref={navRef}
      className={`fixed z-20 top-0 left-0 right-0 px-2 pt-2 flex flex-col items-center transition-colors duration-300 ${panel === "showreel" ? "bg-transparent" : "bg-background"}`}
      transition={{ duration: 0.4 }}
    >
      {/* Row 1: logo + nav links (desktop: settings inline) */}
      <div className="flex flex-row items-baseline font-rounded w-full lg:items-baseline justify-between lg:justify-start lg:gap-x-16">
        <motion.div
          layout
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Button
            variant="link"
            className="font-rounded cursor-pointer gap-0 flex leading-tight items-start tracking-normal"
            onClick={() => handleNavClick("showreel")}
          >
            Multi
            <span
              className="font-ft88-gothique text-[0.5rem] mt-[0.15rem] lg:text-[0.6rem] lg:mt-[0.25rem]  pr-1.5"
              style={{
                transform: "scaleX(1.75)",
                display: "inline-block",
                transformOrigin: "left",
              }}
            >
              2
            </span>
          </Button>
        </motion.div>

        <motion.div
          layout
          className="flex flex-wrap items-baseline justify-start gap-x-1 leading-tight"
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Button
            variant={panel === "projects" ? "link" : "nav"}
            className={cn(
              "font-rounded",
              panel === "projects" ? "tracking-wide" : "tracking-tight",
            )}
            onClick={() => handleNavClick("projects")}
          >
            Work
          </Button>
          <Button
            variant="nav"
            className="font-rounded px-0 pointer-events-none"
          >
            /
          </Button>
          <Button
            variant={panel === "about" ? "link" : "nav"}
            className={cn(
              "font-rounded",
              panel === "about" ? "tracking-wide" : "tracking-tight",
            )}
            onClick={() => handleNavClick("about")}
          >
            About
          </Button>
          <Button
            variant="nav"
            className="font-rounded px-0 pointer-events-none"
          >
            /
          </Button>
          <Button
            variant={panel === "connect" ? "link" : "nav"}
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
                variant="nav"
                className="font-rounded px-0 pointer-events-none"
              >
                /
              </Button>
              <Button
                variant={showSettings ? "link" : "nav"}
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
              className="hidden lg:flex items-baseline gap-x-1 pb-2 ml-auto font-rounded"
            >
              {settingsContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Row 2 (mobile only): settings OR filters — smooth crossfade between them */}
      <div className="lg:hidden w-full mt-8">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex flex-wrap justify-start gap-x-1 items-baseline pb-2 font-rounded w-full"
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
              className="flex flex-wrap justify-start gap-x-1 items-baseline pb-4 font-rounded w-full"
            >
              {["all", ...categories].map((cat, i) => (
                <Fragment key={cat}>
                  {i > 0 && (
                    <Button
                      variant="nav"
                      className="font-rounded px-0 leading-tight pointer-events-none text-base lg:text-lg"
                    >
                      /
                    </Button>
                  )}
                  <Button
                    variant={activeFilter === cat ? "link" : "nav"}
                    onClick={() => handleFilterChange(cat)}
                    className={cn(
                      "font-rounded inline px-0 leading-tight text-base lg:text-lg",
                      activeFilter === cat
                        ? "tracking-wide"
                        : "tracking-normal",
                    )}
                  >
                    {cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
                    {activeFilter === cat && ` (${countForCat(cat)})`}
                  </Button>
                </Fragment>
              ))}
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
            className="hidden lg:flex flex-wrap justify-start gap-x-1 items-baseline pb-2 mt-8 font-rounded w-full"
          >
            {["all", ...categories].map((cat, i) => (
              <Fragment key={cat}>
                {i > 0 && (
                  <motion.span variants={filterItemVariants}>
                    <Button
                      variant="nav"
                      className="font-rounded px-0 leading-tight pointer-events-none text-base lg:text-lg"
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
                    variant={activeFilter === cat ? "link" : "nav"}
                    onClick={() => handleFilterChange(cat)}
                    className={cn(
                      "font-rounded inline px-0 leading-tight text-base lg:text-lg",
                      activeFilter === cat
                        ? "tracking-wide"
                        : "tracking-normal",
                    )}
                  >
                    {cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
                    {activeFilter === cat && ` (${countForCat(cat)})`}
                  </Button>
                </motion.span>
              </Fragment>
            ))}

            <motion.span variants={filterItemVariants}>
              <Button
                variant="nav"
                className="font-rounded px-0 leading-tight pointer-events-none mr-1 text-base lg:text-lg"
              >
                /
              </Button>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none font-rounded text-base lg:text-lg py-0 h-auto text-neutral-300 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 w-32 focus:w-48 transition-all duration-200"
              />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
