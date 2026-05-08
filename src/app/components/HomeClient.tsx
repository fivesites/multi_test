"use client";

import { useRef, useEffect, useState, Fragment } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import MultiCard from "./MultiCard";
import VideoPlayer from "./VideoPlayer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MultiNav from "./MultiNav";
import DarkModeButton from "./DarkModeButton";
import { UIProvider, useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import { useCopy } from "@/context/CopyContext";

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

const CONNECT_EMAIL = "hello@multi2.co";

const charVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const filterItemVariants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

function HomeClientInner() {
  const { items, categories } = useWork();
  const aboutText = useCopy("about-intro");

  const {
    panel,
    setPanel,
    showGrid,
    setShowGrid,
    showList,
    setShowList,
    activeFilter,
    setActiveFilter,
    openedCard,
    setOpenedCard,
    glowMode,
    setGlowMode,
    showSettings,
    setShowSettings,
  } = useUI();

  const [search, setSearch] = useState("");
  const openCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openedCard && openCardRef.current) {
      openCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [openedCard]);

  const query = search.toLowerCase().trim();
  const slugsSeen = new Set<string>();
  const displayed = (
    activeFilter === "all"
      ? items.filter((i) => i.isPrimary)
      : items.filter((i) => i.categories.includes(activeFilter))
  )
    .filter((i) => {
      if (slugsSeen.has(i.slug)) return false;
      slugsSeen.add(i.slug);
      return true;
    })
    .filter((i) => {
      if (!query) return true;
      return (
        i.title.toLowerCase().includes(query) ||
        (i.client ?? "").toLowerCase().includes(query) ||
        i.categories.some((c) =>
          (CATEGORY_LABELS[c] ?? c).toLowerCase().includes(query),
        )
      );
    })
    .sort((a, b) => {
      const labelA = (a.client ?? a.title).toLowerCase();
      const labelB = (b.client ?? b.title).toLowerCase();
      return labelA.localeCompare(labelB, "sv");
    });

  function handleFilterChange(cat: string) {
    setPanel("projects");
    setActiveFilter(cat);
    setOpenedCard(null);
    setSearch("");
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

  return (
    <div className="min-h-screen bg-background">
      <MultiNav />

      <AnimatePresence mode="wait">
        {panel === "showreel" && (
          <motion.div
            key="showreel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <VideoPlayer
              src="/multi_showreel_mobile.mp4"
              className="w-full h-dvh block lg:hidden"
            />
            <VideoPlayer
              src="/multi_showreel_desktop.mp4"
              className="w-full h-dvh hidden lg:block"
            />
          </motion.div>
        )}

        {panel === "projects" && (
          <motion.div
            key="projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Filters + view toggle */}
            <motion.div
              className="mt-[56px] lg:mt-[69px] px-4 pt-4 lg:pt-0 pb-4 text-2xl flex flex-col gap-y-4 font-rounded text-red-200 leading-tight w-full scroll-mt-[48px] "
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.05 },
                },
              }}
            >
              {/* Filter buttons + grid/list toggle row */}
              <div className="flex flex-col justify-start gap-x-1 items-baseline gap-y-0 text-red-300 py-0">
                {/* Grid / List toggle — before category buttons */}
                <div className="flex flex-wrap justify-start gap-x-1 items-baseline gap-y-0 max-w-xl text-red-300 py-0">
                  {["all", ...categories].map((cat, i) => (
                    <Fragment key={cat}>
                      {i > 0 && (
                        <motion.span variants={filterItemVariants}>
                          <Button
                            variant="link"
                            className="font-rounded text-2xl px-0 leading-tight pointer-events-none"
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
                            "font-rounded text-2xl inline px-0 leading-tight",
                            activeFilter === cat
                              ? "tracking-wide"
                              : "tracking-normal",
                          )}
                        >
                          {cat === "all"
                            ? "All"
                            : (CATEGORY_LABELS[cat] ?? cat)}
                        </Button>
                      </motion.span>
                    </Fragment>
                  ))}
                  <motion.span variants={filterItemVariants}>
                    <Button
                      variant="link"
                      className="font-rounded text-2xl px-0 leading-tight pointer-events-none mr-1"
                    >
                      /
                    </Button>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="bg-transparent outline-none font-rounded text-2xl py-0 h-auto text-neutral-300 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 w-32 transition-all duration-200"
                    />
                  </motion.span>
                </div>
                <motion.span className="" variants={filterItemVariants}>
                  <Button
                    variant={showSettings ? "glow" : "link"}
                    className="font-rounded text-2xl px-0 tracking-normal leading-tight mt-4"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    {showSettings ? "Hide settings" : "Settings"}
                  </Button>
                </motion.span>
              </div>

              {/* Settings row */}
              <AnimatePresence initial={false}>
                {showSettings && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="flex justify-start flex-wrap gap-x-1 items-baseline py-0 text-red-300 w-full"
                  >
                    <span className="flex items-baseline gap-1">
                      <Button
                        variant={showList ? "glow" : "link"}
                        className="font-rounded text-2xl px-0 leading-tight"
                        onClick={() => toggleView("list")}
                      >
                        List
                      </Button>
                      <Button
                        variant="link"
                        className="font-rounded text-2xl px-0 leading-tight pointer-events-none"
                      >
                        /
                      </Button>
                      <Button
                        variant={showGrid ? "glow" : "link"}
                        className="font-rounded text-2xl px-0 leading-tight"
                        onClick={() => toggleView("grid")}
                      >
                        Thumbnails
                      </Button>
                      <Button
                        variant="link"
                        className="font-rounded text-2xl px-0 leading-tight pointer-events-none"
                      >
                        /
                      </Button>
                      <Button
                        variant={glowMode ? "glow" : "link"}
                        className="font-rounded text-2xl px-0 leading-tight"
                        onClick={() => setGlowMode(true)}
                      >
                        Glow
                      </Button>
                      <Button
                        variant="link"
                        className="font-rounded text-2xl px-0 leading-tight pointer-events-none"
                      >
                        /
                      </Button>
                      <Button
                        variant={!glowMode ? "glow" : "link"}
                        className="font-rounded text-2xl px-0 leading-tight"
                        onClick={() => setGlowMode(false)}
                      >
                        Normal
                      </Button>
                    </span>
                    <Button
                      variant="link"
                      className="font-rounded text-2xl px-0 leading-tight pointer-events-none"
                    >
                      /
                    </Button>
                    <span>
                      <DarkModeButton className="font-rounded text-2xl tracking-normal gap-x-2" />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Grid view */}
            {showGrid && (
              <div className="columns-2 lg:columns-3 gap-2 px-2 pt-4">
                <AnimatePresence mode="popLayout" initial={false}>
                  {displayed.map((item, i) => {
                    const isOpen = item.slug === openedCard;

                    if (isOpen) {
                      return (
                        <motion.div
                          ref={openCardRef}
                          key={`card-${item.slug}`}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={
                            {
                              columnSpan: "all",
                              position: "relative",
                              zIndex: 10,
                            } as React.CSSProperties
                          }
                          className="mb-2 mt-2 max-w-5xl mx-auto scroll-mt-[48px] isolation-isolate"
                        >
                          <MultiCard
                            title={item.title}
                            client={item.client}
                            credits={item.credits}
                            categories={item.categories}
                            slug={item.slug}
                            projectImages={item.projectImages}
                            onClose={() => setOpenedCard(null)}
                          />
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={item.key}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: Math.min(i * 0.05, 0.4),
                          ease: "easeOut",
                        }}
                        className="relative break-inside-avoid mb-2 cursor-pointer group"
                        style={{
                          paddingBottom: `${(1 / item.aspectRatio) * 100}%`,
                        }}
                        onClick={() => setOpenedCard(item.slug)}
                      >
                        <div className="absolute inset-0">
                          <Image
                            src={item.url}
                            alt={item.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* List view */}
            {showList && (
              <motion.div
                className="flex flex-col px-4 pt-4 gap-y-1"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
                  },
                }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {displayed.map((item) => {
                    const isOpen = item.slug === openedCard;

                    if (isOpen) {
                      return (
                        <motion.div
                          ref={openCardRef}
                          key={`card-${item.slug}`}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="scroll-mt-[48px] relative z-10 max-w-5xl"
                        >
                          <MultiCard
                            title={item.title}
                            client={item.client}
                            credits={item.credits}
                            categories={item.categories}
                            slug={item.slug}
                            projectImages={item.projectImages}
                            onClose={() => setOpenedCard(null)}
                          />
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={item.key}
                        layout
                        variants={{
                          hidden: { opacity: 0, y: 4 },
                          show: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.25 }}
                      >
                        <Button
                          variant="glow"
                          className="font-rounded text-2xl px-0 leading-tight justify-start gap-1 tracking-normal"
                          onClick={() => setOpenedCard(item.slug)}
                        >
                          {item.client && <span>{item.client}</span>}
                          {item.client && item.title && (
                            <span className="">/</span>
                          )}
                          <span>{item.title}</span>
                        </Button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}

        {panel === "about" && (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pt-4 max-w-4xl mt-[69px] mx-auto scroll-mt-[48px]"
          >
            <p className="text-2xl font-rounded text-red-100 leading-tight [text-shadow:0_0_6px_#ef4444,0_0_16px_#ef4444,0_0_32px_#ef4444,0_0_60px_rgba(239,68,68,0.6)] [.no-glow_&]:text-red-500 [.no-glow_&]:[text-shadow:none]">
              {aboutText ?? ""}
            </p>
          </motion.div>
        )}

        {panel === "connect" && (
          <motion.div
            key="connect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 mt-[69px] pt-4 scroll-mt-[48px]"
          >
            <motion.p
              className="text-2xl font-rounded text-red-100 [text-shadow:0_0_6px_#ef4444,0_0_16px_#ef4444,0_0_32px_#ef4444,0_0_60px_rgba(239,68,68,0.6)] [.no-glow_&]:text-red-500 [.no-glow_&]:[text-shadow:none]"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.07 } },
              }}
            >
              {CONNECT_EMAIL.split("").map((char, i) => (
                <motion.span key={i} variants={charVariants}>
                  {char}
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomeClient() {
  return (
    <UIProvider>
      <HomeClientInner />
    </UIProvider>
  );
}
