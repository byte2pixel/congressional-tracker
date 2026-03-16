import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface WatchedStock {
  symbol: string;
  company: string;
}

export interface WatchedPolitician {
  bioGuideId: string;
  name: string;
  party: string;
  house: string;
}

interface WatchlistState {
  stocks: Array<WatchedStock>;
  politicians: Array<WatchedPolitician>;
}

interface WatchlistContextProps {
  watchedStocks: Array<WatchedStock>;
  watchedPoliticians: Array<WatchedPolitician>;
  addStock: (stock: WatchedStock) => void;
  removeStock: (symbol: string) => void;
  isWatchingStock: (symbol: string) => boolean;
  addPolitician: (politician: WatchedPolitician) => void;
  removePolitician: (bioGuideId: string) => void;
  isWatchingPolitician: (bioGuideId: string) => boolean;
}

const STORAGE_KEY = "congressional_watchlist";

function loadFromStorage(): WatchlistState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { stocks: [], politicians: [] };
    const parsed = JSON.parse(raw) as WatchlistState;
    return {
      stocks: Array.isArray(parsed.stocks) ? parsed.stocks : [],
      politicians: Array.isArray(parsed.politicians) ? parsed.politicians : [],
    };
  } catch {
    return { stocks: [], politicians: [] };
  }
}

function saveToStorage(state: WatchlistState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const WatchlistContext = createContext<WatchlistContextProps | undefined>(
  undefined,
);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<WatchlistState>(loadFromStorage);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const addStock = useCallback((stock: WatchedStock) => {
    setState((prev) => {
      if (prev.stocks.some((s) => s.symbol === stock.symbol)) return prev;
      return { ...prev, stocks: [...prev.stocks, stock] };
    });
  }, []);

  const removeStock = useCallback((symbol: string) => {
    setState((prev) => ({
      ...prev,
      stocks: prev.stocks.filter((s) => s.symbol !== symbol),
    }));
  }, []);

  const isWatchingStock = useCallback(
    (symbol: string) => state.stocks.some((s) => s.symbol === symbol),
    [state.stocks],
  );

  const addPolitician = useCallback((politician: WatchedPolitician) => {
    setState((prev) => {
      if (prev.politicians.some((p) => p.bioGuideId === politician.bioGuideId))
        return prev;
      return { ...prev, politicians: [...prev.politicians, politician] };
    });
  }, []);

  const removePolitician = useCallback((bioGuideId: string) => {
    setState((prev) => ({
      ...prev,
      politicians: prev.politicians.filter((p) => p.bioGuideId !== bioGuideId),
    }));
  }, []);

  const isWatchingPolitician = useCallback(
    (bioGuideId: string) =>
      state.politicians.some((p) => p.bioGuideId === bioGuideId),
    [state.politicians],
  );

  return (
    <WatchlistContext.Provider
      value={{
        watchedStocks: state.stocks,
        watchedPoliticians: state.politicians,
        addStock,
        removeStock,
        isWatchingStock,
        addPolitician,
        removePolitician,
        isWatchingPolitician,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export function useWatchlist(): WatchlistContextProps {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}
