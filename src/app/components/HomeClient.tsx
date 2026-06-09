"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import MultiCard from "./MultiCard";
import Link from "next/link";
import MultiNav from "./MultiNav";
import { UIProvider, useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import { useCopy } from "@/context/CopyContext";
import { useRouter } from "next/navigation";
import VideoPlayer from "./VideoPlayer";
import AboutSectionText from "./AboutSectionText";
import MultiFooter from "./MultiFooter";

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

// MULTISQUARED animation for empty grid cells
const ANIM_WORD = "MULTISQUARED";
const ANIM_SWEEP = 2400;
const ANIM_HOLD = 1000;
const ANIM_CYCLE = ANIM_SWEEP * 2 + ANIM_HOLD * 2;
const ANIM_MAX = 400;

function getEmptyChar(idx: number, elapsed: number): string {
  const t = elapsed % ANIM_CYCLE;
  const threshold = (idx / ANIM_MAX) * ANIM_SWEEP;
  const letter = ANIM_WORD[idx % ANIM_WORD.length];
  if (t < ANIM_SWEEP) return t > threshold ? letter : "²";
  if (t < ANIM_SWEEP + ANIM_HOLD) return letter;
  if (t < ANIM_SWEEP * 2 + ANIM_HOLD)
    return t - ANIM_SWEEP - ANIM_HOLD > threshold ? "²" : letter;
  return "²";
}

function HomeClientInner() {
  const { items } = useWork();
  const aboutText = useCopy("about-intro");

  const {
    panel,
    setPanel,
    showGrid,
    showList,
    activeFilter,
    openedCard,
    setOpenedCard,
    search,
    setSearch,
    numCols,
    setHeroInView,
    aboutRef,
  } = useUI();

  const router = useRouter();
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const openCardRef = useRef<HTMLDivElement>(null);
  const [aboutEl, setAboutEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (panel !== "projects" || !aboutEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -50% 0px" },
    );
    observer.observe(aboutEl);
    return () => observer.disconnect();
  }, [panel, aboutEl, setHeroInView]);

  useEffect(() => {
    if (panel !== "projects") setHeroInView(false);
  }, [panel, setHeroInView]);

  useEffect(() => {
    if (panel !== "showreel") return;
    let touchStartY = 0;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) setPanel("projects");
    };
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY - e.changedTouches[0].clientY > 40) setPanel("projects");
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [panel, setPanel]);

  useEffect(() => {
    if (panel !== "projects") return;
    let touchStartY = 0;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0 && window.scrollY === 0) setPanel("showreel");
    };
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (
        e.changedTouches[0].clientY - touchStartY > 40 &&
        window.scrollY === 0
      )
        setPanel("showreel");
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [panel, setPanel]);

  useEffect(() => {
    if (openedCard && openCardRef.current && showList) {
      openCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [openedCard, showList]);

  const [numEmpty, setNumEmpty] = useState(40);

  useEffect(() => {
    const update = () => {
      const gap = 8;
      const cellSize = (window.innerWidth - gap * (numCols + 1)) / numCols;
      const viewportRows = Math.ceil(window.innerHeight / (cellSize + gap));
      setNumEmpty(Math.min(ANIM_MAX, (viewportRows + 2) * numCols));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [numCols]);

  // Animate empty cells
  const gridRef = useRef<HTMLDivElement>(null);
  const emptyStateRef = useRef<string[]>(Array(ANIM_MAX).fill("M²"));

  useEffect(() => {
    const container = gridRef.current;
    if (!container || !showGrid) return;
    const start = performance.now();
    let rafId: number;
    const frame = (now: number) => {
      const elapsed = now - start;
      const cells = container.querySelectorAll<HTMLElement>("[data-empty-idx]");
      cells.forEach((cell) => {
        const idx = Number(cell.dataset.emptyIdx);
        const next = getEmptyChar(idx, elapsed);
        if (emptyStateRef.current[idx] !== next) {
          emptyStateRef.current[idx] = next;
          cell.textContent = next;
        }
      });
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [showGrid]);

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
    <div className="min-h-screen bg-background">
      <MultiNav />

      {/* Centered preview overlay — desktop list-only mode */}
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
            <div className="relative w-[50vw] h-[60vh]">
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
            className={``}
          >
            {/* Desktop: list + thumbnails side by side */}
            <div className="hidden lg:flex min-h-[100vh] px-6 gap-3">
              {/* List */}
              {showList && (
                <motion.div
                  className={`${showGrid ? "w-2/3" : "w-full"} flex flex-col px-0  lg:mt-[45vh] `}
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: 0.04,
                        delayChildren: 0.05,
                      },
                    },
                  }}
                >
                  {!showGrid && (
                    <>
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="hidden bg-transparent outline-none font-visual text-xl lg:text-lg font-medium leading-tight tracking-normal pb-1  h-auto border-b-2 border-lyx text-lyx placeholder:text-lyx w-full px-2"
                      />
                    </>
                  )}
                  {/* Header row */}
                  <div className="grid grid-cols-6 w-full py-0 pl-4 text-xl lg:text-lg font-medium font-visual text-lyx border-b-2 border-lyx  ">
                    <span className="col-span-2">Client</span>
                    <span className={showGrid ? "col-span-3" : "col-span-2"}>
                      Title
                    </span>
                    {!showGrid && (
                      <span className="col-span-1">Categories</span>
                    )}
                    <span className="text-right">Year</span>
                  </div>

                  <AnimatePresence mode="popLayout" initial={false}>
                    {grouped.map((group) => (
                      <motion.div
                        key={group.key}
                        layout
                        variants={{
                          hidden: { opacity: 0, y: 4 },
                          show: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.25 }}
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
                                className={`font-visual text-4xl uppercase font-medium transition-colors duration-200 ${showGrid ? "col-span-3" : "col-span-2"}`}
                              >
                                {item.title}
                              </Link>
                              {!showGrid && (
                                <span className="font-visual text-lg font-medium uppercase transition-colors duration-200">
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
                </motion.div>
              )}

              {/* Thumbnails */}
              {showGrid && (
                <div className={`w-full px-2 pb-2 mt-[45vh] ${showList ? "lg:mt-[45vh]" : "lg:mt-[var(--nav-height)]"}`}>
                  <div className="grid grid-cols-6 gap-2">
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
                            delay: Math.min(idx * 0.05, 0.4),
                            ease: "easeOut",
                          }}
                          className="aspect-square relative cursor-pointer overflow-hidden transition-all duration-200"
                          onClick={() => router.push(`/work/${item.slug}`)}
                          onMouseEnter={() =>
                            setHoveredGroup(item.client ?? item.slug)
                          }
                          onMouseLeave={() => setHoveredGroup(null)}
                        >
                          <Image
                            src={item.url}
                            alt={item.alt}
                            fill
                            className="object-cover"
                            sizes="12vw"
                          />
                          <div
                            className={`absolute inset-0 transition-colors duration-200 flex items-end justify-between p-2 ${hoveredGroup === (item.client ?? item.slug) ? "bg-lava" : ""}`}
                          >
                            <span
                              className={`font-visual font-bold text-base uppercase lg:text-base tracking-normal leading-tight transition-opacity duration-200 line-clamp-2 text-background ${hoveredGroup === (item.client ?? item.slug) ? "opacity-100" : "opacity-0"}`}
                            >
                              {item.client
                                ? `${item.client}, ${item.title}`
                                : item.title}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile: grid or list toggle */}
            <div className="lg:hidden mt-[45vh] min-h-[65vh] px-4 ">
              {showGrid && (
                <>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent outline-none font-visual text-xl lg:text-lg font-medium text-center justify-center leading-tight tracking-normal pb-1  h-auto border-b-2 border-lyx text-lyx placeholder:text-lyx  w-full px-2"
                  />

                  <div
                    ref={gridRef}
                    className="pt-4 gap-2 grid  "
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
                              delay: Math.min(entry.idx * 0.05, 0.4),
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
                            <div
                              className={`absolute inset-0 transition-colors duration-200 flex items-center  hover:bg-lyx justify-center p-2 group  `}
                            >
                              <Link
                                href={`/work/${entry.item.slug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="font-visual  text-lg font-medium lg:text-2xl tracking-normal 
                                justify-center leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-200 line-clamp-2 text-background"
                              >
                                {entry.item.client}
                              </Link>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {Array.from({ length: numEmpty }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        data-empty-idx={i}
                        className="aspect-square cursor-pointer flex items-center justify-center p-1 font-visual leading-tight text-lg font-medium text-neutral-100 transition-colors hover:bg-white/10"
                      >
                        ²
                      </div>
                    ))}
                  </div>
                </>
              )}

              {showList && (
                <motion.div
                  className="flex flex-col px-4 mt-[45vh]"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: 0.04,
                        delayChildren: 0.05,
                      },
                    },
                  }}
                >
                  <div>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search projects..."
                      className="bg-transparent outline-none font-visual text-xl lg:text-2xl  justify-center text-center px-2 py-2 mb-2 font-medium leading-tight border-b-2 border-b-lyx text-lax  placeholder:text-lyx  w-full"
                    />
                  </div>

                  <AnimatePresence mode="popLayout" initial={false}>
                    {grouped.map((group) => {
                      const hasMultiple = group.items.length > 1;
                      const isExpanded = expandedGroup === group.key;
                      const label = group.client ?? group.items[0].title;
                      return (
                        <motion.div
                          key={group.key}
                          layout
                          variants={{
                            hidden: { opacity: 0, y: 4 },
                            show: { opacity: 1, y: 0 },
                          }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="w-full py-0">
                            {hasMultiple ? (
                              <button
                                className={`uppercase font-visual text-4xl font-medium w-full text-center py-0 transition-colors duration-200 ${isExpanded ? "text-lava" : "text-lyx hover:text-lax active:text-lava"}`}
                                onClick={() =>
                                  setExpandedGroup(
                                    isExpanded ? null : group.key,
                                  )
                                }
                              >
                                {label}
                              </button>
                            ) : (
                              <Link
                                href={`/work/${group.items[0].slug}`}
                                className="uppercase font-visual text-4xl text-center py-0 text-lyx hover:text-lax font-medium block transition-colors duration-200"
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
                                  transition={{
                                    duration: 0.2,
                                    ease: "easeInOut",
                                  }}
                                  className="overflow-hidden flex pb-2 flex-col items-center   py-0 "
                                >
                                  {group.items.map((item) => (
                                    <Link
                                      key={item.slug}
                                      href={`/work/${item.slug}`}
                                      className="font-visual text-xl text-lava hover:text-liguriskt font-medium  transition-colors duration-200"
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
                </motion.div>
              )}
            </div>
            <div
              className="min-h-[200vh]"
              ref={(el) => {
                setAboutEl(el);
                (
                  aboutRef as React.MutableRefObject<HTMLDivElement | null>
                ).current = el;
              }}
            >
              <AboutSectionText text={aboutText ?? ""} />
            </div>
            <MultiFooter />
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
