"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InfoRow = { label: string; value: string };

type Project = {
  href: string;
  title: string;
  info: InfoRow[];
  images: string[];
};

const PROJECTS: Record<string, Project> = {
  "bjork-berries": {
    href: "/bjork-berries",
    title: "Björk & Berries",
    info: [
      { label: "client", value: "Björk & Berries" },
      { label: "project", value: "Winter Whispers" },
      { label: "art direction", value: "Elin Wretlund" },
      { label: "director & dop", value: "Daniel von Malmborg" },
      { label: "set design", value: "Adam Olsson & Gustav Hedengren" },
      { label: "assistant", value: "Valdemar Nyström" },
      { label: "sound design & vax", value: "Adam Odelfelt" },
    ],
    images: [
      "/bjork-berries/bjork-berries_1920_1080_1.png",
      "/bjork-berries/bjork-berries_portrait_1.png",
      "/bjork-berries/bjork-berries_portrait_2.png",
      "/bjork-berries/bjork-berries_1920_1080_2.png",
      "/bjork-berries/bjork-berries_portrait_3.png",
    ],
  },
  jureskogs: {
    href: "/jureskogs",
    title: "Jureskogs",
    info: [
      { label: "client", value: "Jureskogs" },
      { label: "project", value: "Campaign & Visual Identity" },
      {
        label: "art direction",
        value: "Daniel von Malmborg & Andreas Ullenius",
      },
      { label: "photographer", value: "Daniel von Malmborg" },
      { label: "retouch", value: "Jenny Grip" },
    ],
    images: [
      "/jureskogs/reklam_dokumentation_2503_Jureskogs_237_TUSCH.jpg",
      "/jureskogs/231109_Jureskogs_kampanj+meny_H23_04_KAMPANJ_go_wild_dannes_leverans_lowres.jpg",
      "/jureskogs/reklam_dokumentation_2503_Jureskogs_302_TUSCH.jpg",
      "/jureskogs/231109_Jureskogs_kampanj+meny_H23_01_KAMPANJ_here_comes_the_sun_dannes_leverans_lowres.jpg",
      "/jureskogs/231109_Jureskogs_kampanj+meny_H23_02_KAMPANJ_high_five_dannes_leverans_lowres.jpg",
      "/jureskogs/reklam_dokumentation_2503_Jureskogs_306_TUSCH.jpg",
      "/jureskogs/231109_Jureskogs_kampanj+meny_H23_07_blt_danne_leverans_lowres.jpg",
      "/jureskogs/231109_Jureskogs_kampanj+meny_H23_13_chicken_parm_dannea_leverans_lowres.jpg",
      "/jureskogs/reklam_dokumentation_2503_Jureskogs_307_TUSCH.jpg",
      "/jureskogs/231109_Jureskogs_kampanj+meny_H23_10_nwh_dannea_leverans_lowres.jpg",
      "/jureskogs/231109_Jureskogs_kampanj+meny_H23_09_avocado_sandwich_dannes_leverans_lowres.jpg",
      "/jureskogs/231109_Jureskogs_kampanj+meny_H23_03_all_american_danne_leverans_lowres.jpg",
      "/jureskogs/231109_Jureskogs_kampanj+meny_H23_04_high_five_dannes_leverans_lowres.jpg",
      "/jureskogs/reklam_dokumentation_2503_Jureskogs_292 1_TUSCH.jpg",
    ],
  },
  mellotron: {
    href: "/mellotron",
    title: "Mellotron",
    info: [
      { label: "client", value: "Mellotron" },
      { label: "project", value: "Mellotron M400D" },
      { label: "art direction", value: "Adam Odelfelt" },
      { label: "dop", value: "Daniel von Malmborg" },
      { label: "post-production", value: "Adam Odelfelt" },
    ],
    images: [
      "/mellotron/stor.jpg",
      "/mellotron/V1-low res Markus.jpg",
      "/mellotron/v2-low res Markus.jpg",
      "/mellotron/v3-low res Markus.jpg",
    ],
  },
};

const PROJECT_KEYS = Object.keys(PROJECTS);

function ProjectColumn({
  defaultKey,
  className,
  showHeader = true,
}: {
  defaultKey: string;
  className?: string;
  showHeader?: boolean;
}) {
  const [key, setKey] = useState(defaultKey);
  const [imgIdx, setImgIdx] = useState(0);
  const project = PROJECTS[key];

  useEffect(() => {
    setImgIdx(0);
  }, [key]);

  // Autoplay
  useEffect(() => {
    const id = setInterval(
      () => setImgIdx((i) => (i + 1) % project.images.length),
      4000,
    );
    return () => clearInterval(id);
  }, [project.images.length]);

  const prev = () =>
    setImgIdx((i) => (i - 1 + project.images.length) % project.images.length);
  const next = () => setImgIdx((i) => (i + 1) % project.images.length);

  return (
    <div className={`flex flex-col h-full relative  ${className ?? ""}`}>
      {/* Header: select + info card */}
      {showHeader && (
        <div className="shrink-0 bg-transparent absolute top-0 left-0  z-10 w-full">
          <Select value={key} onValueChange={setKey}>
            <SelectTrigger className="w-full border-none shadow-none  text-background focus:ring-0 font-absolution1 text-sm h-auto px-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_KEYS.map((k) => (
                <SelectItem key={k} value={k} className="font-absolution1">
                  {PROJECTS[k].title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2 space-y-0.5 hidden">
            {project.info.map(({ label, value }) => (
              <div key={label} className="flex gap-2 text-xs leading-snug">
                <span className="text-muted-foreground shrink-0 w-28">
                  {label}
                </span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carousel */}
      <div className="relative flex-1 overflow-hidden">
        {/* Images with crossfade */}
        {project.images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: i === imgIdx ? 1 : 0 }}
          >
            <Image src={src} alt="" fill className="object-cover" />
          </div>
        ))}

        {/* Full-area link to project page (behind buttons) */}
        <Link
          href={project.href}
          className="absolute inset-0 z-10"
          aria-label={`View ${project.title}`}
        />

        {/* Prev / Next */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors text-lg"
          aria-label="Previous image"
        >
          ←
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors text-lg"
          aria-label="Next image"
        >
          →
        </button>

        {/* Counter */}
        <span className="absolute bottom-3 right-3 z-20 text-white/50 text-xs font-mono pointer-events-none">
          {String(imgIdx + 1).padStart(2, "0")} /{" "}
          {String(project.images.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export default function ProjectSection({
  asBackground = false,
}: {
  asBackground?: boolean;
}) {
  return (
    <section
      className={
        asBackground
          ? "h-full"
          : "snap-start md:h-screen border-t border-border"
      }
    >
      <div
        className={`grid h-full ${asBackground ? "grid-cols-3" : "grid-cols-1 md:grid-cols-3"}`}
      >
        <ProjectColumn defaultKey="bjork-berries" showHeader={!asBackground} />
        <ProjectColumn defaultKey="jureskogs" showHeader={!asBackground} />
        <ProjectColumn defaultKey="mellotron" showHeader={!asBackground} />
      </div>
    </section>
  );
}
