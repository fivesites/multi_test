"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import ProjectCard from "@/app/components/ProjectCard";
import FeaturedCard from "@/app/components/FeaturedCard";
import CategoryFilters from "@/app/components/CategoryFilters";
import FilterOverlay from "@/app/components/FilterOverlay";
import { getFilterDoneMs, getPostLoadFilterDoneMs } from "@/lib/navTiming";
import { getActiveFilterLabel, getCategoryLabel } from "@/lib/categories";
import LandningBlock from "@/app/components/LandningBlock";
import TypedHeading from "@/app/components/TypedHeading";
import CheckButton from "@/app/components/CheckButton";
import IconButton from "@/app/components/IconButton";
import Footer from "@/app/components/Footer";

export default function AllProjectsPageClient() {
  const { items, categories } = useWork();
  const lenis = useLenis();
  const {
    showGrid,
    showList,
    activeFilter,
    search,
    notifyContentDone,
    setOpenedCard,
    numCols,
    navLoading,
    filtersOpen,
    setFiltersOpen,
  } = useUI();

  // Coming back from a project: drop the opened card so its tile isn't still
  // showing the centred hand-off label.
  useEffect(() => {
    setOpenedCard(null);
  }, [setOpenedCard]);

  // The list waits for the category column to finish typing itself in, so the
  // two don't animate over each other.
  const [listVisible, setListVisible] = useState(false);
  const listRevealedRef = useRef(false);
  useEffect(() => {
    const delay = listRevealedRef.current
      ? getFilterDoneMs(categories)
      : getPostLoadFilterDoneMs(categories);
    const t = setTimeout(() => {
      listRevealedRef.current = true;
      setListVisible(true);
      notifyContentDone();
    }, delay);
    return () => clearTimeout(t);
  }, [categories, notifyContentDone]);

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
          getCategoryLabel(c).toLowerCase().includes(query),
        )
      );
    })
    .sort((a, b) => {
      const labelA = (a.client ?? a.title).toLowerCase();
      const labelB = (b.client ?? b.title).toLowerCase();
      return labelA.localeCompare(labelB, "sv");
    });

  // List view is client names only, so one row per client — the row links to
  // that client's first project.
  type ClientRow = {
    key: string;
    label: string;
    slug: string;
    url: string;
    alt: string;
  };
  const clients: ClientRow[] = [];
  const seenClients = new Set<string>();
  for (const item of displayed) {
    const key = item.client ?? item.slug;
    if (seenClients.has(key)) continue;
    seenClients.add(key);
    clients.push({
      key,
      label: item.client ?? item.title,
      slug: item.slug,
      url: item.url,
      alt: item.alt,
    });
  }

  return (
    <div
      id="projects"
      className="relative w-full px-3 lg:px-6 mt-16 lg:mt-24 pt-12   "
    >
      <LandningBlock
        label="projects"
        className="h-[66.6dvh]   items-center  w-full"
        // Lines the "projects" label up with the topbar's "sound off": column 3
        // of the block's eight-column grid is the same 25% as column 4 of the
        // bar's twelve, both measured inside the shared px-6 gutter.
        labelClassName="col-start-2 col-span-3 lg:col-start-3 lg:col-span-4"
      >
        {/* Its own grid, on the same eight columns the label sits on, so the
            heading stays under it. */}
        <div className="grid grid-cols-3 lg:grid-cols-8 w-full mb-3">
          <TypedHeading
            ready={!navLoading}
            text="welcome to the archive"
            className="col-start-2 col-span-3 lg:col-start-3 lg:col-span-5 text-left  h2Text  font-thin text-primary"
          />
        </div>
      </LandningBlock>
      <FilterOverlay />

      {/* Desktop: category sidebar left, projects right. */}
      <div className=" mt-12 mb-6 lg:mb-6 grid grid-cols-3 lg:grid-cols-12 ">
        <h2 className="mt-12 lg:hidden col-start-2 col-span-3 items-baseline gap-x-3 px-0">
          {/* The one mobile control: names the active filter and opens the
              category / settings sheet. */}
          <CheckButton
            size="label"
            label={
              activeFilter === "all"
                ? "Filter and Settings"
                : getActiveFilterLabel(activeFilter)
            }
            active
            onClick={() => setFiltersOpen((v) => !v)}
          />
        </h2>
        <CategoryFilters />

        {listVisible && showList && (
          <div className="col-start-4 col-span-8 hidden w-full lg:flex flex-col  justify-start items-start  gap-6 mt-12 mb-12 ">
            <AnimatePresence mode="popLayout">
              {clients.map((client, idx) => (
                <motion.div
                  key={client.key}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.07 }}
                  className="w-full"
                >
                  <Link
                    href={`/projects/${client.slug}`}
                    className=" transition-all h2Text text-primary lowercase hover:text-secondary hover:bg-transparent"
                  >
                    {client.label}
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {listVisible && showGrid && (
          <div
            className="col-start-1 col-span-4 lg:col-start-1 lg:col-span-12 hidden w-full gap-6 pt-6  lg:grid lg:px-0"
            style={{
              gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
            }}
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
                >
                  <ProjectCard
                    item={item}
                    sizes={`${Math.round(75 / numCols)}vw`}
                    className=""
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Mobile: the grid or the client list. The category button that heads
          this section lives in the grid above so it can sit in column two. */}
      <div className="flex w-full flex-col lg:hidden">
        {listVisible && showGrid && (
          <div className="flex flex-col w-full">
            <AnimatePresence mode="popLayout" initial={false}>
              {displayed.map((item) => (
                <motion.div key={item.key} layout exit={{ opacity: 0 }}>
                  <FeaturedCard project={item} revealOnView />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {listVisible && showList && (
          <div className="flex w-full flex-col px-3 ">
            <AnimatePresence mode="popLayout">
              {clients.map((client, idx) => (
                <motion.div
                  key={client.key}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.07 }}
                  className="w-full"
                >
                  <Link
                    href={`/projects/${client.slug}`}
                    className=" text-primary hover:text-secondary transition-all h2Text duration-150"
                  >
                    {client.label}
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <span className="grid grid-cols-3 lg:grid-cols-12 px-3 lg:px-6 mt-12 lg:mt-24 mb-12 lg:mb-24">
        <IconButton
          size="label"
          label="top"
          icon="↑"
          className="col-start-1 lg:col-start-4"
          onClick={() =>
            lenis
              ? lenis.scrollTo(0)
              : window.scrollTo({ top: 0, behavior: "smooth" })
          }
        />
        <IconButton
          size="label"
          href="/projects"
          label="next"
          icon="→"
          className="col-start-3 lg:col-start-9"
        />
      </span>

      <Footer />
    </div>
  );
}
