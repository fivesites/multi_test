"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

type UIContextType = {
  contentDoneKey: number;
  notifyContentDone: () => void;
  showGrid: boolean;
  setShowGrid: (v: boolean) => void;
  showList: boolean;
  setShowList: (v: boolean) => void;
  activeFilter: string;
  setActiveFilter: (v: string) => void;
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
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
  const [showGrid, setShowGrid] = useState(true);
  const [showList, setShowList] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  // mobile only: desktop always shows the category column (CategoryFilters),
  // below lg the same list is a full-screen overlay that starts closed
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openedCard, setOpenedCard] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [search, setSearch] = useState("");
  const [numCols, setNumCols] = useState(2);
  const [contentDoneKey, setContentDoneKey] = useState(0);
  const notifyContentDone = useCallback(
    () => setContentDoneKey((k) => k + 1),
    [],
  );

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setShowList(true);
      setShowGrid(false);
      setNumCols(3);
    } else {
      setNumCols(2);
    }
  }, []);

  return (
    <UIContext.Provider
      value={{
        showGrid,
        setShowGrid,
        showList,
        setShowList,
        activeFilter,
        setActiveFilter,
        filtersOpen,
        setFiltersOpen,
        searchOpen,
        setSearchOpen,
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
