import { Suspense } from "react";
import PosterCard from "@/components/PosterCard";
import { search } from "@/lib/tmdb";

async function Results({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim();
  if (!q) return <p className="text-zinc-400">Tape un titre dans la barre de recherche.</p>;
  const results = await search(q);
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Résultats pour « {q} »</h1>
      {results.length === 0 ? (
        <p className="text-zinc-400">Aucun résultat.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4">
          {results.map((m) => (
            <PosterCard key={`${m.media_type}-${m.id}`} media={m} />
          ))}
        </div>
      )}
    </>
  );
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <div className="px-4 py-8 sm:px-10">
      <Suspense fallback={<p className="text-zinc-500">Recherche…</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
