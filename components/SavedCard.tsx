"use client";

import Image from "next/image";
import Link from "next/link";
const IMG = "https://image.tmdb.org/t/p";
import { type Progress, type Saved, removeProgress } from "@/lib/library";
import MyListButton from "./MyListButton";

export default function SavedCard({
  item,
  resume,
}: {
  item: Saved | Progress;
  resume?: boolean;
}) {
  const p = item as Progress;
  return (
    <div className="group relative w-36 shrink-0 sm:w-44">
      <Link href={`/${item.type}/${item.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-zinc-800 transition group-hover:scale-105 group-hover:ring-2 group-hover:ring-white/70">
          {item.poster ? (
            <Image
              src={`${IMG}/w342${item.poster}`}
              alt={item.title}
              fill
              sizes="176px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-2 text-center text-sm text-zinc-400">
              {item.title}
            </div>
          )}
        </div>
        <p className="mt-2 truncate text-sm text-zinc-200">{item.title}</p>
        <p className="text-xs text-zinc-500">
          {resume && item.type === "tv" && p.season
            ? `S${p.season} · É${p.episode ?? 1}`
            : item.year}
        </p>
      </Link>
      {resume ? (
        <button
          type="button"
          aria-label="Retirer de la liste Continuer"
          title="Retirer"
          onClick={() => removeProgress(item)}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white ring-1 ring-white/60 hover:bg-black"
        >
          ✕
        </button>
      ) : (
        <MyListButton item={item} />
      )}
    </div>
  );
}
