"use client";

import { useRef, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
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
import { useCopyEntry, useCopyBody } from "@/context/CopyContext";
import DarkModeButton from "./DarkModeButton";
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
  const { categories, items } = useWork();
  const aboutEntry = useCopyEntry("about-intro");
  const aboutBody = useCopyBody("about-intro");

  const TYPING_MS_PER_CHAR = 22;
  const NAV_LOGO = "Multi²";
  const NAV_LOGO_DONE_MS = NAV_LOGO.length * TYPING_MS_PER_CHAR;
  const LOGO_APPEAR_MS = 80;
  const LOGIN_LEN = 6; // "Log In" and "studio" are both 6 chars
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

  const router = useRouter();

  const [navMenuOpen, setNavMenuOpen] = useState(true);
  const isWorkPageRef = useRef(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [navVisible, setNavVisible] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [linksVisible, setLinksVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    fetch(
      `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/users/me`,
      { credentials: "include" },
    )
      .then((r) => r.json())
      .then((d) => setLoggedIn(!!d?.id))
      .catch(() => setLoggedIn(false));
  }, []);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => {
    setNavVisible(true);
    const t1 = setTimeout(() => setLogoVisible(true), NAV_LOGO_DONE_MS);
    const t2 = setTimeout(
      () => setLoginVisible(true),
      NAV_LOGO_DONE_MS + LOGO_APPEAR_MS,
    );
    const t3 = setTimeout(
      () => setLinksVisible(true),
      NAV_LOGO_DONE_MS + LOGO_APPEAR_MS + LOGIN_LEN * TYPING_MS_PER_CHAR,
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      if (!isWorkPageRef.current && window.scrollY > lastY && window.scrollY > 10)
        setNavMenuOpen(false);
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return null;
  const isWorkPage = pathname.startsWith("/work/");
  isWorkPageRef.current = isWorkPage;
  const workSlug = isWorkPage ? (pathname.split("/").pop() ?? "") : "";
  const workItem = workSlug ? items.find((i) => i.slug === workSlug) : null;
  const showFilters = panel === "projects" && filtersOpen && !isWorkPage;

  const workVisible = isWorkPage && !!workItem;
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
  const sListLen = 4; // "List"
  const sThumbLen = isDesktop ? 10 : 6; // "Thumbnails" or "Thumbs"
  const sZoomOutLen = 8; // "Zoom Out"
  const sZoomInLen = 7; // "Zoom In"
  const sLightLen = 5; // "Light"
  const sListDelay = 0;
  const sThumbDelay = (sListLen + 2) * TYPING_MS_PER_CHAR;
  const sPostThumbDelay = sThumbDelay + (sThumbLen + 2) * TYPING_MS_PER_CHAR;
  const sZoomOutDelay = sPostThumbDelay;
  const sZoomInDelay = sZoomOutDelay + (sZoomOutLen + 2) * TYPING_MS_PER_CHAR;
  const sLightDelay = showGrid
    ? sZoomInDelay + (sZoomInLen + 2) * TYPING_MS_PER_CHAR
    : sPostThumbDelay;
  const sDarkDelay = sLightDelay + (sLightLen + 2) * TYPING_MS_PER_CHAR;

  const settingsContent = (
    <>
      <Button
        variant={showList ? "link" : "nav"}
        className="px-0 leading-tight"
        onClick={() => toggleView("list")}
      >
        <TypedWord text="List" visible={showSettings} delay={sListDelay} />
      </Button>
      <TypedWord
        text=", "
        visible={showSettings}
        delay={sListDelay + sListLen * TYPING_MS_PER_CHAR}
        className="mr-1 text-lader dark:text-lax"
      />
      <Button
        variant={showGrid ? "link" : "nav"}
        className="px-0 leading-tight flex lg:hidden"
        onClick={() => toggleView("grid")}
      >
        <TypedWord text="Thumbs" visible={showSettings} delay={sThumbDelay} />
      </Button>
      <Button
        variant={showGrid ? "link" : "nav"}
        className="px-0 leading-tight hidden lg:flex"
        onClick={() => toggleView("grid")}
      >
        <TypedWord
          text="Thumbnails"
          visible={showSettings}
          delay={sThumbDelay}
        />
      </Button>
      <TypedWord
        text=", "
        visible={showSettings}
        delay={sThumbDelay + sThumbLen * TYPING_MS_PER_CHAR}
        className="mr-1 text-lader dark:text-lax"
      />
      {showGrid && (
        <>
          <Button
            variant="nav"
            className="px-0 leading-tight"
            onClick={() => setNumCols(Math.min(8, numCols + 1))}
            disabled={numCols >= 8}
          >
            <TypedWord
              text="Zoom Out"
              visible={showSettings}
              delay={sZoomOutDelay}
            />
          </Button>
          <TypedWord
            text=", "
            visible={showSettings}
            delay={sZoomOutDelay + sZoomOutLen * TYPING_MS_PER_CHAR}
            className="mr-1 text-lader dark:text-lax"
          />
          <Button
            variant="nav"
            className="px-0 leading-tight"
            onClick={() => setNumCols(Math.max(1, numCols - 1))}
            disabled={numCols <= 1}
          >
            <TypedWord
              text="Zoom In"
              visible={showSettings}
              delay={sZoomInDelay}
            />
          </Button>
          <TypedWord
            text=", "
            visible={showSettings}
            delay={sZoomInDelay + sZoomInLen * TYPING_MS_PER_CHAR}
            className="mr-1 text-lader dark:text-lax"
          />
        </>
      )}
      <DarkModeButton
        className="tracking-normal"
        visible={showSettings}
        lightDelay={sLightDelay}
        darkDelay={sDarkDelay}
      />
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
    <>
      <motion.div
        ref={navRef}
        className="fixed z-20 top-0 left-0 right-0 px-8 lg:px-8 pt-8 lg:pt-8 pb-8 lg:pb-3 flex flex-col bg-transparent text-lyx"
        transition={{ duration: 0.4 }}
      >
        {/* Row 1: logo + nav links (desktop: settings inline) */}
        <div className="flex flex-col   w-full  justify-center lg:items-start  lg:gap-x-16">
          <motion.div
            layout
            transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
            className=" flex justify-between items-center w-full "
          >
            <Button
              variant="link"
              className="cursor-pointer gap-0 font-visual font-medium  flex leading-tight items-center justify-center   tracking-wide"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <TypedWord text="Multi²" visible={navVisible} delay={0} />
            </Button>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: logoVisible ? 1 : 0 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                variant="link"
                className="cursor-pointer gap-0 font-visual font-medium flex leading-tight items-center justify-center tracking-wide"
                onClick={() => setNavMenuOpen((v) => !v)}
              >
                <svg
                  viewBox="0 0 300 300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 lg:w-10 lg:h-10 aspect-square"
                >
                  <rect
                    width="300"
                    height="300"
                    transform="matrix(-1 0 0 1 300 0)"
                    className={
                      navMenuOpen
                        ? "fill-lader dark:fill-lava"
                        : "fill-lyx dark:fill-lax"
                    }
                  />
                  <path
                    d="M112 111V30H94.153L78.0331 67.3757C77.3423 68.9957 76.6514 69.8057 75.5 69.8057C74.1183 69.8057 73.5426 69.2271 72.7366 67.3757L56.7319 30H39V111H51.7808V52.2171H56.2713V61.2429H60.7618V74.4343H65.2524V83.46H85.7476V74.4343H90.2382V61.2429H94.7287V52.2171H99.2192V111H112Z"
                    className={
                      navMenuOpen
                        ? "fill-lyx dark:fill-lyx"
                        : "fill-lava dark:fill-lader"
                    }
                  />
                </svg>
              </Button>
            </motion.div>
            <span className="flex flex-wrap">
              <Button
                variant="nav"
                className="cursor-pointer gap-0 font-visual font-medium flex leading-tight items-center justify-center tracking-wide"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                asChild
              >
                <Link href="/studio">
                  <TypedWord
                    text={loggedIn ? "studio" : "Log In"}
                    visible={loginVisible}
                    delay={0}
                  />
                </Link>
              </Button>
            </span>
          </motion.div>
          {navMenuOpen && (
            <motion.div
              layout
              className={`flex flex-wrap lg:items-baseline justify-start items-baseline lg:justify-start font-visual font-medium gap-x-1 leading-tight w-full`}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="inline-flex items-baseline whitespace-nowrap">
                <Button
                  variant={panel === "showReel" ? "link" : "nav"}
                  onClick={() => {
                    setPanel("showReel");
                    setReelMode("intro");
                  }}
                >
                  <TypedWord
                    text="Showreel"
                    visible={linksVisible && navMenuOpen}
                    delay={navDelays[0]}
                  />
                </Button>
                <TypedWord
                  text=", "
                  visible={linksVisible && navMenuOpen}
                  delay={navCommaDelays[0]}
                  className="text-xl lg:text-lg text-lader dark:text-lax leading-tight tracking-wide"
                />
              </span>
              <span className="inline-flex items-baseline whitespace-nowrap">
                <Button
                  variant={panel === "projects" ? "link" : "nav"}
                  onClick={() => {
                    if (isWorkPage) {
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
                >
                  <TypedWord
                    text="Projects"
                    visible={linksVisible && navMenuOpen}
                    delay={navDelays[1]}
                  />
                </Button>
                <TypedWord
                  text=", "
                  visible={linksVisible && navMenuOpen}
                  delay={navCommaDelays[1]}
                  className="text-xl lg:text-lg text-lader dark:text-lax leading-tight tracking-wide"
                />
              </span>
              <span className="inline-flex items-baseline whitespace-nowrap">
                <Button
                  variant={panel === "about" ? "link" : "nav"}
                  onClick={() =>
                    setPanel(panel === "about" ? "projects" : "about")
                  }
                >
                  <TypedWord
                    text="About"
                    visible={linksVisible && navMenuOpen}
                    delay={navDelays[2]}
                  />
                </Button>
                <TypedWord
                  text=", "
                  visible={linksVisible && navMenuOpen}
                  delay={navCommaDelays[2]}
                  className="text-xl lg:text-lg text-lader dark:text-lax leading-tight tracking-wide"
                />
              </span>
              <span className="inline-flex items-baseline whitespace-nowrap">
                <Button
                  variant={panel === "connect" ? "link" : "nav"}
                  onClick={() =>
                    setPanel(panel === "connect" ? "projects" : "connect")
                  }
                >
                  <TypedWord
                    text="Connect"
                    visible={linksVisible && navMenuOpen}
                    delay={navDelays[3]}
                  />
                </Button>
                <TypedWord
                  text=", "
                  visible={linksVisible && navMenuOpen}
                  delay={navCommaDelays[3]}
                  className="text-xl lg:text-lg text-lader dark:text-lax leading-tight tracking-wide"
                />
              </span>
              <Button
                variant={showSettings ? "link" : "nav"}
                className="px-0 tracking-normal"
                onClick={() => setShowSettings(!showSettings)}
              >
                {showSettings ? (
                  "Hide Settings"
                ) : (
                  <TypedWord
                    text="Settings"
                    visible={linksVisible && navMenuOpen}
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
                    className="inline-flex items-baseline font-visual font-medium "
                  >
                    <Button
                      variant="nav"
                      className="px-0 pointer-events-none mr-1 text-lader dark:text-lax"
                    >
                      ,
                    </Button>
                    {settingsContent}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Row 2 (mobile only): settings OR filters */}
        <motion.div
          variants={filterContainerMobile}
          initial="hidden"
          animate={navMenuOpen ? "show" : "hidden"}
          className="lg:hidden overflow-hidden "
        >
          <motion.div
            variants={filterContainerMobile}
            initial="hidden"
            animate={showFilters ? "show" : "hidden"}
            className="overflow-hidden h-auto leading-tight flex flex-wrap lg:justify-center gap-x-1 gap-y-0 items-baseline pb-0 font-visual font-medium  lg:mt-0 w-full"
          >
            {allCats.flatMap((cat, i) => {
              const label = getFilterLabel(cat);
              return (
                <motion.span
                  key={`mb-${cat}`}
                  variants={filterItem}
                  className="inline-flex items-baseline whitespace-nowrap justify-start leading-tight h-auto"
                >
                  <Button
                    variant={activeFilter === cat ? "link" : "nav"}
                    onClick={() => handleFilterChange(cat)}
                    className={cn(
                      "inline-flex px-0 h-auto leading-tight tracking-normal py-0 gap-x-0.5  items-start text-3xl uppercase",
                      activeFilter === cat ? "text-lava" : "text-liguriskt",
                    )}
                  >
                    <TypedWord
                      text={label}
                      visible={showFilters}
                      delay={filterDelays[i]}
                    />
                  </Button>
                  <TypedWord
                    className="inline px-0 h-auto leading-tight tracking-tight py-0 text-3xl text-liguriskt dark:text-lax"
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
                    className="absolute pointer-events-none font-visual leading-tight uppercase tracking-tight text-3xl text-liguriskt dark:text-lax"
                  />
                )}
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder=""
                  className="bg-transparent outline-none font-visual leading-tight uppercase tracking-tight text-3xl py-0 h-auto text-liguriskt dark:text-lax w-full"
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
          animate={workVisible && navMenuOpen ? "show" : "hidden"}
          className="overflow-hidden flex flex-wrap items-baseline font-visual font-medium gap-y-1 gap-x-1 leading-tight  "
        >
          {wHasClient && (
            <span className="inline-flex items-baseline whitespace-nowrap text-xl lg:text-lg font-medium text-lava dark:text-lava leading-tight uppercase">
              <TypedWord
                text={workItem!.client!}
                visible={workVisible}
                delay={0}
                className=""
              />
              <TypedWord
                text=", "
                visible={workVisible}
                delay={wClientLen * TYPING_MS_PER_CHAR}
                className=""
              />
            </span>
          )}
          <span className="inline-flex items-baseline whitespace-nowrap text-xl lg:text-lg font-medium text-lava dark:text-lava leading-tight">
            <TypedWord
              text={workItem?.title ?? ""}
              visible={workVisible}
              delay={wTitleDelay}
              className=""
            />
            <TypedWord
              text=", "
              visible={workVisible}
              delay={wTitleDelay + wTitleLen * TYPING_MS_PER_CHAR}
              className=""
            />
          </span>
          {workItem?.year && (
            <span className="inline-flex items-baseline whitespace-nowrap text-xl lg:text-lg font-medium text-liguriskt dark:text-lax leading-tight">
              <TypedWord
                text={workItem.year.toString()}
                visible={workVisible}
                delay={wYearDelay}
                className=""
              />
              <TypedWord
                text=", "
                visible={workVisible}
                delay={wYearDelay + wYearLen * TYPING_MS_PER_CHAR}
                className=""
              />
            </span>
          )}
          <Button
            variant="nav"
            className="px-0 text-xl lg:text-lg font-medium leading-tight"
            asChild
          >
            <Link href="/">
              <TypedWord
                text="Back"
                visible={workVisible}
                delay={wBackDelay}
                className="text-xl lg:text-lg font-medium tracking-wide dark:text-lax text-liguriskt hover:text-lava leading-tight uppercase "
              />
            </Link>
          </Button>
        </motion.div>
        <motion.div
          variants={filterContainer}
          initial="hidden"
          animate={showFilters && navMenuOpen ? "show" : "hidden"}
          className="hidden lg:flex overflow-hidden font-visual font-medium flex-wrap justify-start uppercase items-baseline pb-0 gap-x-1 w-full max-w-6xl"
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
                    "inline-flex items-start px-0 leading-tight uppercase lg:text-4xl h-auto py-0 space-x-0 gap-x-0.5",
                    activeFilter === cat
                      ? "text-lava"
                      : "text-liguriskt dark:text-liguriskt",
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
                  className="inline px-0 leading-tight uppercase lg:text-4xl h-auto py-0 space-x-0 gap-x-0 text-liguriskt  dark:text-liguriskt"
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
            className="inline-flex items-baseline whitespace-nowrap"
          >
            <span className="relative inline-flex items-baseline w-43">
              {!search && (
                <TypedWord
                  text="Search..."
                  visible={showFilters}
                  delay={desktopSearchDelay}
                  className="absolute pointer-events-none font-visual leading-tight uppercase tracking-normal lg:text-4xl text-liguriskt dark:text-liguriskt"
                />
              )}
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder=""
                className="bg-transparent outline-none font-visual leading-tight uppercase tracking-normal lg:text-4xl py-0 h-auto text-liguriskt dark:text-lax w-full ml-1"
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

      {/* About and Connect panels — accessible from any page */}
      <AnimatePresence mode="wait">
        {panel === "about" && (
          <motion.div
            key="about-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[var(--nav-height)] z-[15] overflow-y-auto bg-background"
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
            className="fixed inset-x-0 bottom-0 top-[var(--nav-height)] z-[15] bg-background"
          >
            <ConnectSection />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
