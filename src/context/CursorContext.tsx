"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type CursorContextType = {
  /** True while at least one caller is holding the cursor busy. */
  busy: boolean;
  addBusy: () => void;
  removeBusy: () => void;
};

const CursorContext = createContext<CursorContextType | null>(null);

export function CursorProvider({ children }: { children: ReactNode }) {
  // A counter, not a boolean: several things can be in flight at once and the
  // cursor only rests once the last of them lets go.
  const [count, setCount] = useState(0);
  const addBusy = useCallback(() => setCount((c) => c + 1), []);
  const removeBusy = useCallback(() => setCount((c) => Math.max(0, c - 1)), []);

  return (
    <CursorContext.Provider value={{ busy: count > 0, addBusy, removeBusy }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be used inside CursorProvider");
  return ctx;
}

/** Spins the cursor for as long as `active` stays true. */
export function useBusyCursor(active: boolean) {
  const { addBusy, removeBusy } = useCursor();
  useEffect(() => {
    if (!active) return;
    addBusy();
    return removeBusy;
  }, [active, addBusy, removeBusy]);
}
