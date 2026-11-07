"use client";

import { useEffect, useRef, useState } from "react";
import type { Saved } from "@/lib/library";
import SavedCard from "./SavedCard";

const MOVIE_GENRES: [string, string][] = [
  ["28", "Action"], ["12", "Aventure"], ["16", "Animation"], ["35", "Comédie"], ["80", "Crime"],
  ["99", "Documentaire"], ["18", "Drame"], ["10751", "Famille"], ["14", "Fantastique"],
  ["36", "Histoire"], ["27", "Horreur"], ["10402", "Musique"], ["9648", "Mystère"],
  ["10749", "Romance"], ["878", "Science-fiction"], ["53", "Thriller"], ["10752", "Guerre"],
  ["37", "Western"],
];
const TV_GENRES: [string, string][] = [
  ["10759", "Action & Aventure"], ["16", "Animation"], ["35", "Comédie"], ["80", "Crime"],
  ["99", "Documentaire"], ["18", "Drame"], ["10751", "Famille"], ["9648", "Mystère"],
  ["10765", "Science-fiction & Fantastique"], ["10768", "Guerre & Politique"], ["37", "Western"],
];
const SORTS: [string, string][] = [
  ["popularity.desc", "Popularité"],
  ["vote_average.desc", "Mieux notés"],
  ["primary_release_date.desc", "Plus récents"],
];

type Page = { items: Saved[]; hasMore: boolean };

export default function Browse({ kind }: { kind: "movie" | "tv" }) {
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("popularity.desc");
  const [items, setItems] = useState<Saved[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const seq = useRef(0);

  // Un changement de filtre repart de la page 1 ; "Charger plus" ajoute la page suivante.
  useEffect(() => {
    const id = ++seq.current;
    const ctrl = new AbortController();
    const sortBy =
      kind === "tv" && sort === "primary_release_date.desc" ? "first_air_date.desc" : sort;
    const qs = new URLSearchParams({ kind, page: String(page), sort: sortBy });
    if (genre) qs.set("genre", genre);
    if (year) qs.set("year", year);
    if (rating) qs.set("rating", rating);
    fetch(`/api/discover?${qs}`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json() as Promise<Page>;
      })
      .then((d) => {
        if (id !== seq.current) return;
        setItems((prev) => (page === 1 ? d.items : [...prev, ...d.items]));
        setHasMore(d.hasMore);
        setError(false);
        setLoading(false);
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setError(true);
        setLoading(false);
      });
    return () => ctrl.abort();
  }, [kind, genre, year, rating, sort, page]);

  const change = (set: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    set(e.target.value);
    setPage(1);
    setLoading(true);
  };

  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => String(thisYear - i));
  const sel = "rounded bg-zinc-900 px-2 py-1.5 text-sm ring-1 ring-zinc-700";
  const genres = kind === "movie" ? MOVIE_GENRES : TV_GENRES;

  return (
    <div className="px-4 py-8 sm:px-10">
      <h1 className="mb-6 text-2xl font-bold">{kind === "movie" ? "Films" : "Séries"}</h1>

      <div className="mb-8 flex flex-wrap gap-3">
        <select aria-label="Genre" className={sel} value={genre} onChange={change(setGenre)}>
          <option value="">Tous les genres</option>
          {genres.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select aria-label="Année" className={sel} value={year} onChange={change(setYear)}>
          <option value="">Toutes les années</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select aria-label="Note minimale" className={sel} value={rating} onChange={change(setRating)}>
          <option value="">Toutes les notes</option>
          {["9", "8", "7", "6", "5"].map((r) => (
            <option key={r} value={r}>★ {r}+</option>
          ))}
        </select>
        <select aria-label="Tri" className={sel} value={sort} onChange={change(setSort)}>
          {SORTS.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-400">Impossible de charger les titres. Réessaie.</p>}
      {!loading && !error && items.length === 0 && (
        <p className="text-zinc-400">Aucun titre ne correspond à ces filtres.</p>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4">
        {items.map((s) => (
          <SavedCard key={`${s.type}-${s.id}`} item={s} />
        ))}
      </div>

      {loading && <p className="mt-6 text-zinc-500">Chargement…</p>}
      {!loading && hasMore && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setPage((p) => p + 1);
            }}
            className="rounded bg-zinc-800 px-6 py-2 font-semibold hover:bg-zinc-700"
          >
            Charger plus
          </button>
        </div>
      )}
    </div>
  );
}
