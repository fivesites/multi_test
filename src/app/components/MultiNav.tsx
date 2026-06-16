"use client";

import { useRef, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import { useCopyEntry, useCopyBody } from "@/context/CopyContext";
import DarkModeButton from "./DarkModeButton";
import M2Button from "./M2Button";
import TerminalM2Button from "./TerminalM2Button";
import TypedWord from "./TypedWord";
import AboutSectionText from "./AboutSectionText";
import ConnectSection from "./ConnectSection";

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

const TYPING_MS_PER_CHAR = 22;
const NAV_LOGO = "Multi²";
const NAV_LOGO_DONE_MS = NAV_LOGO.length * TYPING_MS_PER_CHAR;
const LOGO_APPEAR_MS = 80;

const aboutPhrases = [
  "Remembering origin story",
  "Entering storyteller mode",
  "Growing a beard and lights the campfire",
];
const projectPhrases = [
  "Fetching important data",
  "Thinking about a really special project",
  "Dreams of new problems to solve",
];
const connectPhrases = [
  "Thinking of ways to connect",
  "Preparing the pigeon before flight",
];
const workPhrases = [
  "Oh this was a really cool project",
  "We killed it with this one",
];

export default function MultiNav() {
  const {
    panel,
    setPanel,
    setOpenedCard,
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
    contentDoneKey,
  } = useUI();
  const { categories, items } = useWork();
  const aboutEntry = useCopyEntry("about-intro");
  const aboutBody = useCopyBody("about-intro");

  const navItems = ["Projects", "About", "Connect", "Settings"];
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
  const navLastTypedMs =
    navDelays[navDelays.length - 1] +
    navItems[navItems.length - 1].length * TYPING_MS_PER_CHAR;

  const router = useRouter();

  const isWorkPageRef = useRef(false);
  const isDesktopRef = useRef(false);
  const hasStartedRef = useRef(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isBw, setIsBw] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const isFirstMount = useRef(true);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [navVisible, setNavVisible] = useState(false);
  const [linksVisible, setLinksVisible] = useState(false);
  const [navTyped, setNavTyped] = useState(false);
  useEffect(() => {
    const check = () => {
      const val = window.innerWidth >= 1024;
      setIsDesktop(val);
      isDesktopRef.current = val;
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => {
    const check = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
      setIsBw(document.documentElement.classList.contains("bw"));
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const t = setTimeout(() => setTimerDone(true), 4000);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (items.length === 0 || !timerDone || hasStartedRef.current) return;
    hasStartedRef.current = true;
    setNavVisible(true);
    const t = setTimeout(
      () => setLinksVisible(true),
      NAV_LOGO_DONE_MS + LOGO_APPEAR_MS,
    );
    return () => clearTimeout(t);
  }, [items.length, timerDone]);
  useEffect(() => {
    if (!linksVisible) return;
    const t = setTimeout(() => setNavTyped(true), navLastTypedMs);
    return () => clearTimeout(t);
  }, [linksVisible, navLastTypedMs]);
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
      if (delta > 0) {
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

  const pathname = usePathname();
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (pathname.startsWith("/projects/")) {
      setIsNavigating(true);
      if (panel === "showReel") setPanel("projects");
      const t = setTimeout(() => setIsNavigating(false), 700);
      return () => clearTimeout(t);
    }
    if (pathname === "/about") {
      if (panel === "showReel") setPanel("projects");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  if (pathname.startsWith("/studio")) return null;
  const isAboutPage = pathname === "/about";
  const isHomePage = pathname === "/";
  const isWorkPage = pathname.startsWith("/projects/");
  isWorkPageRef.current = isWorkPage;
  const workSlug = isWorkPage ? (pathname.split("/").pop() ?? "") : "";
  const workItem = workSlug ? items.find((i) => i.slug === workSlug) : null;
  const showFilters =
    panel === "projects" && filtersOpen && !isWorkPage && !isAboutPage;

  const currentPhrases = isAboutPage
    ? aboutPhrases
    : panel === "connect"
      ? connectPhrases
      : isWorkPage
        ? workPhrases
        : projectPhrases;

  const workVisible = isWorkPage && !!workItem;
  const workHeaderVisible = workVisible && !isNavigating;
  const wHasClient = !!workItem?.client;
  const wClientLen = workItem?.client?.length ?? 0;
  const wTitleLen = workItem?.title?.length ?? 0;
  const wYearLen = workItem?.year?.toString().length ?? 0;
  const wTitleDelay = wHasClient ? (wClientLen + 2) * TYPING_MS_PER_CHAR : 0;
  const wYearDelay = wTitleDelay + (wTitleLen + 2) * TYPING_MS_PER_CHAR;
  const wBackDelay = workItem?.year
    ? wYearDelay + (wYearLen + 2) * TYPING_MS_PER_CHAR
    : wTitleDelay + (wTitleLen + 2) * TYPING_MS_PER_CHAR;

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

  // Settings reveal delays
  const sToggleLabel = showList ? "List" : "Thumbnails";
  const sToggleLen = sToggleLabel.length;
  const defaultCols = isDesktop ? 6 : 2;
  const isZoomed = numCols < defaultCols;
  const sZoomLabel = isZoomed ? "Zoom Out" : "Zoom In";
  const sZoomLen = sZoomLabel.length;
  const sToggleDelay = 0;
  const sPostToggleDelay = (sToggleLen + 2) * TYPING_MS_PER_CHAR;
  const sZoomDelay = sPostToggleDelay;
  const sLightDelay = showGrid
    ? sZoomDelay + (sZoomLen + 2) * TYPING_MS_PER_CHAR
    : sPostToggleDelay;
  const settingsContent = (
    <>
      {isHomePage && (
        <span className="inline-flex items-baseline whitespace-nowrap buttonTextSM buttonColors">
          <M2Button
            text={sToggleLabel}
            visible={showSettings}
            delay={sToggleDelay}
            active={showList}
            onClick={() => toggleView(showList ? "grid" : "list")}
            className=""
          />
          <TypedWord
            text=", "
            visible={showSettings}
            delay={sToggleDelay + sToggleLen * TYPING_MS_PER_CHAR}
            className=""
          />
        </span>
      )}
      {isHomePage && showGrid && (
        <span className="inline-flex items-baseline whitespace-nowrap buttonTextSM buttonColors">
          <M2Button
            text={sZoomLabel}
            visible={showSettings}
            delay={sZoomDelay}
            onClick={() => setNumCols(isZoomed ? defaultCols : 2)}
            className=""
          />
          <TypedWord
            text=", "
            visible={showSettings}
            delay={sZoomDelay + sZoomLen * TYPING_MS_PER_CHAR}
            className=""
          />
        </span>
      )}
      <DarkModeButton
        className=""
        visible={showSettings}
        lightDelay={sLightDelay}
      />
    </>
  );

  return (
    <>
      <motion.div
        ref={navRef}
        className={cn(
          "fixed z-20 top-0 left-0 right-0 px-8 lg:px-8 pt-8 lg:pt-8 pb-8 lg:pb-3 flex flex-col nav-bw",
          isBw && panel === "showReel"
            ? "text-background"
            : "text-neutral-300 dark:text-neutral-900",
        )}
        animate={{
          backgroundColor:
            panel === "about" || panel === "connect"
              ? isDark
                ? "#000000"
                : "var(--background)"
              : "transparent",
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Row 1: logo + nav links (desktop: settings inline) */}
        <div className="flex flex-col   w-full  justify-center lg:items-start  lg:gap-x-16">
          <motion.div
            layout
            transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
            className=" flex justify-between items-baseline w-full "
          >
            <TerminalM2Button
              text="Multi²"
              visible={navVisible}
              delay={0}
              loading={items.length === 0 || !timerDone || isNavigating}
              loadingText={
                isNavigating ? "Loading Project" : "Loading multi2.co"
              }
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="cursor-pointer  "
              phrases={currentPhrases}
              trigger={`${panel}|${workSlug}|${pathname}`}
              stopTrigger={contentDoneKey}
            />
          </motion.div>
          <motion.div
            layout
            className={`flex flex-wrap lg:items-baseline justify-start items-baseline lg:justify-start  gap-x-1  w-full`}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="inline-flex items-baseline whitespace-nowrap buttonTextSM buttonColors">
              <M2Button
                text="Projects"
                visible={linksVisible}
                delay={navDelays[0]}
                active={panel === "projects" && !isAboutPage}
                className={cn("", panel !== "projects" && "")}
                onClick={() => {
                  if (isWorkPage || isAboutPage) {
                    setPanel("projects");
                    router.push("/");
                    return;
                  }
                  if (panel === "projects") {
                    setFiltersOpen((v) => !v);
                  } else {
                    setPanel("projects");
                    setReelMode("background");
                    setFiltersOpen(true);
                  }
                  scrollToProjects();
                }}
              />
              <TypedWord
                text=", "
                visible={linksVisible}
                delay={navCommaDelays[0]}
                className="buttonTextSM buttonColors"
              />
            </span>
            <span className="inline-flex items-baseline whitespace-nowrap buttonTextSM buttonColors">
              <M2Button
                text="About"
                visible={linksVisible}
                delay={navDelays[1]}
                active={isAboutPage}
                className=""
                href="/about"
              />
              <TypedWord
                text=", "
                visible={linksVisible}
                delay={navCommaDelays[1]}
                className=""
              />
            </span>
            <span className="inline-flex items-baseline whitespace-nowrap buttonTextSM buttonColors">
              <M2Button
                text="Connect"
                visible={linksVisible}
                delay={navDelays[2]}
                active={panel === "connect"}
                className={cn("", panel !== "connect" && "")}
                onClick={() =>
                  setPanel(panel === "connect" ? "projects" : "connect")
                }
              />
              <TypedWord
                text=", "
                visible={linksVisible}
                delay={navCommaDelays[2]}
                className=""
              />
            </span>
            <span className="inline-flex flex-wrap items-baseline gap-x-1 buttonTextSM buttonColors">
              <span className="inline-flex items-baseline whitespace-nowrap">
                <M2Button
                  text={showSettings ? "Hide Settings" : "Settings"}
                  visible={showSettings || linksVisible}
                  delay={showSettings ? 0 : navDelays[3]}
                  active={showSettings}
                  className={cn("", !showSettings && "")}
                  onClick={() => setShowSettings(!showSettings)}
                />
                <AnimatePresence>
                  {showSettings && (
                    <motion.span
                      key="s-comma"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="buttonTextSM buttonColors"
                    >
                      ,
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <AnimatePresence>
                {showSettings && (
                  <motion.span
                    key="settings-inline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="hidden lg:flex flex-wrap items-baseline gap-x-1 buttonTextSM buttonColors"
                  >
                    {settingsContent}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </motion.div>
        </div>

        {/* Row 2 (mobile only): settings OR filters */}
        <motion.div
          variants={filterContainerMobile}
          initial="hidden"
          animate="show"
          className="lg:hidden overflow-hidden "
        >
          <motion.div
            variants={filterContainerMobile}
            initial="hidden"
            animate={showSettings ? "show" : "hidden"}
            className="overflow-hidden flex flex-wrap items-baseline gap-x-1 buttonTextSM buttonColors w-full uppercase"
          >
            {settingsContent}
          </motion.div>
          <motion.div
            variants={filterContainerMobile}
            initial="hidden"
            animate={showFilters ? "show" : "hidden"}
            className="overflow-hidden h-auto flex flex-wrap lg:justify-center gap-x-1 gap-y-0 items-baseline pb-0 buttonTextSM buttonColors uppercase mt-0 w-full"
          >
            {allCats.flatMap((cat, i) => {
              const label = getFilterLabel(cat);
              return (
                <motion.span
                  key={`mb-${cat}`}
                  variants={filterItem}
                  className="inline-flex items-baseline uppercase whitespace-nowrap buttonTextLG buttonColors"
                >
                  <M2Button
                    lg
                    text={label}
                    visible={showFilters}
                    delay={filterDelays[i]}
                    onClick={() => handleFilterChange(cat)}
                    className={cn(
                      "uppercase transition-colors duration-150",
                      activeFilter === cat
                        ? "text-liguriskt hover:text-lappar"
                        : "text-lava hover:text-lappar",
                    )}
                  />
                  <TypedWord
                    className="buttonTextLG text-lava"
                    text=", "
                    visible={showFilters}
                    delay={filterDelays[i] + label.length * TYPING_MS_PER_CHAR}
                  />
                </motion.span>
              );
            })}
            <motion.span
              key="search-mobile"
              variants={filterItem}
              className="inline-flex items-baseline whitespace-nowrap"
            >
              <span className="relative inline-flex items-baseline w-36">
                {!search && (
                  <TypedWord
                    text="Search..."
                    visible={showFilters}
                    delay={searchDelay}
                    className="absolute pointer-events-none buttonTextLG text-lava"
                  />
                )}
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder=""
                  className={`bg-transparent outline-none py-0 h-auto w-full buttonTextLG text-lava`}
                />
              </span>
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Row 3: work header (all sizes) OR filters (desktop only) */}
        <motion.div
          key={workSlug}
          variants={filterContainer}
          initial="hidden"
          animate={workHeaderVisible ? "show" : "hidden"}
          className="overflow-hidden flex flex-wrap items-baseline  uppercase gap-x-1  buttonTextSM buttonColors  "
        >
          {wHasClient && (
            <span className="inline-flex items-baseline whitespace-nowrap buttonColors buttonTextSM ">
              <M2Button
                text={workItem!.client!}
                visible={workHeaderVisible}
                delay={0}
                className=""
              />
              <TypedWord
                text=", "
                visible={workHeaderVisible}
                delay={wClientLen * TYPING_MS_PER_CHAR}
                className=""
              />
            </span>
          )}
          <span className="inline-flex items-baseline whitespace-nowrap buttonTextSM buttonColors">
            <M2Button
              text={workItem?.title ?? ""}
              visible={workHeaderVisible}
              delay={wTitleDelay}
              className=""
            />
            <TypedWord
              text=", "
              visible={workHeaderVisible}
              delay={wTitleDelay + wTitleLen * TYPING_MS_PER_CHAR}
              className=" "
            />
          </span>
          {workItem?.year && (
            <span className="inline-flex items-baseline whitespace-nowrap buttonTextSM buttonColors ">
              <M2Button
                text={workItem.year.toString()}
                visible={workHeaderVisible}
                delay={wYearDelay}
                className=" "
              />
              <TypedWord
                text=", "
                visible={workHeaderVisible}
                delay={wYearDelay + wYearLen * TYPING_MS_PER_CHAR}
                className="  "
              />
            </span>
          )}
          <M2Button
            text="Back"
            visible={workHeaderVisible}
            delay={wBackDelay}
            href="/"
            className="buttonTextSM normal-case"
          />
        </motion.div>
        <motion.div
          variants={filterContainer}
          initial="hidden"
          animate={showFilters ? "show" : "hidden"}
          className="hidden lg:flex overflow-hidden  flex-wrap justify-start uppercase items-baseline buttonTextLG buttonColors gap-x-1 w-full max-w-6xl mt-0"
        >
          {allCats.flatMap((cat, i) => {
            const label = getDesktopFilterLabel(cat);
            return (
              <motion.span
                key={`b-${cat}`}
                variants={filterItem}
                className="inline-flex justify-start items-baseline h-auto py-0 whitespace-nowrap"
              >
                <M2Button
                  lg
                  text={label}
                  visible={showFilters}
                  delay={desktopFilterDelays[i]}
                  onClick={() => handleFilterChange(cat)}
                  className={cn(
                    "inline-flex items-start px-0 uppercase h-auto py-0 space-x-0 gap-x-0.5 transition-colors duration-150",
                    activeFilter === cat
                      ? "text-liguriskt hover:text-lappar"
                      : "text-lava hover:text-lappar",
                  )}
                />
                <TypedWord
                  text=", "
                  className="buttonTextLG text-lava"
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
            className="inline-flex items-baseline whitespace-nowrap buttonTextLg buttonColors"
          >
            <span className="relative inline-flex items-baseline w-43">
              {!search && (
                <TypedWord
                  text="Search..."
                  visible={showFilters}
                  delay={desktopSearchDelay}
                  className="absolute pointer-events-none buttonTextLG uppercase tracking-wide lg:text-4xl text-lava"
                />
              )}
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder=""
                className={`bg-transparent outline-none uppercase py-0 h-auto buttonTextLG w-full ml-1 text-lava`}
              />
            </span>
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Showreel — intro: centered, scales on scroll */}
      <AnimatePresence>
        {panel === "showReel" && navTyped && !isWorkPage && !isAboutPage && (
          <motion.div
            key="showreel-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[15] flex items-center h-dvh justify-center cursor-pointer"
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
              className="hidden h-dvh w-screen lg:block relative aspect-video"
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
              className="block lg:hidden relative h-[100dvh] w-full aspect-[9/16]"
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

      {/* About and Connect panels — accessible from any page */}
      <AnimatePresence mode="wait">
        {panel === "about" && (
          <motion.div
            key="about-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-x-0 bottom-0 top-[var(--nav-height)]  z-[15] overflow-y-auto bg-background dark:bg-black "
          >
            <AboutSectionText
              plainText={aboutEntry?.plainText ?? ""}
              text={aboutBody ?? undefined}
            />
          </motion.div>
        )}
        {panel === "connect" && (
          <motion.div
            key="connect-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[var(--nav-height)]  z-[15] bg-background dark:bg-black "
          >
            <ConnectSection />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
