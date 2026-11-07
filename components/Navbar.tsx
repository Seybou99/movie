import Link from "next/link";
import { Suspense } from "react";
import SearchBox from "./SearchBox";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-gradient-to-b from-black to-black/60 px-4 py-3 backdrop-blur sm:px-10">
      <Link href="/" className="text-2xl font-extrabold tracking-wide text-red-600">
        MOVIEZ
      </Link>
      <Suspense fallback={null}>
        <SearchBox />
      </Suspense>
    </header>
  );
}
