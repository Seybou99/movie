import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import DetailView from "@/components/DetailView";
import { getMovie, IMG, titleOf, yearOf } from "@/lib/tmdb";

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movieId = Number(id);
  if (!Number.isInteger(movieId)) notFound();
  const movie = await getMovie(movieId).catch(() => null);
  if (!movie) notFound();
  return <DetailView media={movie} kind="movie" />;
}

export async function generateMetadata({ params }: PageProps<"/movie/[id]">): Promise<Metadata> {
  const id = Number((await params).id);
  const m = Number.isInteger(id) ? await getMovie(id).catch(() => null) : null;
  if (!m) return { title: "Introuvable — Moviez" };
  const title = `${titleOf(m)} (${yearOf(m)}) — Moviez`;
  const image = m.backdrop_path ?? m.poster_path;
  return {
    title,
    description: m.overview.slice(0, 160),
    openGraph: {
      title,
      description: m.overview.slice(0, 160),
      images: image ? [`${IMG}/w780${image}`] : undefined,
    },
  };
}

export default function MoviePage({ params }: PageProps<"/movie/[id]">) {
  return (
    <Suspense fallback={<div className="p-10 text-zinc-500">Chargement…</div>}>
      <Content params={params} />
    </Suspense>
  );
}
