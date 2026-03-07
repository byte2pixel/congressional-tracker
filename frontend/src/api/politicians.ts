const apiUrl =
  import.meta.env.VITE_services__apiservice__http__0 || "http://localhost:5348";

export interface Politician {
  id: string;
  name: string;
  house: string;
  party: string;
}

export async function searchPoliticians(
  query: string,
  limit: number,
  token?: string,
): Promise<Array<Politician>> {
  const params = new URLSearchParams({ query, limit: String(limit) });
  const res = await fetch(`${apiUrl}/api/politicians/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to search politicians");
  return await res.json();
}
