import { Suspense } from "react";
import { notFound } from "next/navigation";
import DetailView from "@/components/DetailView";
import { getMovie } from "@/lib/tmdb";

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movieId = Number(id);
  if (!Number.isInteger(movieId)) notFound();
  const movie = await getMovie(movieId).catch(() => null);
  if (!movie) notFound();
  return <DetailView media={movie} kind="movie" />;
}

export default function MoviePage({ params }: PageProps<"/movie/[id]">) {
  return (
    <Suspense fallback={<div className="p-10 text-zinc-500">Chargement…</div>}>
      <Content params={params} />
    </Suspense>
  );
}
