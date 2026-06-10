"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUI, type Panel } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import DarkModeButton from "./DarkModeButton";
import Link from "next/link";
import TypedWord from "./TypedWord";

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

const filterItem: Variants = {
  hidden: {},
  show: {},
  exit: {},
};

const filterContainer: Variants = {
  hidden: { height: 0, transition: { duration: 0.2 } },
  show: { height: "auto", transition: { duration: 0.2 } },
  exit: { height: 0, transition: { duration: 0.2 } },
};

const filterContainerMobile: Variants = {
  hidden: { height: 0, transition: { duration: 0.2 } },
  show: { height: "auto", transition: { duration: 0.2 } },
  exit: { height: 0, transition: { duration: 0.2 } },
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
    heroInView,
    setHeroInView,
    aboutRef,
  } = useUI();
  const { categories, items } = useWork();
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [panel]);

  useEffect(() => {
    if (panel === "projects" && isDesktop) {
      setShowSettings(true);
    }
  }, [panel, isDesktop, setShowSettings]);

  const showFilters = panel === "projects" && !heroInView;

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
    if (p === "projects" && heroInView) {
      setHeroInView(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleAboutClick() {
    setHeroInView(true);
    if (panel !== "projects") {
      setPanel("projects");
      setOpenedCard(null);
      setTimeout(() => {
        aboutRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } else {
      aboutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
      className={`fixed z-20 top-0 left-0 right-0 px-4 lg:px-8  pt-2 lg:pt-8  pb-2 lg:pb-3 flex flex-col  transition-colors duration-300  ${panel === "showreel" ? "bg-transparent" : "bg-transparent"}`}
      transition={{ duration: 0.4 }}
    >
      {/* Row 1: logo + nav links (desktop: settings inline) */}
      <div className="flex flex-col items-center    w-full  justify-center lg:items-start  lg:gap-x-16">
        <motion.div
          layout
          transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Button
            variant="link"
            className={`cursor-pointer gap-0 font-visual font-medium flex leading-tight items-center justify-center tracking-normal`}
            onClick={() => handleNavClick("showreel")}
          >
            Multi²
          </Button>
        </motion.div>

        <motion.div
          layout
          className={`flex flex-wrap items-baseline justify-center lg:justify-start font-visual  font-medium gap-x-0 leading-tight  w-full`}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Button
            variant={panel === "projects" && !heroInView ? "link" : "nav"}
            onClick={() => handleNavClick("projects")}
          >
            Projects
          </Button>
          <Button variant="nav" className={` px-0 pointer-events-none mr-1 `}>
            ,
          </Button>
          <Button
            variant={heroInView ? "link" : "nav"}
            onClick={handleAboutClick}
          >
            About
          </Button>
          <Button variant="nav" className={` px-0 pointer-events-none mr-1 `}>
            ,
          </Button>
          <Button variant="nav" asChild>
            <Link href="mailto:hello@multi2.co">Connect</Link>
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
              variants={filterContainerMobile}
              initial="hidden"
              animate={showFilters ? "show" : "hidden"}
              exit="exit"
              className="overflow-hidden flex flex-wrap justify-center gap-x-0 items-baseline pb-0 font-visual font-medium lg:mt-0 w-full"
            >
              {["all", ...categories].flatMap((cat, i) => {
                const nodes = [];
                if (i > 0)
                  nodes.push(
                    <motion.span
                      key={`mc-${cat}`}
                      variants={filterItem}
                      className="inline-flex items-baseline"
                    >
                      <Button
                        variant="nav"
                        className="px-0 h-auto py-0 leading-tight pointer-events-none text-4xl"
                      >
                        ,
                      </Button>
                    </motion.span>,
                  );
                nodes.push(
                  <motion.span
                    key={`mb-${cat}`}
                    variants={filterItem}
                    className="inline-flex items-baseline"
                  >
                    <Button
                      variant={activeFilter === cat ? "link" : "nav"}
                      onClick={() => handleFilterChange(cat)}
                      className={cn(
                        "inline px-0 h-auto leading-tight ml-1 tracking-tight py-0 text-4xl uppercase",
                      )}
                    >
                      <TypedWord
                        text={cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
                        visible={showFilters}
                        delay={i * 60}
                      />
                      {activeFilter === cat && ` (${countForCat(cat)})`}
                    </Button>
                  </motion.span>,
                );
                return nodes;
              })}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Row 3: category filter buttons — desktop only */}
      <AnimatePresence>
        {panel === "projects" && (
          <motion.div
            key="filters-desktop"
            variants={filterContainer}
            initial="hidden"
            animate={showFilters ? "show" : "hidden"}
            exit="exit"
            className="hidden lg:flex overflow-hidden font-visual font-medium flex-wrap justify-start uppercase items-baseline pb-0 gap-0 w-full"
          >
            {["all", ...categories].flatMap((cat, i) => {
              const nodes = [];
              if (i > 0)
                nodes.push(
                  <motion.span
                    key={`c-${cat}`}
                    variants={filterItem}
                    className="inline-flex items-baseline"
                  >
                    <Button
                      variant="nav"
                      className="px-0 leading-tight h-auto py-0 mr-1 pointer-events-none lg:text-4xl"
                    >
                      ,
                    </Button>
                  </motion.span>,
                );
              nodes.push(
                <motion.span
                  key={`b-${cat}`}
                  variants={filterItem}
                  className="inline-flex justify-start items-baseline h-auto py-0"
                >
                  <Button
                    variant={activeFilter === cat ? "link" : "nav"}
                    onClick={() => handleFilterChange(cat)}
                    className={cn(
                      "inline px-0 leading-tight uppercase lg:text-4xl h-auto py-0 space-x-0 gap-x-0",
                      activeFilter === cat
                        ? "tracking-wide"
                        : "tracking-normal",
                    )}
                  >
                    <TypedWord
                      text={cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
                      visible={showFilters}
                      delay={i * 60}
                    />
                    {activeFilter === cat && ` (${countForCat(cat)})`}
                  </Button>
                </motion.span>,
              );
              return nodes;
            })}
            <motion.span
              key="search"
              variants={filterItem}
              className="inline-flex items-baseline"
            >
              <Button
                variant="nav"
                className="px-0 leading-tight pointer-events-none mr-1 lg:text-4xl"
              >
                ,
              </Button>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none font-visual leading-tight uppercase tracking-normal text-3xl lg:text-4xl py-0 h-auto text-lyx placeholder:text-lyx  w-48 focus:w-48 transition-all duration-200"
              />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
