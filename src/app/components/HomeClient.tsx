"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import MultiCard from "./MultiCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MultiNav from "./MultiNav";
import { UIProvider, useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import { useCopy } from "@/context/CopyContext";
import { X, ArrowRight } from "lucide-react";
import VideoPlayer from "./VideoPlayer";

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
  if (t < ANIM_SWEEP) return t > threshold ? letter : "M²";
  if (t < ANIM_SWEEP + ANIM_HOLD) return letter;
  if (t < ANIM_SWEEP * 2 + ANIM_HOLD)
    return t - ANIM_SWEEP - ANIM_HOLD > threshold ? "M²" : letter;
  return "M²";
}

function HomeClientInner() {
  const { items } = useWork();
  const aboutText = useCopy("about-intro");

  const {
    panel,
    showGrid,
    showList,

    activeFilter,
    openedCard,
    setOpenedCard,
    search,
    numCols,
  } = useUI();

  const navMt = panel !== "showreel" ? "mt-[var(--nav-height,0px)]" : "";

  const openCardRef = useRef<HTMLDivElement>(null);

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
            className={`${navMt}`}
          >
            {/* Grid view — unified with background */}
            {showGrid && (
              <div
                ref={gridRef}
                className="grid gap-2 px-2 pb-2 min-h-dvh"
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
                          className="col-span-full w-full rounded-lg lg:max-w-[560px] mt-0 mb-2  isolation-isolate"
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
                          className={`absolute inset-0 transition-colors duration-200 flex items-end justify-between p-2 group ${entry.item.slug === openedCard ? "bg-red-500" : "hover:bg-red-500"}`}
                        >
                          <Link
                            href={`/work/${entry.item.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-rounded text-base tracking-wide leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-200 line-clamp-2 text-neutral-300"
                          >
                            {entry.item.client
                              ? `${entry.item.client} / ${entry.item.title}`
                              : entry.item.title}
                          </Link>
                          <Link
                            href={`/work/${entry.item.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
                          >
                            <ArrowRight className="h-4 w-4 text-neutral-300" />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Empty interactive cells */}
                {Array.from({ length: numEmpty }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    data-empty-idx={i}
                    className="aspect-square cursor-pointer flex items-start justify-start p-1 font-rounded text-base lg:text-lg tracking-wide text-neutral-300 transition-colors hover:bg-white/10"
                  >
                    <span
                      className="font-ft88-gothique text-[0.5rem] mt-[0.15rem] lg:text-[0.6rem] lg:mt-[0.35rem] -ml-0.5 "
                      style={{
                        transform: "scaleX(1.75)",
                        display: "inline-block",
                        transformOrigin: "left",
                      }}
                    >
                      2
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* List view */}
            {showList && (
              <motion.div
                className="flex flex-col px-2 pt-0"
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

                    return (
                      <motion.div
                        key={item.key}
                        ref={isOpen ? openCardRef : undefined}
                        layout
                        variants={{
                          hidden: { opacity: 0, y: 4 },
                          show: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.25 }}
                        className="scroll-mt-[50vh]"
                      >
                        <span className="flex items-center justify-between w-full py-2">
                          <Button
                            variant={isOpen ? "link" : "nav"}
                            className="font-rounded px-0 leading-tight justify-start gap-1 tracking-normal"
                            onClick={() =>
                              setOpenedCard(isOpen ? null : item.slug)
                            }
                          >
                            {item.client && <span>{item.client}</span>}
                            {item.client && item.title && <span>/</span>}
                            {item.title && <span>{item.title}</span>}
                          </Button>
                          <span className="flex items-center gap-2 shrink-0 ml-auto">
                            {isOpen && (
                              <Button
                                variant="link"
                                onClick={() => setOpenedCard(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </span>
                        </span>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-0 max-w-5xl scroll-mt-[48px]"
                            >
                              <MultiCard
                                title={item.title}
                                client={item.client}
                                slug={item.slug}
                                description={item.description}
                                projectImages={item.projectImages}
                                onClose={() => setOpenedCard(null)}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="h-[1px] w-full bg-red-200 dark:bg-neutral-700 rounded-full" />
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
            className={`px-2 pt-2 max-w-4xl ${navMt}`}
          >
            <p className="text-base font-rounded text-red-500 leading-tight">
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
            className={`px-2 pt-2 max-w-4xl ${navMt}`}
          >
            <motion.p
              className="text-base font-rounded text-red-500"
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
