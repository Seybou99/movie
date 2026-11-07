import Image from "next/image";
import { IMG, type Genre, type Media, type MovieDetails, titleOf, yearOf } from "@/lib/tmdb";
import { checkAvailability } from "@/lib/availability";
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
        <p className="mt-4 max-w-3xl text-zinc-300">{media.overview || "Pas de synopsis disponible."}</p>

        <div className="mt-8">
          {unavailable ? (
            <p className="rounded bg-zinc-900 p-4 text-zinc-400">
              Ce titre n&apos;est pas disponible sur le lecteur pour le moment.
            </p>
          ) : kind === "tv" ? (
            <Player type="tv" tmdbId={media.id} seasons={seasons ?? [{ season_number: 1, episode_count: 1 }]} />
          ) : (
            <Player type="movie" tmdbId={media.id} />
          )}
        </div>

        {media.credits && media.credits.cast.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-2 text-lg font-semibold">Casting</h2>
            <p className="text-sm text-zinc-400">
              {media.credits.cast
                .slice(0, 12)
                .map((c) => c.name)
                .join(", ")}
            </p>
          </section>
        )}
      </div>

      <div className="mt-10">
        <Row title="Titres similaires" items={media.similar?.results ?? []} kind={kind} />
      </div>
    </>
  );
}
