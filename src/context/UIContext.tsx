"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type Panel = "showreel" | "projects" | "about" | "connect";

type UIContextType = {
  panel: Panel;
  setPanel: (p: Panel) => void;
  showGrid: boolean;
  setShowGrid: (v: boolean) => void;
  showList: boolean;
  setShowList: (v: boolean) => void;
  activeFilter: string;
  setActiveFilter: (v: string) => void;
  openedCard: string | null;
  setOpenedCard: (slug: string | null) => void;
  glowMode: boolean;
  setGlowMode: (v: boolean) => void;
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
};

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>("showreel");
  const [showGrid, setShowGrid] = useState(false);
  const [showList, setShowList] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [openedCard, setOpenedCard] = useState<string | null>(null);
  const [glowMode, setGlowMode] = useState(true);
  const [showSettings, setShowSettings] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("no-glow", !glowMode);
  }, [glowMode]);

  return (
    <UIContext.Provider
      value={{
        panel,
        setPanel,
        showGrid,
        setShowGrid,
        showList,
        setShowList,
        activeFilter,
        setActiveFilter,
        openedCard,
        setOpenedCard,
        glowMode,
        setGlowMode,
        showSettings,
        setShowSettings,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
}
