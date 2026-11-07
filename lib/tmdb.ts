import { cacheLife } from "next/cache";

const API = "https://api.themoviedb.org/3";
export const IMG = "https://image.tmdb.org/t/p";

export type Media = {
  id: number;
  media_type?: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  popularity?: number;
};

export type Genre = { id: number; name: string };

export type MovieDetails = Media & {
  genres: Genre[];
  runtime: number | null;
  tagline?: string;
  credits?: { cast: { id: number; name: string; character: string; profile_path: string | null }[] };
  similar?: { results: Media[] };
};

export type TvDetails = Media & {
  genres: Genre[];
  number_of_seasons: number;
  seasons: { season_number: number; episode_count: number; name: string }[];
  credits?: MovieDetails["credits"];
  similar?: { results: Media[] };
};

async function tmdb<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY manquante : copie .env.local.example vers .env.local");
  const url = new URL(API + path);
  url.searchParams.set("language", "fr-FR");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const headers: HeadersInit = {};
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
  else url.searchParams.set("api_key", key);
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`TMDB ${res.status} sur ${path}`);
  return res.json() as Promise<T>;
}

type List = { results: Media[] };

export async function getTrending(): Promise<Media[]> {
  "use cache";
  cacheLife("hours");
  return (await tmdb<List>("/trending/all/week")).results.filter((m) => m.media_type !== "person");
}

export async function getList(
  kind: "movie" | "tv",
  list: "popular" | "top_rated",
): Promise<Media[]> {
  "use cache";
  cacheLife("hours");
  return (await tmdb<List>(`/${kind}/${list}`)).results.map((m) => ({ ...m, media_type: kind }));
}

export async function getByGenre(kind: "movie" | "tv", genreId: number): Promise<Media[]> {
  "use cache";
  cacheLife("hours");
  return (
    await tmdb<List>(`/discover/${kind}`, { with_genres: String(genreId), sort_by: "popularity.desc" })
  ).results.map((m) => ({ ...m, media_type: kind }));
}

export async function search(query: string): Promise<Media[]> {
  "use cache";
  cacheLife("minutes");
  return (await tmdb<List>("/search/multi", { query, include_adult: "false" })).results.filter(
    (m) => m.media_type === "movie" || m.media_type === "tv",
  );
}

export async function getMovie(id: number): Promise<MovieDetails> {
  "use cache";
  cacheLife("hours");
  return tmdb<MovieDetails>(`/movie/${id}`, { append_to_response: "credits,similar" });
}

export async function getTv(id: number): Promise<TvDetails> {
  "use cache";
  cacheLife("hours");
  return tmdb<TvDetails>(`/tv/${id}`, { append_to_response: "credits,similar" });
}

export const titleOf = (m: Media) => m.title ?? m.name ?? "Sans titre";
export const yearOf = (m: Media) => (m.release_date ?? m.first_air_date ?? "").slice(0, 4);

export type DiscoverFilters = {
  genre?: string;
  year?: string;
  rating?: string;
  sort?: string;
  page?: number;
};

export async function discover(
  kind: "movie" | "tv",
  f: DiscoverFilters,
): Promise<{ results: Media[]; totalPages: number }> {
  "use cache";
  cacheLife("hours");
  const params: Record<string, string> = {
    sort_by: f.sort || "popularity.desc",
    page: String(f.page ?? 1),
    "vote_count.gte": "100",
  };
  if (f.genre) params.with_genres = f.genre;
  if (f.year) params[kind === "movie" ? "primary_release_year" : "first_air_date_year"] = f.year;
  if (f.rating) params["vote_average.gte"] = f.rating;
  const data = await tmdb<List & { total_pages: number }>(`/discover/${kind}`, params);
  return {
    results: data.results.map((m) => ({ ...m, media_type: kind })),
    totalPages: Math.min(data.total_pages, 500),
  };
}

export type Person = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  combined_credits?: { cast: Media[] };
};

export async function getPerson(id: number): Promise<Person> {
  "use cache";
  cacheLife("hours");
  return tmdb<Person>(`/person/${id}`, { append_to_response: "combined_credits" });
}
