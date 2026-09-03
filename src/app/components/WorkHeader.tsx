"use client";

import { motion, type Variants } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TYPING_MS_PER_CHAR = 22;

const container: Variants = {
  hidden: { height: 0, transition: { duration: 0.2 } },
  show: { height: "auto", transition: { duration: 0.2 } },
};

/**
 * Client / title / year / Back, typed out in sequence. Used to live in
 * MultiNav; it belongs to the project page it describes.
 */
export default function WorkHeader({
  client,
  title,
  year,
  visible = true,
  className = "",
}: {
  client?: string;
  title: string;
  year?: number;
  visible?: boolean;
  className?: string;
}) {
  const clientLen = client?.length ?? 0;
  const titleLen = title.length;
  const yearLen = year?.toString().length ?? 0;
  const titleDelay = client ? (clientLen + 2) * TYPING_MS_PER_CHAR : 0;
  const yearDelay = titleDelay + (titleLen + 2) * TYPING_MS_PER_CHAR;
  const backDelay = year
    ? yearDelay + (yearLen + 2) * TYPING_MS_PER_CHAR
    : titleDelay + (titleLen + 2) * TYPING_MS_PER_CHAR;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate={visible ? "show" : "hidden"}
      className={`overflow-hidden sticky left-0  text-primary right-0 z-30  top-row-2  px-3 lg:px-0 grid grid-cols-3 gap-y-6 lg:gap-y-3 lg:grid-cols-12 items-baseline     ${className}`}
    >
      {title && (
        <span className="col-start-2 lg:col-start-4 inline-flex items-baseline whitespace-nowrap h2Text text-primary ">
          <h3> {title}</h3>
        </span>
      )}

      {year && (
        <span className="hidden col-start-9 lg:inline-flex items-baseline whitespace-nowrap ">
          <h3>{year.toString()}</h3>
        </span>
      )}
      <Button
        variant="link"
        size="sm"
        className="border-transparent col-start-11 px-0"
        asChild
      >
        <Link href="/projects">Back</Link>
      </Button>
    </motion.div>
  );
}
