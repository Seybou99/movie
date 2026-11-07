import Link from "next/link";
import { Suspense } from "react";
import SearchBox from "./SearchBox";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-gradient-to-b from-black to-black/60 px-4 py-3 backdrop-blur sm:px-10">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
        <Link href="/" className="text-2xl font-extrabold tracking-wide text-red-600">
          AFI BEBE
        </Link>
        {[
          ["/movies", "Films"],
          ["/series", "Séries"],
          ["/my-list", "Ma liste"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="text-sm text-zinc-300 hover:text-white">
            {label}
          </Link>
        ))}      </div>
      <Suspense fallback={null}>
        <SearchBox />
      </Suspense>
    </header>
  );
}
