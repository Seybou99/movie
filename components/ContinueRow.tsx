"use client";

import { useProgress } from "@/lib/library";
import SavedCard from "./SavedCard";

export default function ContinueRow() {
  const items = useProgress();
  if (!items.length) return null;
  return (
    <section className="mb-8">
      <h2 className="mb-3 px-4 text-lg font-semibold sm:px-10 sm:text-xl">Continuer à regarder</h2>
      <div className="flex gap-3 overflow-x-auto px-4 pb-3 sm:px-10">
        {items.map((p) => (
          <SavedCard key={`${p.type}-${p.id}`} item={p} resume />
        ))}
      </div>
    </section>
  );
}
