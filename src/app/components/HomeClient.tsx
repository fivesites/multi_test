"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import { useRouter } from "next/navigation";
import VideoPlayer from "./VideoPlayer";
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

  const {
    panel,
    showGrid,
    showList,
    activeFilter,
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

  const previewItem = hoveredItem
    ? displayed.find((i) => i.slug === hoveredItem)
    : null;

  return (
    <div
      className={`min-h-screen relative z-10 bg-background dark:bg-lader text-lader`}
    >
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
              <div className="grid grid-cols-6 w-full py-1 text-xl lg:text-lg font-medium font-visual text-lader dark:text-liguriskt border-b-2 border-liguriskt">
                <span className="col-span-2 pl-4">Client</span>
                <span
                  className={`${showGrid ? "col-span-3" : "col-span-2"} pl-4`}
                >
                  Title
                </span>
                {!showGrid && (
                  <span className="col-span-1 pl-4">Categories</span>
                )}
                <span className="pl-4 text-right pr-0">Year</span>
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
                          className={`grid grid-cols-6 items-start w-full py-2 px-0 font-medium transition-colors duration-200 cursor-pointer ${isActive ? "text-lava" : "text-liguriskt dark:text-lax"}`}
                          onMouseEnter={() => setHoveredItem(item.slug)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <span className="uppercase font-visual leading-tight lg:text-4xl col-span-2 pl-4 transition-colors duration-200">
                            {itemIdx === 0 ? (group.client ?? "") : ""}
                          </span>
                          <Link
                            href={`/work/${item.slug}`}
                            className={`font-visual text-4xl font-medium pl-4 transition-colors duration-200 ${showGrid ? "col-span-3" : "col-span-2"}`}
                          >
                            {item.title}
                          </Link>
                          {!showGrid && (
                            <span className="font-visual text-lg tracking-normal font-medium pl-4 transition-colors duration-200 line-clamp-2">
                              {item.categories
                                .map((c) => CATEGORY_LABELS[c] ?? c)
                                .join(", ")}
                            </span>
                          )}
                          <span className="font-visual text-right text-lg pl-4 transition-colors duration-200">
                            {item.year ?? ""}
                          </span>
                        </div>
                      );
                    })}
                    <div className="border-b-2 border-b-liguriskt dark:border-b-lax" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {listVisible && showGrid && (
            <div className="w-full pb-2">
              <div
                className="gap-x-2"
                style={{ columns: showList ? 3 : 5, columnGap: "0.5rem" }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {displayed.map((item, idx) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.35,
                        delay:
                          (isInitialMount.current ? navDelaySec : 0) +
                          Math.min(idx * 0.05, 0.4),
                        ease: "easeOut",
                      }}
                      className="break-inside-avoid mb-2 relative cursor-pointer overflow-hidden transition-all duration-200 group border-transparent border-3 hover:border-lava"
                      style={{ aspectRatio: item.aspectRatio }}
                      onClick={() => router.push(`/work/${item.slug}`)}
                    >
                      <Image
                        src={item.url}
                        alt={item.alt}
                        fill
                        className="object-cover"
                        sizes="20vw"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Mobile: grid or list toggle */}
        <div className="lg:hidden min-h-[65vh]  pt-[var(--nav-height)]">
          {listVisible && showGrid && (
            <>
              <div
                className=" pb-16 px-8"
                style={{ columns: numCols, columnGap: "0.5rem" }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {displayed.map((item, idx) => (
                    <motion.div
                      key={item.key}
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
                      className="break-inside-avoid mb-2 relative cursor-pointer overflow-hidden"
                      style={{ aspectRatio: item.aspectRatio }}
                      onClick={() => router.push(`/work/${item.slug}`)}
                    >
                      <Image
                        src={item.url}
                        alt={item.alt}
                        fill
                        className="object-cover"
                        sizes={`${Math.floor(100 / numCols)}vw`}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {listVisible && showList && (
            <div className="flex flex-col px-8 ">
              <div className="border-t-2 border-lyx  w-full hidden" />
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
                      <div className="w-full ">
                        {hasMultiple ? (
                          <button
                            className={`  font-visual uppercase text-3xl lg:text-4xl font-medium  border-b-lyx   py-0 leading-tight transition-colors duration-200 ${isExpanded ? "text-lava" : "text-liguriskt dark:text-lax hover:text-lava active:text-lava"}`}
                            onClick={() =>
                              setExpandedGroup(isExpanded ? null : group.key)
                            }
                          >
                            {label}
                          </button>
                        ) : (
                          <Link
                            href={`/work/${group.items[0].slug}`}
                            className=" font-visual  font-medium uppercase text-3xl lg:text-4xl text-left py-0 leading-tight text-liguriskt dark:text-lax hover:text-lava  block transition-colors duration-200"
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
                                  className="font-visual text-xl lg:text-2xl text-liguriskt dark:text-lax text-left hover:text-lava font-medium leading-tight transition-colors duration-200"
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
  return <HomeClientInner />;
}
