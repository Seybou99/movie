import { Suspense } from "react";
import { notFound } from "next/navigation";
import DetailView from "@/components/DetailView";
import { getTv } from "@/lib/tmdb";

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tvId = Number(id);
  if (!Number.isInteger(tvId)) notFound();
  const show = await getTv(tvId).catch(() => null);
  if (!show) notFound();
  const seasons = show.seasons.filter((s) => s.season_number > 0);
  return <DetailView media={show} kind="tv" seasons={seasons} />;
}

export default function TvPage({ params }: PageProps<"/tv/[id]">) {
  return (
    <Suspense fallback={<div className="p-10 text-zinc-500">Chargement…</div>}>
      <Content params={params} />
    </Suspense>
  );
}
