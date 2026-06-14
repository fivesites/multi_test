"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import MultiCard from "./MultiCard";
import Link from "next/link";
import MultiNav from "./MultiNav";
import { UIProvider, useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import { useCopyEntry, useCopyBody } from "@/context/CopyContext";
import { useRouter } from "next/navigation";
import VideoPlayer from "./VideoPlayer";
import AboutSectionText from "./AboutSectionText";
import ConnectSection from "./ConnectSection";
import MultiFooter from "./MultiFooter";
import { getNavTypingDelayMs, getFilterDoneMs } from "@/lib/navTiming";

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

function HomeClientInner() {
  const { items, categories } = useWork();
  const aboutEntry = useCopyEntry("about-intro");
  const aboutBody = useCopyBody("about-intro");

  const {
    panel,
    showGrid,
    showList,
    activeFilter,
    openedCard,
    setOpenedCard,
    search,
    setSearch,
    numCols,
    showReel,
    reelMode,
  } = useUI();

  const navDelaySec = getNavTypingDelayMs(categories) / 1000;
  const isInitialMount = useRef(true);
  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  const [listVisible, setListVisible] = useState(false);
  useEffect(() => {
    if (panel !== "projects") {
      setListVisible(false);
      return;
    }
    const t = setTimeout(
      () => setListVisible(true),
      getFilterDoneMs(categories),
    );
    return () => clearTimeout(t);
  }, [panel, categories]);

  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const openCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openedCard && openCardRef.current && showList) {
      openCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [openedCard, showList]);

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

  type DisplayedItem = (typeof displayed)[number];
  type ClientGroup = {
    key: string;
    client: string | undefined;
    items: DisplayedItem[];
  };
  const grouped: ClientGroup[] = [];
  const groupMap = new Map<string, ClientGroup>();
  for (const item of displayed) {
    const groupKey = item.client ?? item.slug;
    if (groupMap.has(groupKey)) {
      groupMap.get(groupKey)!.items.push(item);
    } else {
      const group: ClientGroup = {
        key: groupKey,
        client: item.client,
        items: [item],
      };
      grouped.push(group);
      groupMap.set(groupKey, group);
    }
  }

  type GridItem = (typeof displayed)[number];
  type GridEntry =
    | { type: "image"; item: GridItem; idx: number }
    | { type: "card"; item: GridItem };

  const gridItems: GridEntry[] = [];
  for (let i = 0; i < displayed.length; i += numCols) {
    const row = displayed.slice(i, i + numCols);
    row.forEach((item, colIdx) =>
      gridItems.push({ type: "image", item, idx: i + colIdx }),
    );
    const openedInRow = row.find((item) => item.slug === openedCard);
    if (openedInRow) gridItems.push({ type: "card", item: openedInRow });
  }

  const previewItem = hoveredItem
    ? displayed.find((i) => i.slug === hoveredItem)
    : null;

  return (
    <div
      className={`min-h-screen relative z-10 ${showReel && reelMode === "background" ? "bg-transparent" : "bg-background"}`}
    >
      <MultiNav />

      {/* Preview overlay — desktop list-only mode */}
      <AnimatePresence>
        {showList && !showGrid && previewItem && (
          <motion.div
            key={previewItem.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 pointer-events-none hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[50vw] h-[33.3vh]">
              <Image
                src={previewItem.url}
                alt={previewItem.alt}
                fill
                className="object-contain"
                sizes="50vw"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel overlays — About and Connect sit above Projects */}
      <AnimatePresence mode="wait">
        {panel === "about" && (
          <motion.div
            key="about-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[var(--nav-height)] z-10 overflow-y-auto bg-background"
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
            className="fixed inset-x-0 bottom-0 top-[var(--nav-height)] z-10 bg-background"
          >
            <ConnectSection />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Showreel — sticky so projects slides over it */}
      <div className="hidden relative h-dvh lg:h-[80dvh] w-full ">
        <VideoPlayer
          src="/multi_showreel_mobile.mp4"
          className="absolute inset-0 h-full w-full block lg:hidden invert"
        />
        <VideoPlayer
          src="/multi_showreel_desktop.mp4"
          className="absolute inset-0 h-full w-full hidden lg:block "
        />
      </div>

      {/* Projects — slides over showreel */}
      <div
        id="projects"
        className={`relative min-h-[100dvh] ${showReel && reelMode === "background" ? "" : "bg-background"}`}
      >
        {/* Gradient fade from transparent (showreel visible) to background */}
        {/* <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-transparent to-background pointer-events-none" /> */}
        {/* Desktop: list + thumbnails side by side */}
        <div className="hidden lg:flex px-8 gap-3 mb-2 pt-[var(--nav-height)]">
          {listVisible && showList && (
            <div
              className={`${showGrid ? "w-2/3" : "w-full"} flex flex-col px-0`}
            >
              {/* Header row */}
              <div className="grid grid-cols-6 w-full py-1 pl-4 text-xl lg:text-lg font-medium font-visual text-lyx border-b-2 border-lyx">
                <span className="col-span-2">Client</span>
                <span className={showGrid ? "col-span-3" : "col-span-2"}>
                  Title
                </span>
                {!showGrid && <span className="col-span-1">Categories</span>}
                <span className="text-right">Year</span>
              </div>

              <AnimatePresence mode="popLayout">
                {grouped.map((group, idx) => (
                  <motion.div
                    key={group.key}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: isInitialMount.current
                        ? navDelaySec + idx * 0.04
                        : idx * 0.04,
                    }}
                    className="w-full"
                  >
                    {group.items.map((item, itemIdx) => {
                      const isActive = hoveredItem === item.slug;
                      return (
                        <div
                          key={item.slug}
                          className={`grid grid-cols-6 items-start w-full py-2 px-0 font-medium transition-colors duration-200 cursor-pointer ${group.items.length > 1 && itemIdx < group.items.length - 1 ? "border-b-2 border-lyx" : ""} ${isActive ? "text-lava" : "text-lyx"}`}
                          onMouseEnter={() => setHoveredItem(item.slug)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <span className="uppercase font-visual lg:text-4xl col-span-2 transition-colors duration-200">
                            {itemIdx === 0 ? (group.client ?? "") : ""}
                          </span>
                          <Link
                            href={`/work/${item.slug}`}
                            className={`font-visual text-4xl  font-medium transition-colors duration-200 ${showGrid ? "col-span-3" : "col-span-2"}`}
                          >
                            {item.title}
                          </Link>
                          {!showGrid && (
                            <span className="font-visual text-sm tracking-normal font-medium uppercase transition-colors duration-200 line-clamp-2">
                              {item.categories
                                .map((c) => CATEGORY_LABELS[c] ?? c)
                                .join(", ")}
                            </span>
                          )}
                          <span className="font-visual text-right text-lg transition-colors duration-200">
                            {item.year ?? ""}
                          </span>
                        </div>
                      );
                    })}
                    <div className="border-b-2 border-b-lyx" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {listVisible && showGrid && (
            <div className={`w-full  pb-2 ${showList ? "" : ""}`}>
              <div className="grid grid-cols-6 gap-2 max-w-5xl">
                <AnimatePresence mode="popLayout" initial={false}>
                  {displayed.map((item, idx) => (
                    <motion.div
                      key={item.key}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.35,
                        delay:
                          (isInitialMount.current ? navDelaySec : 0) +
                          Math.min(idx * 0.05, 0.4),
                        ease: "easeOut",
                      }}
                      className="aspect-square relative cursor-pointer overflow-hidden transition-all duration-200 group border-transparent border-3 hover:border-lava"
                      onClick={() => router.push(`/work/${item.slug}`)}
                    >
                      <Image
                        src={item.url}
                        alt={item.alt}
                        fill
                        className="object-cover"
                        sizes="12vw"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Mobile: grid or list toggle */}
        <div className="lg:hidden min-h-[65vh] mx-0 pt-[var(--nav-height)]">
          {listVisible && showGrid && (
            <>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none font-visual text-xl lg:text-lg font-medium text-center justify-center leading-tight tracking-normal pb-1 h-auto border-liguriskt text-lava placeholder:text-lava w-full px-2"
              />
              <div
                className="pt-4 gap-2 grid"
                style={{
                  gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
                }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {gridItems.map((entry) => {
                    if (entry.type === "card") {
                      return (
                        <motion.div
                          ref={openCardRef}
                          key={`card-${entry.item.slug}`}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="col-span-full w-full rounded-lg lg:max-w-[560px] mt-0 mb-2 isolation-isolate"
                        >
                          <MultiCard
                            title={entry.item.title}
                            client={entry.item.client}
                            slug={entry.item.slug}
                            description={entry.item.description}
                            projectImages={entry.item.projectImages}
                            onClose={() => setOpenedCard(null)}
                          />
                        </motion.div>
                      );
                    }
                    return (
                      <motion.div
                        key={entry.item.key}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.35,
                          delay:
                            (isInitialMount.current ? navDelaySec : 0) +
                            Math.min(entry.idx * 0.05, 0.4),
                          ease: "easeOut",
                        }}
                        className="aspect-square relative cursor-pointer overflow-hidden transition-all duration-200"
                        onClick={() =>
                          setOpenedCard(
                            entry.item.slug === openedCard
                              ? null
                              : entry.item.slug,
                          )
                        }
                      >
                        <Image
                          src={entry.item.url}
                          alt={entry.item.alt}
                          fill
                          className="object-cover"
                          sizes={`${Math.floor(100 / numCols)}vw`}
                        />
                        <div className="absolute inset-0 transition-colors duration-200 flex items-center hover:bg-lyx justify-center p-2 group">
                          <Link
                            href={`/work/${entry.item.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-visual text-xl font-medium lg:text-2xl tracking-normal justify-center leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-200 line-clamp-2 text-background"
                          >
                            {entry.item.client}
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          )}

          {listVisible && showList && (
            <div className="flex flex-col px-8 border-t-2 border-lyx pt-2">
              <AnimatePresence mode="popLayout">
                {grouped.map((group, idx) => {
                  const hasMultiple = group.items.length > 1;
                  const isExpanded = expandedGroup === group.key;
                  const label = group.client ?? group.items[0].title;
                  return (
                    <motion.div
                      key={group.key}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: isInitialMount.current
                          ? navDelaySec + idx * 0.04
                          : idx * 0.04,
                      }}
                    >
                      <div className="w-full py-0 ">
                        {hasMultiple ? (
                          <button
                            className={`  font-visual uppercase text-3xl lg:text-4xl font-medium  border-b-lyx   py-0 leading-tight transition-colors duration-200 ${isExpanded ? "text-lava" : "text-lyx hover:text-lava active:text-lava"}`}
                            onClick={() =>
                              setExpandedGroup(isExpanded ? null : group.key)
                            }
                          >
                            {label}
                          </button>
                        ) : (
                          <Link
                            href={`/work/${group.items[0].slug}`}
                            className=" font-visual  font-medium uppercase text-3xl lg:text-4xl text-left py-0 leading-tight text-lyx hover:text-lava  block transition-colors duration-200"
                          >
                            {label}
                          </Link>
                        )}
                        <AnimatePresence initial={false}>
                          {hasMultiple && isExpanded && (
                            <motion.div
                              key="dropdown"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden  flex pb-0 flex-col items-start py-0 mb-1 px-8"
                            >
                              {group.items.map((item) => (
                                <Link
                                  key={item.slug}
                                  href={`/work/${item.slug}`}
                                  className="font-visual text-xl lg:text-2xl text-lyx text-left hover:text-lava font-medium  leading-tighttransition-colors duration-200"
                                >
                                  {item.title}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
        <MultiFooter />
      </div>
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
