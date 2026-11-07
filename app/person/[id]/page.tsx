import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import PosterCard from "@/components/PosterCard";
import { IMG, type Media, getPerson } from "@/lib/tmdb";

async function load(params: Promise<{ id: string }>) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const person = await getPerson(id).catch(() => null);
  if (!person) notFound();
  return person;
}

export async function generateMetadata({ params }: PageProps<"/person/[id]">): Promise<Metadata> {
  const p = await load(params);
  return {
    title: `${p.name} — Moviez`,
    description: p.biography.slice(0, 160) || `Filmographie de ${p.name}`,
  };
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const p = await load(params);
  const seen = new Set<string>();
  const credits: Media[] = [];
  for (const c of [...(p.combined_credits?.cast ?? [])].sort(
    (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0),
  )) {
    const key = `${c.media_type}-${c.id}`;
    if ((c.media_type === "movie" || c.media_type === "tv") && !seen.has(key)) {
      seen.add(key);
      credits.push(c);
    }
  }

  return (
    <div className="px-4 py-8 sm:px-10">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative aspect-[2/3] w-44 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
          {p.profile_path && (
            <Image
              src={`${IMG}/w342${p.profile_path}`}
              alt={p.name}
              fill
              sizes="176px"
              className="object-cover"
            />
          )}
        </div>
        <div className="max-w-3xl">
          <h1 className="text-3xl font-extrabold">{p.name}</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {[p.known_for_department, p.birthday, p.place_of_birth].filter(Boolean).join(" · ")}
          </p>
          <p className="mt-4 whitespace-pre-line text-zinc-300">
            {p.biography ? p.biography.slice(0, 1200) : "Pas de biographie disponible en français."}
          </p>
        </div>
      </div>

      <h2 className="mb-4 mt-10 text-xl font-semibold">Filmographie</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4">
        {credits.slice(0, 60).map((c) => (
          <PosterCard key={`${c.media_type}-${c.id}`} media={c} />
        ))}
      </div>
    </div>
  );
}

export default function PersonPage({ params }: PageProps<"/person/[id]">) {
  return (
    <Suspense fallback={<div className="p-10 text-zinc-500">Chargement…</div>}>
      <Content params={params} />
    </Suspense>
  );
}
