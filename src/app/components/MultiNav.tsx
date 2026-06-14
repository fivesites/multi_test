"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type Variants,
} from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import DarkModeButton from "./DarkModeButton";
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
    reelMode,
    setReelMode,
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
  const { categories } = useWork();

  const TYPING_MS_PER_CHAR = 22;
  const NAV_LOGO = "Multi²";
  const navItems = ["Showreel", "Projects", "About", "Connect", "Settings"];
  const navDelays = navItems.reduce<number[]>((acc, _label, i) => {
    if (i === 0) return [0];
    return [
      ...acc,
      acc[i - 1] + (navItems[i - 1].length + 2) * TYPING_MS_PER_CHAR,
    ];
  }, []);
  const navCommaDelays = navItems.map(
    (label, i) => navDelays[i] + label.length * TYPING_MS_PER_CHAR,
  );

  const [isDesktop, setIsDesktop] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [navVisible, setNavVisible] = useState(false);
  const [linksVisible, setLinksVisible] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => {
    setNavVisible(true);
    const t = setTimeout(
      () => setLinksVisible(true),
      NAV_LOGO.length * TYPING_MS_PER_CHAR,
    );
    return () => clearTimeout(t);
  }, []);

  const showFilters = panel === "projects" && filtersOpen;

  const allCats = ["all", ...categories];
  const getFilterLabel = (cat: string) =>
    cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat);
  const getDesktopFilterLabel = (cat: string) =>
    cat === "all" ? "All Projects" : (CATEGORY_LABELS[cat] ?? cat);
  const filterDelays = allCats.reduce<number[]>((acc, _cat, i) => {
    if (i === 0) return [0];
    const prevLabel = getFilterLabel(allCats[i - 1]);
    return [...acc, acc[i - 1] + (prevLabel.length + 2) * TYPING_MS_PER_CHAR];
  }, []);
  const desktopFilterDelays = allCats.reduce<number[]>((acc, _cat, i) => {
    if (i === 0) return [0];
    const prevLabel = getDesktopFilterLabel(allCats[i - 1]);
    return [...acc, acc[i - 1] + (prevLabel.length + 2) * TYPING_MS_PER_CHAR];
  }, []);
  const lastCat = allCats[allCats.length - 1];
  const searchDelay =
    filterDelays[allCats.length - 1] +
    (getFilterLabel(lastCat).length + 2) * TYPING_MS_PER_CHAR;
  const desktopSearchDelay =
    desktopFilterDelays[allCats.length - 1] +
    (getDesktopFilterLabel(lastCat).length + 2) * TYPING_MS_PER_CHAR;

  function scrollToProjects() {
    const el = document.getElementById("projects");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function handleFilterChange(cat: string) {
    setActiveFilter(cat);
    setOpenedCard(null);
    setSearch("");
    setShowSettings(false);
    scrollToProjects();
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
      <Button
        variant={showList ? "link" : "nav"}
        className=" px-0 leading-tight"
        onClick={() => toggleView("list")}
      >
        List
      </Button>
      <Button variant="nav" className=" px-0 pointer-events-none mr-1 text-lyx">
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
      <Button variant="nav" className="mr-1 px-0 pointer-events-none text-lyx">
        ,
      </Button>
      {showGrid && (
        <>
          <Button
            variant="nav"
            className=" px-0 leading-tight"
            onClick={() => setNumCols(Math.min(8, numCols + 1))}
            disabled={numCols >= 8}
          >
            Zoom Out
          </Button>
          <Button
            variant="nav"
            className=" px-0 pointer-events-none mr-1 text-lyx"
          >
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
          <Button
            variant="nav"
            className="px-0 pointer-events-none mr-1 text-lyx"
          >
            ,
          </Button>
        </>
      )}
      <DarkModeButton className="tracking-normal " />
    </>
  );

  const scrollProgress = useMotionValue(0);
  const videoScale = useTransform(scrollProgress, [0, 400], [1, 0]);
  const openScrollY = useRef(0);

  useEffect(() => {
    if (panel !== "showReel") {
      scrollProgress.set(0);
      return;
    }
    openScrollY.current = window.scrollY;
    scrollProgress.set(0);
    const onScroll = () => {
      const delta = Math.max(0, window.scrollY - openScrollY.current);
      scrollProgress.set(delta);
      if (delta >= 400) {
        setPanel("projects");
        setReelMode("background");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [panel, scrollProgress, setPanel, setReelMode]);

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
      className="fixed z-20 top-0 left-0 right-0 px-8 lg:px-8 pt-8 lg:pt-8 pb-2 lg:pb-3 flex flex-col bg-background text-lyx"
      transition={{ duration: 0.4 }}
    >
      {/* Row 1: logo + nav links (desktop: settings inline) */}
      <div className="flex flex-col   w-full  justify-center lg:items-start  lg:gap-x-16">
        <motion.div
          layout
          transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Button
            variant="link"
            className="cursor-pointer gap-0 font-visual font-medium flex leading-tight items-center justify-center tracking-wide"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <TypedWord text="Multi²" visible={navVisible} delay={0} />
          </Button>
        </motion.div>

        <motion.div
          layout
          className={`flex flex-wrap lg:items-baseline justify-start items-start lg:justify-start font-visual  font-medium gap-x-0 leading-tight  w-full`}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Button
            variant={panel === "showReel" ? "link" : "nav"}
            onClick={() => {
              setPanel("showReel");
              setReelMode("intro");
            }}
          >
            <TypedWord
              text="Showreel"
              visible={linksVisible}
              delay={navDelays[0]}
            />
          </Button>
          <TypedWord
            text=", "
            visible={linksVisible}
            delay={navCommaDelays[0]}
            className="text-xl lg:text-lg text-lyx leading-tight tracking-wide"
          />
          <Button
            variant={panel === "projects" ? "link" : "nav"}
            onClick={() => {
              if (panel === "projects") {
                setFiltersOpen((v) => !v);
              } else {
                setPanel("projects");
                setReelMode("background");
                setFiltersOpen(true);
              }
              scrollToProjects();
            }}
            className="ml-1"
          >
            <TypedWord
              text="Projects"
              visible={linksVisible}
              delay={navDelays[1]}
            />
          </Button>
          <TypedWord
            text=", "
            visible={linksVisible}
            delay={navCommaDelays[1]}
            className="text-xl lg:text-lg text-lyx leading-tight tracking-wide"
          />
          <Button
            variant={panel === "about" ? "link" : "nav"}
            onClick={() => setPanel(panel === "about" ? "projects" : "about")}
            className="ml-1"
          >
            <TypedWord
              text="About"
              visible={linksVisible}
              delay={navDelays[2]}
            />
          </Button>
          <TypedWord
            text=", "
            visible={linksVisible}
            delay={navCommaDelays[2]}
            className="text-xl lg:text-lg text-lyx leading-tight tracking-wide"
          />
          <Button
            variant={panel === "connect" ? "link" : "nav"}
            onClick={() =>
              setPanel(panel === "connect" ? "projects" : "connect")
            }
            className="ml-1"
          >
            <TypedWord
              text="Connect"
              visible={linksVisible}
              delay={navDelays[3]}
            />
          </Button>
          <TypedWord
            text=", "
            visible={linksVisible}
            delay={navCommaDelays[3]}
            className="text-xl lg:text-lg text-lyx leading-tight tracking-wide"
          />
          <Button
            variant={showSettings ? "link" : "nav"}
            className="px-0 tracking-normal ml-1"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? (
              "Hide Settings"
            ) : (
              <TypedWord
                text="Settings"
                visible={linksVisible}
                delay={navDelays[4]}
              />
            )}
          </Button>
          <AnimatePresence>
            {showSettings && (
              <motion.span
                key="settings-inline-desktop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="hidden lg:inline-flex items-baseline font-visual font-medium"
              >
                <Button
                  variant="nav"
                  className="px-0 pointer-events-none mr-1 text-lyx"
                >
                  ,
                </Button>
                {settingsContent}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Row 2 (mobile only): settings OR filters — smooth crossfade between them */}
      <div className="lg:hidden w-full  mt-0">
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
          ) : (
            <motion.div
              key="filters"
              variants={filterContainerMobile}
              initial="hidden"
              animate={showFilters ? "show" : "hidden"}
              exit="exit"
              className="overflow-hidden flex items-start flex-wrap lg:justify-center gap-x-0 gap-y-0 lg:items-baseline pb-0 font-visual font-medium mt-1 lg:mt-0 w-full"
            >
              {allCats.flatMap((cat, i) => {
                const label = getFilterLabel(cat);
                return (
                  <motion.span
                    key={`mb-${cat}`}
                    variants={filterItem}
                    className="inline-flex items-baseline whitespace-nowrap"
                  >
                    <Button
                      variant={activeFilter === cat ? "link" : "nav"}
                      onClick={() => handleFilterChange(cat)}
                      className={cn(
                        "inline-flex px-0 h-auto leading-tight ml-1 tracking-normal py-0 gap-x-0.5  items-start text-3xl uppercase",
                        activeFilter === cat ? "text-lava" : "text-lyx",
                      )}
                    >
                      <TypedWord
                        text={label}
                        visible={showFilters}
                        delay={filterDelays[i]}
                      />
                    </Button>
                    <TypedWord
                      className="inline px-0 h-auto leading-tight tracking-tight py-0 text-3xl text-lyx"
                      text=", "
                      visible={showFilters}
                      delay={
                        filterDelays[i] + label.length * TYPING_MS_PER_CHAR
                      }
                    />
                  </motion.span>
                );
              })}
              <motion.span
                key="search-mobile"
                variants={filterItem}
                className="inline-flex items-baseline whitespace-nowrap ml-1"
              >
                <span className="relative inline-flex items-baseline w-36">
                  {!search && (
                    <TypedWord
                      text="Search..."
                      visible={showFilters}
                      delay={searchDelay}
                      className="absolute pointer-events-none font-visual leading-tight uppercase tracking-tight text-3xl text-lyx"
                    />
                  )}
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder=""
                    className="bg-transparent outline-none font-visual leading-tight uppercase tracking-tight text-3xl py-0 h-auto text-lyx w-full"
                  />
                </span>
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Row 3: category filter buttons — desktop only */}
      <motion.div
        variants={filterContainer}
        initial="hidden"
        animate={showFilters ? "show" : "hidden"}
        className="hidden lg:flex overflow-hidden font-visual font-medium flex-wrap justify-start uppercase items-baseline pb-0 gap-0 w-full max-w-6xl"
      >
        {allCats.flatMap((cat, i) => {
          const label = getDesktopFilterLabel(cat);
          return (
            <motion.span
              key={`b-${cat}`}
              variants={filterItem}
              className="inline-flex justify-start items-baseline h-auto py-0 whitespace-nowrap"
            >
              <Button
                variant={activeFilter === cat ? "link" : "nav"}
                onClick={() => handleFilterChange(cat)}
                className={cn(
                  "inline-flex items-start px-0 leading-tight uppercase lg:text-4xl ml-1 h-auto py-0 space-x-0 gap-x-0.5",
                  activeFilter === cat
                    ? "tracking-wide text-lava"
                    : "tracking-normal text-lyx",
                )}
              >
                <TypedWord
                  text={label}
                  visible={showFilters}
                  delay={desktopFilterDelays[i]}
                />
              </Button>
              <TypedWord
                text=", "
                className="inline px-0 leading-tight uppercase lg:text-4xl h-auto py-0 space-x-0 gap-x-0 text-lyx"
                visible={showFilters}
                delay={
                  desktopFilterDelays[i] + label.length * TYPING_MS_PER_CHAR
                }
              />
            </motion.span>
          );
        })}
        <motion.span
          key="search"
          variants={filterItem}
          className="inline-flex items-baseline whitespace-nowrap ml-1"
        >
          <span className="relative inline-flex items-baseline w-43">
            {!search && (
              <TypedWord
                text="Search..."
                visible={showFilters}
                delay={desktopSearchDelay}
                className="absolute pointer-events-none font-visual leading-tight uppercase tracking-normal lg:text-4xl text-lyx"
              />
            )}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder=""
              className="bg-transparent outline-none font-visual leading-tight uppercase tracking-normal lg:text-4xl py-0 h-auto text-lyx w-full ml-1"
            />
          </span>
        </motion.span>
      </motion.div>

      {/* Gradient fade below nav */}
      {/* <div className="absolute left-0 right-0 top-full h-12 bg-gradient-to-b from-background to-transparent pointer-events-none" /> */}

      {/* Showreel — intro: centered, scales on scroll */}
      <AnimatePresence>
        {panel === "showReel" && (
          <motion.div
            key="showreel-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[15] flex items-center justify-center cursor-pointer"
            onClick={() => {
              setPanel("projects");
              setReelMode("background");
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ scale: videoScale }}
              className="hidden lg:block relative w-[70vw] max-w-5xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src="/multi_showreel_desktop.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ scale: videoScale }}
              className="block lg:hidden relative h-[80dvh] aspect-[9/16]"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src="/multi_showreel_mobile.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Showreel — background: full-screen behind content */}
    </motion.div>
  );
}
