const apiUrl = import.meta.env.VITE_services__apiservice__http__0;

export interface MostActiveStock {
  symbol: string;
  company: string | null;
  tickerType: string | null;
  totalTrades: number;
  purchaseCount: number;
  saleCount: number;
  totalEstimatedVolume: number;
}

export async function mostActiveStocks(
  token?: string,
): Promise<Array<MostActiveStock>> {
  const res = await fetch(`${apiUrl}/api/stocks/most-active`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch most active stocks");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

