import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import DetailView from "@/components/DetailView";
import { getTv, IMG, titleOf, yearOf } from "@/lib/tmdb";

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tvId = Number(id);
  if (!Number.isInteger(tvId)) notFound();
  const show = await getTv(tvId).catch(() => null);
  if (!show) notFound();
  const seasons = show.seasons.filter((s) => s.season_number > 0);
  return <DetailView media={show} kind="tv" seasons={seasons} />;
}

export async function generateMetadata({ params }: PageProps<"/tv/[id]">): Promise<Metadata> {
  const id = Number((await params).id);
  const m = Number.isInteger(id) ? await getTv(id).catch(() => null) : null;
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

export default function TvPage({ params }: PageProps<"/tv/[id]">) {
  return (
    <Suspense fallback={<div className="p-10 text-zinc-500">Chargement…</div>}>
      <Content params={params} />
    </Suspense>
  );
}
