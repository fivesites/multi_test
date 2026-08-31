"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type SoundContextType = {
  /** Site-wide mute. Starts on: browsers only permit muted autoplay. */
  muted: boolean;
  setMuted: (v: boolean) => void;
  toggleMute: () => void;
  /** 0–1, independent of `muted`: muting keeps the level to come back to. */
  volume: number;
  setVolume: (v: number) => void;
};

const SoundContext = createContext<SoundContextType | null>(null);

/**
 * Output level for the whole site, not just the reel — any component that
 * plays audio reads it from here. Sits above ReelProvider so the reel is one
 * consumer among others rather than the owner.
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true);
  const [volume, setVolumeState] = useState(1);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  // Raising the level is itself an unmute — otherwise dragging the slider up
  // does nothing audible and reads as broken.
  const setVolume = useCallback((v: number) => {
    const next = Math.min(1, Math.max(0, v));
    setVolumeState(next);
    if (next > 0) setMuted(false);
  }, []);

  return (
    <SoundContext.Provider
      value={{ muted, setMuted, toggleMute, volume, setVolume }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used inside SoundProvider");
  return ctx;
}
