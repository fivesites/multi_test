"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type RefObject,
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
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
  search: string;
  setSearch: (v: string) => void;
  numCols: number;
  setNumCols: (n: number) => void;
  heroInView: boolean;
  setHeroInView: (v: boolean) => void;
  aboutRef: RefObject<HTMLDivElement>;
};

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>("showreel");
  const [showGrid, setShowGrid] = useState(false);
  const [showList, setShowList] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [openedCard, setOpenedCard] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [search, setSearch] = useState("");
  const [numCols, setNumCols] = useState(2);
  const [heroInView, setHeroInView] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

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
        heroInView,
        setHeroInView,
        aboutRef,
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
