import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { RecentTrade } from "@/api/recentTrades";
import { useRecentTrades } from "@/hooks/useRecentTrades";
import { useWatchlist } from "@/context/WatchlistContext";

export interface TradeNotification {
  id: string;
  trade: RecentTrade;
}

interface NotificationsContextProps {
  notifications: Array<TradeNotification>;
  unreadCount: number;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const STORAGE_KEY = "congressional_notifications_dismissed";

function getTradeId(trade: RecentTrade): string {
  return `${trade.bioGuideId}|${trade.symbol}|${trade.transactionDate}|${trade.transactionType}|${trade.amount}`;
}

function loadDismissed(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as Array<string>;
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveDismissed(dismissed: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...dismissed]));
}

const NotificationsContext = createContext<
  NotificationsContextProps | undefined
>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: trades } = useRecentTrades();
  const { watchedStocks, watchedPoliticians } = useWatchlist();
  const [dismissed, setDismissed] = useState<Set<string>>(loadDismissed);

  const stockAddedAt = useMemo(
    () => new Map(watchedStocks.map((s) => [s.symbol, s.addedAt])),
    [watchedStocks],
  );
  const politicianAddedAt = useMemo(
    () => new Map(watchedPoliticians.map((p) => [p.bioGuideId, p.addedAt])),
    [watchedPoliticians],
  );

  const notifications = useMemo<Array<TradeNotification>>(() => {
    if (!trades) return [];
    return trades
      .filter((trade) => {
        const id = getTradeId(trade);
        if (dismissed.has(id)) return false;

        const stockWatchedSince = stockAddedAt.get(trade.symbol);
        if (stockWatchedSince && trade.reportDate > stockWatchedSince)
          return true;

        const politicianWatchedSince = politicianAddedAt.get(trade.bioGuideId);
        if (politicianWatchedSince && trade.reportDate > politicianWatchedSince)
          return true;

        return false;
      })
      .map((trade) => ({ id: getTradeId(trade), trade }))
      .sort((a, b) => b.trade.reportDate.localeCompare(a.trade.reportDate));
  }, [trades, stockAddedAt, politicianAddedAt, dismissed]);

  const dismiss = useCallback((id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveDismissed(next);
      return next;
    });
  }, []);

  const dismissAll = useCallback(() => {
    setDismissed((prev) => {
      const allCurrentIds = notifications.map((n) => n.id);
      const next = new Set([...prev, ...allCurrentIds]);
      saveDismissed(next);
      return next;
    });
  }, [notifications]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount: notifications.length,
        dismiss,
        dismissAll,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export function useNotifications(): NotificationsContextProps {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  }
  return context;
}
