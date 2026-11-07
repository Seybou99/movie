import type { Media } from "@/lib/tmdb";
import PosterCard from "./PosterCard";

export default function Row({
  title,
  items,
  kind,
}: {
  title: string;
  items: Media[];
  kind?: "movie" | "tv";
}) {
  if (!items.length) return null;
  return (
    <section className="mb-8">
      <h2 className="mb-3 px-4 text-lg font-semibold sm:px-10 sm:text-xl">{title}</h2>
      <div className="flex gap-3 overflow-x-auto px-4 pb-3 sm:px-10">
        {items.map((m) => (
          <PosterCard key={m.id} media={m} kind={kind} />
        ))}
      </div>
    </section>
  );
}
