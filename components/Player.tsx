"use client";

import { useEffect, useState } from "react";
import { type Saved, saveProgress } from "@/lib/library";
import { LANGS, type Lang, playerUrl } from "@/lib/moviez";

type Props =
  | { type: "movie"; tmdbId: number; item: Saved }
  | {
      type: "tv";
      tmdbId: number;
      item: Saved;
      seasons: { season_number: number; episode_count: number }[];
      start?: { season: number; episode: number };
    };

export default function Player(props: Props) {
  const [lang, setLang] = useState<Lang>("auto");
  const [season, setSeason] = useState(
    props.type === "tv" ? (props.start?.season ?? props.seasons[0]?.season_number ?? 1) : 1,
  );
  const [episode, setEpisode] = useState(props.type === "tv" ? (props.start?.episode ?? 1) : 1);
  const [autoNext, setAutoNext] = useState(true);
  const [autoplay, setAutoplay] = useState(false);

  const episodeCount =
    props.type === "tv"
      ? (props.seasons.find((s) => s.season_number === season)?.episode_count ?? 1)
      : 0;

  const src = playerUrl({
    tmdbId: props.tmdbId,
    type: props.type,
    season,
    episode,
    lang,
    autoplay,
    next: autoNext,
  });

  const seasonList = props.type === "tv" ? props.seasons : [];
  const nextSeason = seasonList.find((s) => s.season_number > season);
  const hasNext = props.type === "tv" && (episode < episodeCount || !!nextSeason);
  const goNext = () => {
    setAutoplay(true);
    if (episode < episodeCount) setEpisode(episode + 1);
    else if (nextSeason) {
      setSeason(nextSeason.season_number);
      setEpisode(1);
    }
  };

  const { item } = props;
  const isTv = props.type === "tv";
  useEffect(() => {
    saveProgress(item, isTv ? season : undefined, isTv ? episode : undefined);
  }, [item, isTv, season, episode]);

  const select = "rounded bg-zinc-900 px-2 py-1 text-sm ring-1 ring-zinc-700";

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="text-sm text-zinc-400">
          Langue{" "}
          <select className={select} value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
            {LANGS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        {props.type === "tv" && (
          <>
            <label className="text-sm text-zinc-400">
              Saison{" "}
              <select
                className={select}
                value={season}
                onChange={(e) => {
                  setSeason(Number(e.target.value));
                  setEpisode(1);
                }}
              >
                {props.seasons.map((s) => (
                  <option key={s.season_number} value={s.season_number}>
                    {s.season_number}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-zinc-400">
              Épisode{" "}
              <select
                className={select}
                value={episode}
                onChange={(e) => setEpisode(Number(e.target.value))}
              >
                {Array.from({ length: episodeCount }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={goNext}
              disabled={!hasNext}
              className="rounded bg-zinc-800 px-3 py-1 text-sm font-semibold hover:bg-zinc-700 disabled:opacity-40"
            >
              Épisode suivant ▶
            </button>
            <label className="flex items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={autoNext}
                onChange={(e) => setAutoNext(e.target.checked)}
              />
              Enchaîner automatiquement
            </label>
          </>
        )}
      </div>
      {props.type === "tv" && (
        <p className="mb-3 text-xs text-zinc-500">
          Tous les épisodes ne sont pas forcément disponibles. Si le lecteur indique « pas encore
          disponible », essaie une autre saison ou un autre épisode.
        </p>
      )}
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black ring-1 ring-zinc-800">
        <iframe
          key={src}
          src={src}
          allowFullScreen
          // Bloque les pop-ups / redirections du lecteur (il s'ouvrait dans un nouvel onglet).
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
          allow="autoplay; fullscreen; picture-in-picture"
          className="h-full w-full border-0"
          title="Lecteur"
        />
      </div>
    </div>
  );
}
