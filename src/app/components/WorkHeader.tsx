"use client";

import { motion, type Variants } from "motion/react";
import M2Button from "./M2Button";

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
      className={`overflow-hidden sticky left-0 right-0 z-30  top-row-2  lg:px-3  grid grid-cols-4 items-baseline  font-diatype font-normal text-base   ${className}`}
    >
      {client && (
        <span className="col-span-1 inline-flex items-baseline whitespace-nowrap font-diatype font-normal text-base  ">
          <M2Button text={client} visible={visible} delay={0} lg />
        </span>
      )}
      <span className="hidden col-start-2 lg:inline-flex items-baseline whitespace-nowrap  px-0">
        <M2Button text={title} visible={visible} delay={titleDelay} lg />
      </span>
      {year && (
        <span className="hidden lg:inline-flex items-baseline whitespace-nowrap ">
          <M2Button
            text={year.toString()}
            visible={visible}
            delay={yearDelay}
            lg
          />
        </span>
      )}
      <M2Button
        text="Back"
        visible={visible}
        delay={backDelay}
        href="/"
        lg
        className="col-start-4 justify-self-end text-right"
      />
    </motion.div>
  );
}
