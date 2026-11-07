// Lecteur moviez.ac — voir https://api.moviez.ac/#player
const BASE = "https://api.moviez.ac";

export type Lang = "auto" | "vf" | "vostfr" | "vo";
export const LANGS: { value: Lang; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "vf", label: "VF" },
  { value: "vostfr", label: "VOSTFR" },
  { value: "vo", label: "VO" },
];

export function playerUrl(opts: {
  tmdbId: number | string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  lang?: Lang;
  autoplay?: boolean;
  next?: boolean; // enchaîne automatiquement l'épisode suivant (séries)
}) {
  const path =
    opts.type === "tv"
      ? `${BASE}/serie/${opts.tmdbId}/${opts.season ?? 1}/${opts.episode ?? 1}`
      : `${BASE}/${opts.tmdbId}`;
  const qs = new URLSearchParams();
  if (opts.autoplay) qs.set("autoplay", "1");
  if (opts.type === "tv" && opts.next) qs.set("next", "1");
  if (opts.lang && opts.lang !== "auto") qs.set("lang", opts.lang);
  const s = qs.toString();
  return s ? `${path}?${s}` : path;
}
