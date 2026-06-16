"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type Panel = "showReel" | "projects" | "about" | "connect";
export type ReelMode = "intro" | "background";

type UIContextType = {
  panel: Panel;
  setPanel: (p: Panel) => void;
  contentDoneKey: number;
  notifyContentDone: () => void;
  showReel: boolean;
  setShowReel: (v: boolean) => void;
  reelMode: ReelMode;
  setReelMode: (v: ReelMode) => void;
  showGrid: boolean;
  setShowGrid: (v: boolean) => void;
  showList: boolean;
  setShowList: (v: boolean) => void;
  activeFilter: string;
  setActiveFilter: (v: string) => void;
  openedCard: string | null;
  setOpenedCard: (slug: string | null) => void;
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
  search: string;
  setSearch: (v: string) => void;
  numCols: number;
  setNumCols: (n: number) => void;
};

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>("showReel");
  const [showReel, setShowReel] = useState(true);
  const [reelMode, setReelMode] = useState<ReelMode>("intro");
  const [showGrid, setShowGrid] = useState(false);
  const [showList, setShowList] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [openedCard, setOpenedCard] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [search, setSearch] = useState("");
  const [numCols, setNumCols] = useState(2);
  const [contentDoneKey, setContentDoneKey] = useState(0);
  const notifyContentDone = () => setContentDoneKey((k) => k + 1);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setShowList(true);
      setShowGrid(false);
      setNumCols(6);
    } else {
      setNumCols(2);
    }
  }, []);

  return (
    <UIContext.Provider
      value={{
        panel,
        setPanel,
        showReel,
        setShowReel,
        reelMode,
        setReelMode,
        showGrid,
        setShowGrid,
        showList,
        setShowList,
        activeFilter,
        setActiveFilter,
        openedCard,
        setOpenedCard,
        showSettings,
        setShowSettings,
        search,
        setSearch,
        numCols,
        setNumCols,
        contentDoneKey,
        notifyContentDone,
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
