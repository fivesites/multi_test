"use client";

import { motion } from "motion/react";

/** 8 x 8 cells of 6 units across the same 48-unit box the static marks use. */
const GRID = 8;
const CELL = 6;

/** Distance from the nearest edge: 0 is the outer frame, 3 the centre four. */
const ringOf = (col: number, row: number) =>
  Math.min(col, row, GRID - 1 - col, GRID - 1 - row);

const RINGS = GRID / 2;
/** One full inward sweep. Each ring lags the one outside it by an even share,
 *  so the pulse reads as travelling rather than blinking in place. */
const CYCLE_S = 0.9;
const DIM = 0.15;

const cellsByRing = Array.from({ length: RINGS }, (_, ring) =>
  Array.from({ length: GRID * GRID }, (_, i) => ({
    col: i % GRID,
    row: Math.floor(i / GRID),
  })).filter(({ col, row }) => ringOf(col, row) === ring),
);

const [frameCells, ...pulseRings] = cellsByRing;

function Cells({ cells }: { cells: { col: number; row: number }[] }) {
  return (
    <>
      {cells.map(({ col, row }) => (
        <rect
          key={`${col}-${row}`}
          x={col * CELL}
          y={row * CELL}
          width={CELL}
          height={CELL}
          fill="currentColor"
        />
      ))}
    </>
  );
}

/** The link cursor: a square frame with its interior rings pulsing inward.
 *  Self-animating rather than a pair of frames on the shared cursor timer —
 *  the rings need to overlap in phase, which a single-frame-at-a-time cycle
 *  cannot express. */
export default function LoadingConcentric({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* The frame holds steady, so the mark keeps a stable outline to read
          against while everything inside it moves. */}
      <g>
        <Cells cells={frameCells} />
      </g>
      {pulseRings.map((cells, i) => (
        <motion.g
          key={i}
          initial={{ opacity: DIM }}
          animate={{ opacity: [DIM, 1, DIM] }}
          transition={{
            duration: CYCLE_S,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * (CYCLE_S / pulseRings.length),
          }}
        >
          <Cells cells={cells} />
        </motion.g>
      ))}
    </svg>
  );
}
