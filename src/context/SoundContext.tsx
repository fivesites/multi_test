"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  /** True once the visitor has been through the cookie + sound consent flow
   *  (or was a returning visitor with nothing left to answer). Standing sound
   *  controls that would otherwise cover the prompt wait on this. */
  consentSettled: boolean;
  markConsentSettled: () => void;
};

/** Returning visitors have already resolved the flow — read that straight from
 *  storage so the standing controls don't flash in and out on first paint. */
function readConsentSettled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      localStorage.getItem("sound-consent") !== null ||
      localStorage.getItem("cookie-consent") === "declined"
    );
  } catch {
    return false;
  }
}

const SoundContext = createContext<SoundContextType | null>(null);

/**
 * Output level for the whole site, not just the reel — any component that
 * plays audio reads it from here. Sits above ReelProvider so the reel is one
 * consumer among others rather than the owner.
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true);
  const [volume, setVolumeState] = useState(1);
  const [consentSettled, setConsentSettled] = useState(false);

  // Post-mount only: the server render has no localStorage, so seeding this
  // during useState would desync hydration.
  useEffect(() => {
    if (readConsentSettled()) setConsentSettled(true);
  }, []);

  const markConsentSettled = useCallback(() => setConsentSettled(true), []);

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
      value={{
        muted,
        setMuted,
        toggleMute,
        volume,
        setVolume,
        consentSettled,
        markConsentSettled,
      }}
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
