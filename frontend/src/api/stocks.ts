const apiUrl = import.meta.env.VITE_services__apiservice__http__0;

export interface Stock {
  symbol: string;
  company: string;
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
