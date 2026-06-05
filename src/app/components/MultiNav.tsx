"use client";

import { Fragment, useRef, useEffect, useState } from "react";
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
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
    if (mode === "list") {
      setShowList(true);
      setShowGrid(false);
    } else {
      setShowGrid(true);
      setShowList(false);
    }
    if (!isDesktop) setShowSettings(false);
  }

  const settingsContent = (
    <>
      {panel === "projects" && (
        <>
          <Button
            variant={showList ? "link" : "nav"}
            className=" px-0 leading-tight"
            onClick={() => toggleView("list")}
          >
            List
          </Button>
          <Button variant="nav" className=" px-0 pointer-events-none mr-1">
            ,
          </Button>
          <Button
            variant={showGrid ? "link" : "nav"}
            className=" px-0 leading-tight flex lg:hidden"
            onClick={() => toggleView("grid")}
          >
            Thumbs
          </Button>
          <Button
            variant={showGrid ? "link" : "nav"}
            className=" px-0 leading-tight hidden mr-1 lg:flex"
            onClick={() => toggleView("grid")}
          >
            Thumbnails
          </Button>
          <Button variant="nav" className="mr-1 px-0 pointer-events-none">
            ,
          </Button>
        </>
      )}
      {panel === "projects" && showGrid && (
        <>
          <Button
            variant="nav"
            className=" px-0 leading-tight"
            onClick={() => setNumCols(Math.min(8, numCols + 1))}
            disabled={numCols >= 8}
          >
            Zoom Out
          </Button>
          <Button variant="nav" className=" px-0 pointer-events-none mr-1">
            ,
          </Button>
          <Button
            variant="nav"
            className=" px-0 leading-tight"
            onClick={() => setNumCols(Math.max(1, numCols - 1))}
            disabled={numCols <= 1}
          >
            Zoom In
          </Button>
          <Button variant="nav" className="px-0 pointer-events-none mr-1">
            ,
          </Button>
        </>
      )}
      <DarkModeButton className="tracking-normal " />
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
      className={`fixed z-20 top-0 left-0 right-0 px-4 lg:px-8  pt-2 lg:pt-8  pb-2 lg:pb-3 flex flex-col  transition-colors duration-300  ${panel === "showreel" ? "bg-transparent" : "bg-background"}`}
      transition={{ duration: 0.4 }}
    >
      {/* Row 1: logo + nav links (desktop: settings inline) */}
      <div className="flex flex-col items-center    w-full  justify-center lg:items-start  lg:gap-x-16">
        <motion.div
          layout
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Button
            variant="link"
            className={`cursor-pointer gap-0 font-visual font-medium flex leading-tight items-center justify-center tracking-normal ${panel === "showreel" ? "text-4xl lg:text-4xl " : ""}`}
            onClick={() => handleNavClick("showreel")}
          >
            Multi²
          </Button>
        </motion.div>

        <motion.div
          layout
          className={`flex items-baseline justify-center lg:justify-start ${panel === "showreel" ? " lg:items-start flex-col items-center" : "flex-wrap"} font-visual  font-medium gap-x-0 leading-tight  w-full`}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Button
            variant={panel === "projects" ? "link" : "nav"}
            className={cn(
              "",
              panel === "showreel"
                ? "text-4xl uppercase lg:text-4xl"
                : "tracking-tight",
            )}
            onClick={() => handleNavClick("projects")}
          >
            Projects
          </Button>
          <Button
            variant="nav"
            className={`${panel === "showreel" ? "hidden lg:flex text-4xl lg:text-4xl" : "flex"} px-0 pointer-events-none mr-1 `}
          >
            ,
          </Button>
          <Button
            variant={panel === "about" ? "link" : "nav"}
            className={cn(
              "",
              panel === "showreel"
                ? "text-4xl lg:text-4xl uppercase"
                : "tracking-tight",
            )}
            onClick={() => handleNavClick("about")}
          >
            About
          </Button>
          <Button
            variant="nav"
            className={`${panel === "showreel" ? "hidden lg:flex text-4xl lg:text-4xl" : "flex"} px-0 pointer-events-none mr-1 `}
          >
            ,
          </Button>
          <Button
            variant={panel === "connect" ? "link" : "nav"}
            className={cn(
              "",
              panel === "showreel"
                ? "text-4xl lg:text-4xl uppercase"
                : "tracking-tight ",
            )}
            onClick={() => handleNavClick("connect")}
          >
            Connect
          </Button>
          {panel !== "showreel" && (
            <>
              <Button variant="nav" className=" px-0 pointer-events-none mr-1">
                ,
              </Button>
              <Button
                variant={showSettings ? "link" : "nav"}
                className="px-0 tracking-normal"
                onClick={() => setShowSettings(!showSettings)}
              >
                {showSettings ? "Hide Settings" : "Settings"}
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
              className="hidden lg:flex items-baseline  lg:fixed top-0 right-0 lg:pt-8 lg:px-8 font-visual font-medium   "
            >
              {settingsContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Row 2 (mobile only): settings OR filters — smooth crossfade between them */}
      <div className="lg:hidden w-full px-4 mt-0">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="mt-0 lg:mt-0 flex flex-wrap justify-center font-visual font-medium  items-baseline pb-0  w-full"
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
              className="flex flex-wrap justify-center gap-x-0 items-baseline pb-0 font-visual  font-medium  lg:mt-0  w-full"
            >
              {["all", ...categories].map((cat, i) => (
                <Fragment key={cat}>
                  {i > 0 && (
                    <Button
                      variant="nav"
                      className=" px-0 h-auto, py-0 leading-tight pointer-events-none text-4xl  "
                    >
                      ,
                    </Button>
                  )}
                  <Button
                    variant={activeFilter === cat ? "link" : "nav"}
                    onClick={() => handleFilterChange(cat)}
                    className={cn(
                      "inline px-0 h-auto leading-tight ml-1 tracking-tight py-0 text-4xl uppercase ",
                      activeFilter === cat ? "" : "",
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
            className="hidden lg:flex font-visual font-medium  flex-wrap justify-start mx-0   uppercase items-baseline pb-0 gap-0    w-full "
          >
            {["all", ...categories].map((cat, i) => (
              <Fragment key={cat}>
                {i > 0 && (
                  <motion.span variants={filterItemVariants}>
                    <Button
                      variant="nav"
                      className=" px-0 leading-tight h-auto py-0 mr-1 pointer-events-none lg:text-4xl "
                    >
                      ,
                    </Button>
                  </motion.span>
                )}
                <motion.span
                  className="flex justify-start items-baseline lg:text-4xl  h-auto py-0"
                  variants={filterItemVariants}
                >
                  <Button
                    variant={activeFilter === cat ? "link" : "nav"}
                    onClick={() => handleFilterChange(cat)}
                    className={cn(
                      " inline px-0 leading-tight uppercase lg:text-4xl h-auto py-0 space-x-0 gap-x-0 ",
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
                className="px-0 leading-tight pointer-events-none mr-1 lg:text-4xl  "
              >
                ,
              </Button>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none font-visual leading-tight uppercase tracking-normal text-3xl lg:text-4xl py-0 h-auto text-red-700 placeholder:text-red-300 dark:placeholder:text-red-700 w-48 focus:w-48 transition-all duration-200"
              />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
