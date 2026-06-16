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
import { getFilterDoneMs, getPostLoadFilterDoneMs } from "@/lib/navTiming";

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
    numCols,
    showReel,
    reelMode,
    notifyContentDone,
  } = useUI();

  const [revealed, setRevealed] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const hasRevealedRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => setTimerDone(true), 4000);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (items.length === 0 || !timerDone || hasRevealedRef.current) return;
    hasRevealedRef.current = true;
    setRevealed(true);
  }, [items.length, timerDone]);

  const [listVisible, setListVisible] = useState(false);
  const listRevealedRef = useRef(false);
  useEffect(() => {
    if (!revealed || panel !== "projects") {
      if (panel !== "projects") setListVisible(false);
      return;
    }
    const delay = listRevealedRef.current
      ? getFilterDoneMs(categories)
      : getPostLoadFilterDoneMs(categories);
    const t = setTimeout(() => {
      listRevealedRef.current = true;
      setListVisible(true);
      notifyContentDone();
    }, delay);
    return () => clearTimeout(t);
  }, [revealed, panel, categories, notifyContentDone]);

  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

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
    <motion.div
      className={`min-h-screen relative z-10 bg-background dark:bg-black `}
      animate={{ opacity: revealed ? 1 : 0 }}
      transition={{ duration: 0.6 }}
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
            className="fixed inset-0 z-50 pointer-events-none hidden lg:flex items-center px-8"
          >
            <div className="w-full max-w-7xl flex justify-center">
              <div className="relative w-[28vw] h-[33.3vh]">
                <Image
                  src={previewItem.url}
                  alt={previewItem.alt}
                  fill
                  className="object-contain object-center"
                  sizes="28vw"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Showreel — sticky so projects slides over it */}
      <div className="hidden relative h-dvh lg:h-[80dvh] w-full ">
        <VideoPlayer
          src="/multi_showreel_mobile.mp4"
          className="absolute inset-0 h-full w-full block lg:hidden "
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
        <div className="hidden lg:flex px-8 gap-3 mb-2 pt-[var(--nav-height)]">
          {listVisible && showList && (
            <div
              className={`${showGrid ? "w-2/3" : "w-full"} flex flex-col px-0 `}
            >
              {/* Header row */}

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
                      delay: idx * 0.07,
                    }}
                    className="w-full"
                  >
                    {group.items.length > 1 ? (
                      <div
                        className="flex justify-between gap-x-8 w-full py-1.5 px-0 items-baseline buttonTextSM"
                        onMouseLeave={() => setHoveredItem(null)}
                        onMouseMove={handleMouseMove}
                      >
                        <Link
                          href={`/projects/${group.items[0].slug}`}
                          className="buttonTextSM pl-0 uppercase shrink-0 text-liguriskt hover:text-lava transition-colors duration-200"
                          onMouseEnter={() =>
                            setHoveredItem(group.items[0].slug)
                          }
                        >
                          {group.client ?? ""}
                        </Link>
                        <span className="text-right flex flex-wrap justify-end">
                          {group.items.map((item, i) => (
                            <React.Fragment key={item.slug}>
                              <Link
                                href={`/projects/${item.slug}`}
                                className="buttonTextSM text-liguriskt hover:text-lava transition-colors duration-200"
                                onMouseEnter={() => setHoveredItem(item.slug)}
                              >
                                {item.title}
                              </Link>
                              {i < group.items.length - 1 && (
                                <span className="buttonTextSM text-liguriskt">
                                  {", "}
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </span>
                      </div>
                    ) : (
                      group.items.map((item, itemIdx) => (
                        <div
                          key={item.slug}
                          className="group flex justify-between gap-x-8 w-full py-1.5 px-0 items-baseline cursor-pointer buttonTextSM text-liguriskt hover:text-lava transition-colors duration-200"
                          onMouseEnter={() => setHoveredItem(item.slug)}
                          onMouseLeave={() => setHoveredItem(null)}
                          onMouseMove={handleMouseMove}
                        >
                          <Link
                            href={`/projects/${item.slug}`}
                            className="buttonTextSM pl-0 uppercase shrink-0"
                          >
                            {itemIdx === 0 ? (group.client ?? "") : ""}
                          </Link>
                          <Link
                            href={`/projects/${item.slug}`}
                            className="buttonTextSM text-right"
                          >
                            {item.title}
                          </Link>
                        </div>
                      ))
                    )}
                    <div className="border-b-[1.5px] border-b-liguriskt" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {listVisible && showGrid && (
            <div className="w-full pb-2 ">
              <div
                className="gap-x-2"
                style={{ columns: numCols, columnGap: "0.5rem" }}
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
                        delay: Math.min(idx * 0.07, 0.7),
                        ease: "easeOut",
                      }}
                      className="break-inside-avoid mb-2 relative cursor-pointer overflow-hidden transition-all duration-200 group  "
                      style={{ aspectRatio: item.aspectRatio }}
                      onClick={() => router.push(`/projects/${item.slug}`)}
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
                        delay: Math.min(idx * 0.07, 0.7),
                        ease: "easeOut",
                      }}
                      className="break-inside-avoid mb-2 relative cursor-pointer overflow-hidden"
                      style={{ aspectRatio: item.aspectRatio }}
                      onClick={() => router.push(`/projects/${item.slug}`)}
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
                        delay: idx * 0.07,
                      }}
                    >
                      <div className="w-full ">
                        {hasMultiple ? (
                          <button
                            className={`uppercase py-0 leading-tight transition-colors duration-200 buttonTextLG text-liguriskt hover:text-lava`}
                            onClick={() =>
                              setExpandedGroup(isExpanded ? null : group.key)
                            }
                          >
                            {label}
                          </button>
                        ) : (
                          <Link
                            href={`/projects/${group.items[0].slug}`}
                            className="buttonTextLG text-liguriskt hover:text-lava text-left py-0 uppercase block transition-colors duration-200"
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
                              className="overflow-hidden flex pb-0 flex-wrap items-start py-0 mb- buttonTextLG uppercase"
                            >
                              {group.items.map((item) => (
                                <Link
                                  key={item.slug}
                                  href={`/projects/${item.slug}`}
                                  className="buttonTextLG text-liguriskt hover:text-lava transition-colors duration-200"
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
    </motion.div>
  );
}

export default function HomeClient() {
  return <HomeClientInner />;
}
