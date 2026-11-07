"use client";

import { useState } from "react";
import { LANGS, type Lang, playerUrl } from "@/lib/moviez";

type Props =
  | { type: "movie"; tmdbId: number }
  | {
      type: "tv";
      tmdbId: number;
      seasons: { season_number: number; episode_count: number }[];
    };

export default function Player(props: Props) {
  const [lang, setLang] = useState<Lang>("auto");
  const [season, setSeason] = useState(
    props.type === "tv" ? (props.seasons[0]?.season_number ?? 1) : 1,
  );
  const [episode, setEpisode] = useState(1);

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
  });

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
          </>
        )}
      </div>
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black ring-1 ring-zinc-800">
        <iframe
          key={src}
          src={src}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          className="h-full w-full border-0"
          title="Lecteur"
        />
      </div>
    </div>
  );
}
