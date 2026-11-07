"use client";

import { type Saved, toggleMyList, useMyList } from "@/lib/library";

export default function MyListButton({
  item,
  variant = "overlay",
}: {
  item: Saved;
  variant?: "overlay" | "full";
}) {
  const inList = useMyList().some((x) => x.id === item.id && x.type === item.type);
  const label = inList ? "Retirer de ma liste" : "Ajouter à ma liste";

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggleMyList(item)}
        className="rounded bg-zinc-800 px-4 py-2 text-sm font-semibold hover:bg-zinc-700"
      >
        {inList ? "✓ Dans ma liste" : "+ Ma liste"}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => toggleMyList(item)}
      className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold ring-1 ring-white/60 transition ${
        inList ? "bg-white text-black" : "bg-black/70 text-white hover:bg-black"
      }`}
    >
      {inList ? "✓" : "+"}
    </button>
  );
}
