const apiUrl = import.meta.env.VITE_services__apiservice__http__0;

export interface Stock {
  symbol: string;
  company: string;
  type: string;
}

export interface StockTrade {
  bioGuideId: string;
  name: string;
  party: string;
  house: string;
  state: string;
  transactionDate: string;
  transactionType: string;
  amount: number;
  range: string;
  excessReturn?: number;
}

export async function searchStocks(
  query: string,
  limit: number,
  token?: string,
): Promise<Array<Stock>> {
  const params = new URLSearchParams({ query, limit: String(limit) });
  const res = await fetch(`${apiUrl}/api/stock/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to search stocks");
  return await res.json();
}

export async function getStockDetail(
  symbol: string,
  token?: string,
): Promise<Stock> {
  const res = await fetch(`${apiUrl}/api/stock/${symbol}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to get stock detail");
  return await res.json();
}

export async function getStockTrades(
  symbol: string,
  token?: string,
): Promise<Array<StockTrade>> {
  const res = await fetch(`${apiUrl}/api/stock/${symbol}/trades`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to get stock trades");
  return await res.json();
}