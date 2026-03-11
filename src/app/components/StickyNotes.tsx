"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const TEXTS = ["Multisquared", "multi2", "multisquared", "Multi2"];

const copyConnect = "Let's connect";

const noteBGs = [
  "/multi_note_green 1.png",
  "/multi_note_yellow 1.png",
  "/multi_notes_orange 1.png",
  "/multi_notes_pink 1.png",
];

const formulaCopy = [
  "2 × perspective",
  "2 × curiosity",
  "2 × creative thinking = more than the sum",
];

const rotations = [-2, 1.5, -1, 2, -0.5, 1, 0];

const NOTE_SIZE = 320;

type Pos = { x: number; y: number; fixed: boolean };

export default function StickyNotes() {
  const [notesVisible, setNotesVisible] = useState(true);
  const [showConnect, setShowConnect] = useState(false);
  const [formulaCount, setFormulaCount] = useState(0);
  const [formulaPositions, setFormulaPositions] = useState<Pos[]>([]);
  const [connectPos, setConnectPos] = useState<Pos | null>(null);
  const [topIndex, setTopIndex] = useState(0);
  const triggered = useRef(false);

  // Scroll-progress → trigger after text is fully typed
  useEffect(() => {
    const update = () => {
      if (triggered.current) return;
      const el = document.getElementById("about-text");
      if (!el) return;
      const docTop = el.getBoundingClientRect().top + window.scrollY;
      const vh = window.innerHeight;
      const scrollStart = docTop - vh * 0.9;
      const scrollEnd = docTop + vh * 0.2;
      const progress = Math.max(
        0,
        Math.min(1, (window.scrollY - scrollStart) / (scrollEnd - scrollStart)),
      );

      if (progress < 1) return;
      triggered.current = true;

      const vw = window.innerWidth;
      const isDesktop = vw >= 1024;

      // Generate positions at trigger time
      const positions: Pos[] = formulaCopy.map((_, i) => {
        if (isDesktop) {
          // Fixed, inline left-to-right within the text column
          return {
            fixed: true,
            x:
              32 +
              NOTE_SIZE / 2 +
              i * (NOTE_SIZE + 8) +
              (Math.random() - 0.5) * 20,
            y: vh * 0.4 + (Math.random() - 0.5) * 40,
          };
        } else {
          // Absolute (document coords), overlaid on the text
          return {
            fixed: false,
            x: 16 + NOTE_SIZE / 2 + Math.random() * (vw - NOTE_SIZE - 32),
            y: docTop - NOTE_SIZE * 0.4 + (Math.random() - 0.5) * vh * 0.35,
          };
        }
      });

      setFormulaPositions(positions);

      // Connect note position (always fixed, random)
      setConnectPos({
        fixed: true,
        x: NOTE_SIZE / 2 + 16 + Math.random() * (vw - NOTE_SIZE - 32),
        y: NOTE_SIZE / 2 + 16 + Math.random() * (vh - NOTE_SIZE - 32),
      });

      // Stagger reveal — typing rhythm
      formulaCopy.forEach((_, i) =>
        setTimeout(() => setFormulaCount(i + 1), i * 350),
      );
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Connect note when contact section is in view
  useEffect(() => {
    const el = document.getElementById("contact");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowConnect(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <button
        onClick={() => setNotesVisible((v) => !v)}
        className="fixed top-4 right-4 z-[60] text-xs font-sans font-medium text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer uppercase"
      >
        {notesVisible ? "hide notes" : "show notes"}
      </button>

      {/* Formula notes */}
      {notesVisible &&
        formulaCopy.slice(0, formulaCount).map((text, i) => {
          const pos = formulaPositions[i];
          if (!pos) return null;
          return (
            <DraggableNote
              key={`formula-${i}`}
              pos={pos}
              rotation={rotations[i % rotations.length]}
              bg={noteBGs[i % noteBGs.length]}
              label={TEXTS[i % TEXTS.length]}
              zIndex={topIndex === i ? 59 : 50 + i}
              onFocus={() => setTopIndex(i)}
            >
              <p className="text-center px-8 text-base leading-snug font-absolution1">
                {text}
              </p>
            </DraggableNote>
          );
        })}

      {/* Connect note */}
      {notesVisible && showConnect && connectPos && (
        <DraggableNote
          pos={connectPos}
          rotation={-1}
          bg={noteBGs[formulaCopy.length % noteBGs.length]}
          label={TEXTS[formulaCopy.length % TEXTS.length]}
          zIndex={
            topIndex === formulaCopy.length ? 59 : 50 + formulaCopy.length
          }
          onFocus={() => setTopIndex(formulaCopy.length)}
          href="/contact"
        >
          <p className="text-center px-8 text-lg uppercase font-normal leading-snug font-tiny5 hover:underline underline-offset-6">
            {copyConnect}
          </p>
        </DraggableNote>
      )}
    </>
  );
}

function DraggableNote({
  pos,
  rotation,
  bg,
  label,
  zIndex,
  onFocus,
  href,
  children,
}: {
  pos: Pos;
  rotation: number;
  bg: string;
  label: string;
  zIndex: number;
  onFocus: () => void;
  href?: string;
  children: React.ReactNode;
}) {
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const didDrag = useRef(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ y: 400, opacity: 0, rotate: rotation * 4 }}
      animate={{ y: 0, opacity: 1, rotate: rotation }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
      whileDrag={{ scale: 1.03 }}
      style={{
        position: pos.fixed ? "fixed" : "absolute",
        left: pos.x - NOTE_SIZE / 2,
        top: pos.y - NOTE_SIZE / 2,
        width: NOTE_SIZE,
        height: NOTE_SIZE,
        zIndex,
        cursor: "grab",
        touchAction: "none",
      }}
      onPointerDown={(e) => {
        onFocus();
        dragStart.current = { x: e.clientX, y: e.clientY };
        didDrag.current = false;
      }}
      onPointerMove={(e) => {
        if (!dragStart.current) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        if (Math.sqrt(dx * dx + dy * dy) > 4) didDrag.current = true;
      }}
    >
      <div
        className="w-full h-full flex items-center justify-center relative select-none"
        style={{
          backgroundImage: `url('${bg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {href ? (
          <Link
            href={href}
            draggable={false}
            className="flex items-center justify-center w-full h-full"
            onClick={(e) => {
              if (didDrag.current) e.preventDefault();
            }}
          >
            {children}
          </Link>
        ) : (
          children
        )}
        {/* logo placeholder — swap with <Image> later */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center font-absolution1 text-xs">
          {label}
        </div>
      </div>
    </motion.div>
  );
}
