const apiUrl = import.meta.env.VITE_services__apiservice__http__0;

export interface Politician {
  bioGuideId: string;
  name: string;
  house: string;
  party: string;
  state?: string;
  district?: number;
  imageAltText?: string;
  imageUrl?: string;
}

export interface PoliticianTrade {
  symbol: string;
  company: string;
  reportDate: string;
  transactionDate: string;
  transactionType: string;
  amount: number;
  range: string | null;
  excessReturn: number | null;
}

export async function searchPoliticians(
  query: string,
  limit: number,
  token?: string,
): Promise<Array<Politician>> {
  const params = new URLSearchParams({ query, limit: String(limit) });
  const res = await fetch(`${apiUrl}/api/politician/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to search politicians");
  return await res.json();
}

export async function getPolitician(
  bioGuideId: string,
  token?: string,
): Promise<Politician> {
  const res = await fetch(`${apiUrl}/api/politician/${bioGuideId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch politician");
  return await res.json();
}

export async function getPoliticiansTrades(
  bioGuideId: string,
  token?: string,
): Promise<Array<PoliticianTrade>> {
  const res = await fetch(`${apiUrl}/api/politician/${bioGuideId}/trades`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch politician trades");
  return await res.json();
}
