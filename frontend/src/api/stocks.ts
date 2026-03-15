const apiUrl = import.meta.env.VITE_services__apiservice__http__0;

export interface Stock {
  symbol: string;
  company: string;
}

export interface StockDetail extends Stock {
  type: string;
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
): Promise<StockDetail> {
  const res = await fetch(`${apiUrl}/api/stock/${symbol}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to get stock detail");
  return await res.json();
}
