"use client";

import { useMyList } from "@/lib/library";
import SavedCard from "./SavedCard";

export default function MyListGrid() {
  const items = useMyList();
  if (!items.length)
    return (
      <p className="text-zinc-400">
        Ta liste est vide. Clique sur le « + » d&apos;une affiche pour l&apos;ajouter ici.
      </p>
    );
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4">
      {items.map((s) => (
        <SavedCard key={`${s.type}-${s.id}`} item={s} />
      ))}
    </div>
  );
}
