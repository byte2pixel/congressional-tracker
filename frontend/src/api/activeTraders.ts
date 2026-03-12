const apiUrl = import.meta.env.VITE_services__apiservice__http__0;

export interface ActiveTrader {
  bioGuideId: string | null;
  name: string;
  party: string;
  house: string;
  state: string;
  saleCount: number;
  purchaseCount: number;
  totalTrades: number;
  totalEstimatedVolume: number;
}

export async function activeTraders(
  token?: string,
): Promise<Array<ActiveTrader>> {
  const res = await fetch(`${apiUrl}/api/traders/most-active`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch most active traders");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
