"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import MultiCard from "./MultiCard";
import VideoPlayer from "./VideoPlayer";
import { Button } from "@/components/ui/button";
import TextBlock from "./TextBlock";
import { cn } from "@/lib/utils";
import Loader from "./Loader";
import TextDrop from "./TextDrop";
import DarkModeButton from "./DarkModeButton";

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

const ABOUT_TEXT =
  "Multi² is not your typical company. It’s a multiplier. This is the story of Adam and Daniel who found each other through a shared multidisciplinary mindset. Together, they don’t just double the output — they multiply it, exponentially. From global brands like IKEA to bold collaborations with Jureskog and ATG, we help brands move faster, think clearer, and create more with less.";

const CONNECT_EMAIL = "hello@multi2.co";

const charVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const filterItemVariants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export type GridItem = {
  key: string;
  url: string;
  alt: string;
  slug: string;
  title: string;
  client?: string;
  credits?: string;
  categories: string[];
  aspectRatio: number;
  isPrimary: boolean;
  projectImages: { key: string; url: string; aspectRatio: number }[];
};

type Panel = "showreel" | "projects" | "about" | "connect";

export default function DemoClient({
  items,
  categories,
}: {
  items: GridItem[];
  categories: string[];
}) {
  const [panel, setPanel] = useState<Panel>("showreel");
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [navExpanded, setNavExpanded] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const openCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openSlug && openCardRef.current) {
      openCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [openSlug]);

  function handleNavClick(p: Panel) {
    setPanel(p);
    setNavExpanded(true);
  }

  const slugsSeen = new Set<string>();
  const query = search.toLowerCase().trim();
  const displayed = (
    active === "all"
      ? items.filter((i) => i.isPrimary)
      : items.filter((i) => i.categories.includes(active))
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
    });

  const showreelImages = items
    .filter((i) => i.isPrimary)
    .slice(0, 3)
    .map((i) => ({ key: i.key, url: i.url, aspectRatio: i.aspectRatio }));

  function handleFilterChange(cat: string) {
    setPanel("projects");
    setActive(cat);
    setSearch("");
    setOpenSlug(null);
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {!loaded && <Loader onDone={() => setLoaded(true)} />}
      </AnimatePresence>
      <motion.div
        className="fixed z-20 top-0 left-0 right-0 px-4 pt-4 pb-2"
        transition={{ duration: 0.4 }}
      >
        <div
          className={cn(
            "flex flex-row items-center font-rounded text-2xl text-red-200 h-full",
            navExpanded ? "justify-between" : "justify-center gap-x-4",
          )}
        >
          <motion.div
            layout
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Button
              variant="glow"
              className="font-rounded cursor-pointer gap-0 flex leading-tight tracking-normal text-red-100"
              onClick={() => handleNavClick("showreel")}
            >
              Multi²
              {/* <span
                className="font-ft88-gothique text-base pr-1.5"
                style={{
                  transform: "scaleX(1.75)",
                  display: "inline-block",
                  transformOrigin: "left",
                }}
              >
                2
              </span> */}
            </Button>
          </motion.div>
          <motion.div
            layout
            className="flex items-baseline justify-start gap-x-[9px] leading-tight"
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Button
              variant={panel === "projects" ? "glow" : "link"}
              className={cn(
                "font-rounded",
                panel === "projects" ? "tracking-wide" : "tracking-tight",
              )}
              onClick={() => handleNavClick("projects")}
            >
              Work
            </Button>
            <Button
              variant={panel === "about" ? "glow" : "link"}
              className={cn(
                "font-rounded ml-1",
                panel === "about" ? "tracking-wide" : "tracking-tight",
              )}
              onClick={() => handleNavClick("about")}
            >
              About
            </Button>
            <Button
              variant={panel === "connect" ? "glow" : "link"}
              className={cn(
                "font-rounded ml-1",
                panel === "connect" ? "tracking-wide" : "tracking-tight",
              )}
              onClick={() => handleNavClick("connect")}
            >
              Connect
            </Button>
          </motion.div>
        </div>
      </motion.div>

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
            <motion.div
              className="mt-[56px] lg:mt-[69px] px-4  pb-0 pt-2 text-2xl flex flex-wrap justify-start  font-rounded text-red-200 leading-tight w-full scroll-mt-[48px]"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.05 },
                },
              }}
            >
              <div className="flex flex-wrap justify-between gap-x-[9px]  items-baseline gap-y-0 text-red-300 w-full">
                {["all", ...categories].map((cat, i) => (
                  <motion.span
                    className="flex items-baseline gap-x-1 "
                    key={cat}
                    variants={filterItemVariants}
                  >
                    {active === cat && (
                      <div
                        className="w-4 h-4 rounded-full bg-red-100 shrink-0 self-center"
                        style={{
                          boxShadow:
                            "0 0 6px #ef4444, 0 0 16px #ef4444, 0 0 32px rgba(239,68,68,0.6)",
                        }}
                      />
                    )}
                    <Button
                      variant={active === cat ? "glow" : "link"}
                      onClick={() => handleFilterChange(cat)}
                      className={cn(
                        "font-rounded text-2xl inline px-0 leading-tight",
                        active === cat ? "tracking-wide" : "tracking-normal",
                      )}
                    >
                      {cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
                    </Button>{" "}
                  </motion.span>
                ))}

                <motion.span variants={filterItemVariants}>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent outline-none font-rounded text-2xl  py-0 h-auto text-red-200 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 w-32 focus:[text-shadow:0_0_6px_#ef4444,0_0_16px_#ef4444,0_0_32px_#ef4444,0_0_60px_rgba(239,68,68,0.6)] transition-all duration-200"
                  />
                </motion.span>
                <motion.span variants={filterItemVariants}>
                  <DarkModeButton className="font-rounded text-2xl  tracking-normal gap-x-2" />
                </motion.span>
              </div>
            </motion.div>

            <div className="columns-2 lg:columns-3 gap-2 px-2 pt-2">
              <AnimatePresence mode="popLayout" initial={false}>
                {displayed.map((item, i) => {
                  const isOpen = item.slug === openSlug;

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
                        style={{ columnSpan: "all" } as React.CSSProperties}
                        className="mb-2 mt-2 max-w-5xl mx-auto  scroll-mt-[48px]"
                      >
                        <MultiCard
                          title={item.title}
                          client={item.client}
                          credits={item.credits}
                          categories={item.categories}
                          slug={item.slug}
                          projectImages={item.projectImages}
                          onClose={() => setOpenSlug(null)}
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
                      onClick={() => setOpenSlug(item.slug)}
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
            <TextBlock text={ABOUT_TEXT} size="text-xl" />
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
              className="text-2xl font-rounded  text-red-100 [text-shadow:0_0_6px_#ef4444,0_0_16px_#ef4444,0_0_32px_#ef4444,0_0_60px_rgba(239,68,68,0.6)]"
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
