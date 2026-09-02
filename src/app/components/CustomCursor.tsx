"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCursor } from "@/context/CursorContext";
import {
  Loading1,
  Loading2,
  Loading3,
  Loading4,
  Loading4Inverted,
  Loading5,
  Loading5Inverted,
} from "./marks";

/** Every state but rest is a cycle, all beating at the same rate. */
const IDLE_FRAME = Loading1;
/** Hover runs the 4/5 pair inverted — filled where they are transparent. */
const HOVER_FRAMES = [Loading4Inverted, Loading5Inverted] as const;
/** A press runs the same 5/4 pair as hover, but plain rather than inverted. */
const PRESS_FRAMES = [Loading5, Loading4] as const;
const BUSY_FRAMES = [Loading2, Loading3, Loading4, Loading5] as const;
const FRAME_MS = 110;
/** A fast click is shorter than a frame — hold the press cycle for both of
 *  its frames so the alternation is always seen. */
const PRESS_MIN_MS = FRAME_MS * 2;

/** What counts as clickable. The native cursor is hidden site-wide, so the
 *  computed `cursor` can't be read back — the pointer-cursor classes are
 *  matched directly instead. */
const INTERACTIVE = [
  "a[href]",
  "button",
  '[role="button"]',
  "input",
  "select",
  "textarea",
  "label",
  "summary",
  '[contenteditable="true"]',
  ".cursor-pointer",
  ".cursor-zoom-in",
].join(",");

export default function CustomCursor() {
  const pathname = usePathname();
  const { busy } = useCursor();
  const ref = useRef<HTMLDivElement>(null);
  // Only replace the pointer where there is one to replace, and never inside
  // the Sanity studio, which needs the real caret and resize cursors.
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [frame, setFrame] = useState(0);

  const inStudio = pathname?.startsWith("/studio") ?? false;

  useEffect(() => {
    if (inStudio) {
      setEnabled(false);
      return;
    }
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [inStudio]);

  // Hiding the native cursor is global, so it lives on <html> rather than on
  // any one subtree — and comes back off as soon as the cursor unmounts.
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("cursor-none");
    return () => document.documentElement.classList.remove("cursor-none");
  }, [enabled]);

  // Position is written straight to the node: a state update per mousemove
  // would re-render the tree at pointer rate for nothing.
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    let lastTarget: Element | null = null;

    const draw = () => {
      raf = 0;
      const el = ref.current;
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      setVisible(true);
      if (!raf) raf = requestAnimationFrame(draw);

      // closest() walks ancestors, so it only needs running when the pointer
      // crosses onto a different element — not on every pixel of movement.
      const target = e.target instanceof Element ? e.target : null;
      if (target !== lastTarget) {
        lastTarget = target;
        setHovering(!!target?.closest(INTERACTIVE));
      }
    };
    // relatedTarget is null only when the pointer actually left the window.
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        setVisible(false);
        setHovering(false);
        lastTarget = null;
      }
    };
    const onBlur = () => {
      setVisible(false);
      setPressed(false);
    };

    // Capture phase: a handler that stops propagation shouldn't cost the
    // cursor its press state, and mouseup can land anywhere.
    let release = 0;
    let pressedAt = 0;
    const onDown = () => {
      clearTimeout(release);
      pressedAt = Date.now();
      setPressed(true);
    };
    const onUp = () => {
      const held = Date.now() - pressedAt;
      if (held >= PRESS_MIN_MS) setPressed(false);
      else
        release = window.setTimeout(
          () => setPressed(false),
          PRESS_MIN_MS - held,
        );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    window.addEventListener("blur", onBlur);
    window.addEventListener("mousedown", onDown, true);
    window.addEventListener("mouseup", onUp, true);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("mousedown", onDown, true);
      window.removeEventListener("mouseup", onUp, true);
      clearTimeout(release);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  // A press is direct feedback, so it outranks everything. The busy cycle then
  // beats hover: mid-navigation, "still loading" is the more useful signal.
  // All three are module constants, so the effect below only re-runs when the
  // cursor actually changes state.
  const sequence = pressed
    ? PRESS_FRAMES
    : busy
      ? BUSY_FRAMES
      : hovering
        ? HOVER_FRAMES
        : null;

  // One timer drives whichever cycle is current; at rest it stops and the
  // counter goes back to the first frame.
  useEffect(() => {
    setFrame(0);
    if (!enabled || !sequence) return;
    const id = setInterval(
      () => setFrame((f) => (f + 1) % sequence.length),
      FRAME_MS,
    );
    return () => clearInterval(id);
  }, [enabled, sequence]);

  if (!enabled) return null;

  // Modulo, not a bare index: the sequence can shorten a render before the
  // effect above resets the counter.
  const Frame = sequence ? sequence[frame % sequence.length] : IDLE_FRAME;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[999] text-primary will-change-transform"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <Frame className="block h-3 w-3 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
