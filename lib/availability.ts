import { cacheLife } from "next/cache";

const BASE = "https://api.moviez.ac";

export type Availability = {
  available?: boolean;
  type?: string;
  languages?: string[];
  [k: string]: unknown;
};

// Le format exact n'est pas documenté : on reste tolérant.
export async function checkAvailability(
  tmdbId: number | string,
): Promise<Availability | null> {
  "use cache";
  cacheLife("hours");
  try {
    const res = await fetch(`${BASE}/api/check/${tmdbId}`);
    if (!res.ok) return null;
    return (await res.json()) as Availability;
  } catch {
    return null;
  }
}
