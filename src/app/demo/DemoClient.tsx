"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import MultiCard from "./MultiCard";
import ShowreelSlideshow from "./ShowreelSlideshow";
import { Button } from "@/components/ui/button";
import TextBlock from "./TextBlock";
import { cn } from "@/lib/utils";
import Loader from "./Loader";

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
    <div className="min-h-screen">
      <AnimatePresence>
        {!loaded && <Loader onDone={() => setLoaded(true)} />}
      </AnimatePresence>
      <div className="sticky z-20 left-0 top-0  w-full  px-4  h-auto pt-4 pb-4 h-">
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
              variant="link"
              className="font-rounded   text-red-500 hover:text-red-300 cursor-pointer gap-0 flex leading-tight"
              onClick={() => handleNavClick("showreel")}
            >
              Multi
              <span
                className="font-ft88-gothique text-base pr-1.5"
                style={{
                  transform: "scaleX(1.75)",
                  display: "inline-block",
                  transformOrigin: "left",
                }}
              >
                2
              </span>
            </Button>
          </motion.div>
          <motion.div
            layout
            className="flex items-baseline justify-start leading-tight"
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Button
              variant="link"
              className={cn(
                "font-rounded tracking-normal",
                panel === "projects" && "text-red-500",
              )}
              onClick={() => handleNavClick("projects")}
            >
              Work
            </Button>
            ,
            <Button
              variant="link"
              className={cn(
                "font-rounded ml-1 tracking-normal",
                panel === "about" && "text-red-500",
              )}
              onClick={() => handleNavClick("about")}
            >
              About
            </Button>
            ,
            <Button
              variant="link"
              className={cn(
                "font-rounded ml-1 tracking-normal",
                panel === "connect" && "text-red-500",
              )}
              onClick={() => handleNavClick("connect")}
            >
              Connect
            </Button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {panel === "showreel" && (
          <motion.div
            key="showreel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-4 mb-4 mx-auto max-w-xl">
              <ShowreelSlideshow images={showreelImages} />
            </div>
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
              className="px-4  pb-0 pt-4 text-2xl flex flex-wrap justify-start  font-rounded text-red-200 leading-tight w-full"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.05 },
                },
              }}
            >
              <div className="  text-red-300 rounded-2xl">
                {["all", ...categories].map((cat, i) => (
                  <motion.span key={cat} variants={filterItemVariants}>
                    <Button
                      variant="link"
                      onClick={() => handleFilterChange(cat)}
                      className={cn(
                        "font-rounded tracking-normal inline px-0 text-red-300 leading-tight  hover:text-red-500",
                        active === cat && "text-red-500",
                      )}
                    >
                      {cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
                    </Button>
                    {i !== categories.length && ","}{" "}
                  </motion.span>
                ))}

                <motion.span variants={filterItemVariants}>
                  ,{" "}
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent outline-none font-rounded text-2xl text-red-500 placeholder:text-red-300 w-32"
                  />
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
                        className="mb-2 mt-2 max-w-5xl mx-auto scroll-mt-[64px]"
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
            className="px-4 pt-4 max-w-4xl mx-auto scroll-mt-[64px]"
          >
            <TextBlock text={ABOUT_TEXT} size="text-2xl" />
          </motion.div>
        )}

        {panel === "connect" && (
          <motion.div
            key="connect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pt-4 scroll-mt-[56px]"
          >
            <motion.p
              className="text-2xl font-rounded text-red-500"
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
