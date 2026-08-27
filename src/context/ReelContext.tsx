"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/** Height of the fixed BottomNav, i.e. how much reel counts as "behind" it. */
const BAR_HEIGHT = 60;

type ReelContextType = {
  /** Whether the reel should be playing. Drives ReactPlayer's `playing`. */
  playing: boolean;
  setPlaying: (v: boolean) => void;
  toggle: () => void;
  muted: boolean;
  setMuted: (v: boolean) => void;
  toggleMute: () => void;
  /** Reported by the reel itself, so the transport UI can track it. */
  currentTime: number;
  setCurrentTime: (v: number) => void;
  duration: number;
  setDuration: (v: number) => void;
  /** True once a reel is mounted; the controls are inert without one. */
  ready: boolean;
  setReady: (v: boolean) => void;
  /** True once the reel has run through once — the transport slides away. */
  playedThrough: boolean;
  setPlayedThrough: (v: boolean) => void;
  /**
   * Registers the reel element so `overReel` can be measured against it.
   * ShowReel passes this as a callback ref.
   */
  setReelEl: (el: HTMLElement | null) => void;
  /**
   * True while the reel still sits behind the bottom bar. The bar and the nav
   * blend over the video while it does, and go solid once the projects are up.
   */
  overReel: boolean;
};

const ReelContext = createContext<ReelContextType | null>(null);

/**
 * One reel, two places in the tree: ShowReel renders the video (home page)
 * while MultiPlayer (BottomNav) drives it. Sharing state here avoids a second
 * ReactPlayer instance, which would play a duplicate copy of the footage.
 */
export function ReelProvider({ children }: { children: ReactNode }) {
  // starts playing muted — the only way browsers allow autoplay
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const [playedThrough, setPlayedThrough] = useState(false);
  const [reelEl, setReelEl] = useState<HTMLElement | null>(null);
  const [overReel, setOverReel] = useState(false);

  // Measured rather than observed: the page scrolls exactly one viewport, so
  // the reel ends up flush at bottom: 0 — an edge-touching rect that
  // IntersectionObserver still reports as intersecting, so it never fires.
  useEffect(() => {
    if (!reelEl) {
      setOverReel(false);
      return;
    }
    const update = () =>
      setOverReel(reelEl.getBoundingClientRect().bottom > BAR_HEIGHT);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reelEl]);

  const toggle = useCallback(() => setPlaying((p) => !p), []);
  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  return (
    <ReelContext.Provider
      value={{
        playing,
        setPlaying,
        toggle,
        muted,
        setMuted,
        toggleMute,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        ready,
        setReady,
        playedThrough,
        setPlayedThrough,
        setReelEl,
        overReel,
      }}
    >
      {children}
    </ReelContext.Provider>
  );
}

export function useReel() {
  const ctx = useContext(ReelContext);
  if (!ctx) throw new Error("useReel must be used inside ReelProvider");
  return ctx;
}
