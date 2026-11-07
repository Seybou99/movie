import Image from "next/image";
import Link from "next/link";
import { IMG, type Media, titleOf, yearOf } from "@/lib/tmdb";

export default function PosterCard({ media, kind }: { media: Media; kind?: "movie" | "tv" }) {
  const type = kind ?? (media.media_type === "tv" ? "tv" : "movie");
  return (
    <Link
      href={`/${type}/${media.id}`}
      className="group relative block w-36 shrink-0 sm:w-44"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-zinc-800 transition group-hover:scale-105 group-hover:ring-2 group-hover:ring-white/70">
        {media.poster_path ? (
          <Image
            src={`${IMG}/w342${media.poster_path}`}
            alt={titleOf(media)}
            fill
            sizes="176px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-2 text-center text-sm text-zinc-400">
            {titleOf(media)}
          </div>
        )}
      </div>
      <p className="mt-2 truncate text-sm text-zinc-200">{titleOf(media)}</p>
      <p className="text-xs text-zinc-500">{yearOf(media)}</p>
    </Link>
  );
}
