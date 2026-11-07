import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Row from "@/components/Row";
import { IMG, getByGenre, getList, getTrending, titleOf } from "@/lib/tmdb";

async function Hero() {
  const trending = await getTrending();
  const featured = trending.find((m) => m.backdrop_path) ?? trending[0];
  if (!featured) return null;
  const type = featured.media_type === "tv" ? "tv" : "movie";
  return (
    <div className="relative h-[60vh] w-full">
      {featured.backdrop_path && (
        <Image
          src={`${IMG}/w1280${featured.backdrop_path}`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute bottom-10 left-4 max-w-xl sm:left-10">
        <h1 className="text-3xl font-extrabold sm:text-5xl">{titleOf(featured)}</h1>
        <p className="mt-3 line-clamp-3 text-zinc-200">{featured.overview}</p>
        <Link
          href={`/${type}/${featured.id}`}
          className="mt-5 inline-block rounded bg-white px-6 py-2 font-semibold text-black hover:bg-zinc-300"
        >
          ▶ Lecture
        </Link>
      </div>
    </div>
  );
}

async function Rows() {
  const [trending, popMovies, topMovies, popTv, action, comedy] = await Promise.all([
    getTrending(),
    getList("movie", "popular"),
    getList("movie", "top_rated"),
    getList("tv", "popular"),
    getByGenre("movie", 28),
    getByGenre("movie", 35),
  ]);
  return (
    <>
      <Row title="Tendances de la semaine" items={trending} />
      <Row title="Films populaires" items={popMovies} kind="movie" />
      <Row title="Séries populaires" items={popTv} kind="tv" />
      <Row title="Les mieux notés" items={topMovies} kind="movie" />
      <Row title="Action" items={action} kind="movie" />
      <Row title="Comédie" items={comedy} kind="movie" />
    </>
  );
}

export default function Home() {
  return (
    <>
      <Suspense fallback={<div className="h-[60vh] bg-zinc-900" />}>
        <Hero />
      </Suspense>
      <div className="mt-6">
        <Suspense fallback={<p className="px-10 text-zinc-500">Chargement…</p>}>
          <Rows />
        </Suspense>
      </div>
    </>
  );
}
