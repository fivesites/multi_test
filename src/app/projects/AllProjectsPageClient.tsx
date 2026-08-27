"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useUI } from "@/context/UIContext";
import { useWork } from "@/context/WorkContext";
import ProjectCard from "@/app/components/ProjectCard";
import CategoryFilters from "@/app/components/CategoryFilters";
import FilterOverlay from "@/app/components/FilterOverlay";
import ViewToggles, { ViewToggleButtons } from "@/app/components/ViewToggles";
import { getFilterDoneMs, getPostLoadFilterDoneMs } from "@/lib/navTiming";
import { getActiveFilterLabel, getCategoryLabel } from "@/lib/categories";
import { Button } from "@/components/ui/button";

export default function AllProjectsPageClient() {
  const { items, categories } = useWork();
  const {
    showGrid,
    showList,
    activeFilter,
    search,
    notifyContentDone,
    setOpenedCard,
    numCols,
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

  const [hoveredClient, setHoveredClient] = useState<string | null>(null);

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

  const previewClient = hoveredClient
    ? clients.find((c) => c.key === hoveredClient)
    : null;

  return (
    <div
      id="projects"
      className="relative min-h-dvh w-full px-3 lg:px-3 bg-background"
    >
      <section className=" h-full w-full mt-15">
        <FilterOverlay />

        {/* Preview overlay — desktop list-only mode */}
        <AnimatePresence>
          {showList && !showGrid && previewClient && (
            <motion.div
              key={previewClient.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 hidden items-center justify-center px-8 pointer-events-none lg:flex"
            >
              <div className="relative h-1/3 w-1/4">
                <Image
                  src={previewClient.url}
                  alt={previewClient.alt}
                  fill
                  className="object-contain object-center"
                  sizes="25vw"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop: category sidebar left, projects right. */}
        <div className="hidden w-full gap-x-6 lg:flex">
          <div className="w-1/4 shrink-0 pt-0">
            <CategoryFilters />
          </div>

          <div className="flex w-3/4 flex-col">
            {/* Header for the list: active filter left, view toggles hard right. */}
            <div className="z-40 flex items-baseline justify-between pb-0">
              <h2 className="flex items-baseline gap-x-3">
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-auto uppercase px-0  lg:hover:bg-transparent text-primary"
                >
                  {" "}
                  Projects: {getActiveFilterLabel(activeFilter)}
                </Button>
              </h2>
              <ViewToggleButtons />
            </div>

            {listVisible && showList && (
              <div className="flex w-full flex-col  justify-start items-start  gap-1.5 ">
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
                        className="borderBtn block w-full px-3 hover:px-6  bg-accent text-accent-foreground transition-all py-1 hover:text-primary hover:bg-transparent"
                        onMouseEnter={() => setHoveredClient(client.key)}
                        onMouseLeave={() => setHoveredClient(null)}
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
                className="grid w-full gap-3"
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
        </div>

        {/* Mobile: heading + view toggle, then the grid or the client list. */}
        <div className="flex w-full flex-col lg:hidden">
          <ViewToggles className="pb-1.5" />

          {listVisible && showGrid && (
            <div className="flex flex-col w-full  gap-y-3">
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
                  >
                    <ProjectCard item={item} sizes="100vw" className="w-full" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {listVisible && showList && (
            <div className="flex w-full flex-col gap-y-1.5">
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
                      className="borderBtn block w-full border-b border-muted-foreground text-center text-muted-foreground transition-colors duration-150"
                    >
                      {client.label}
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
