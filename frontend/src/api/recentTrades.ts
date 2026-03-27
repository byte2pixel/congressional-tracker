const apiUrl = import.meta.env.VITE_services__apiservice__http__0;

export interface RecentTrade {
  bioGuideId: string;
  name: string;
  party: string;
  house: string;
  symbol: string;
  company: string;
  industry: string;
  transactionDate: string;
  reportDate: string;
  transactionType: string;
  amount: number;
  range: string | null;
  excessReturn: number | null;
}

export async function recentTrades(
  token?: string,
): Promise<Array<RecentTrade>> {
  const res = await fetch(`${apiUrl}/api/trades/recent`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch recent trades");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
