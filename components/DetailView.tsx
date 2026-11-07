import Image from "next/image";
import Link from "next/link";
import { IMG, type Genre, type Media, type MovieDetails, titleOf, yearOf } from "@/lib/tmdb";
import { checkAvailability } from "@/lib/availability";
import MyListButton from "./MyListButton";
import Row from "./Row";
import Player from "./Player";

export default async function DetailView({
  media,
  kind,
  seasons,
}: {
  media: MovieDetails | (Media & { genres: Genre[]; credits?: MovieDetails["credits"]; similar?: { results: Media[] } });
  kind: "movie" | "tv";
  seasons?: { season_number: number; episode_count: number }[];
}) {
  const availability = await checkAvailability(media.id);
  const m = /\/serie\/\d+\/(\d+)\/(\d+)/.exec(String(availability?.embed ?? ""));
  const start = m ? { season: Number(m[1]), episode: Number(m[2]) } : undefined;
  const item = {
    id: media.id,
    type: kind,
    title: titleOf(media),
    poster: media.poster_path,
    year: yearOf(media),
  };
  const unavailable = availability?.available === false;
  const runtime = "runtime" in media && media.runtime ? `${media.runtime} min` : null;

  return (
    <>
      <div className="relative h-[40vh] w-full sm:h-[55vh]">
        {media.backdrop_path && (
          <Image
            src={`${IMG}/w1280${media.backdrop_path}`}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 sm:px-10">
          <h1 className="text-3xl font-extrabold sm:text-5xl">{titleOf(media)}</h1>
          <p className="mt-2 text-sm text-zinc-300">
            {[
              yearOf(media),
              runtime,
              media.genres.map((g) => g.name).join(", "),
              `★ ${media.vote_average.toFixed(1)}`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-10">
        <div className="mt-4">
          <MyListButton item={item} variant="full" />
        </div>
        <p className="mt-4 max-w-3xl text-zinc-300">{media.overview || "Pas de synopsis disponible."}</p>

        <div className="mt-8">
          {unavailable ? (
            <p className="rounded bg-zinc-900 p-4 text-zinc-400">
              Ce titre n&apos;est pas disponible sur le lecteur pour le moment.
            </p>
          ) : kind === "tv" ? (
            <Player type="tv" tmdbId={media.id} item={item} seasons={seasons ?? [{ season_number: 1, episode_count: 1 }]} start={start} />
          ) : (
            <Player type="movie" tmdbId={media.id} item={item} />
          )}
        </div>

        {media.credits && media.credits.cast.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-semibold">Casting</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {media.credits.cast.slice(0, 14).map((c) => (
                <Link key={c.id} href={`/person/${c.id}`} className="w-24 shrink-0 text-center">
                  <span className="relative mx-auto block h-24 w-24 overflow-hidden rounded-full bg-zinc-800">
                    {c.profile_path && (
                      <Image
                        src={`${IMG}/w185${c.profile_path}`}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </span>
                  <span className="mt-2 block truncate text-xs text-zinc-200">{c.name}</span>
                  <span className="block truncate text-xs text-zinc-500">{c.character}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-10">
        <Row title="Titres similaires" items={media.similar?.results ?? []} kind={kind} />
      </div>
    </>
  );
}
