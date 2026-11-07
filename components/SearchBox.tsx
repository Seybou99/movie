"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      }}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher un film, une série…"
        className="w-40 rounded bg-zinc-900 px-3 py-1.5 text-sm outline-none ring-1 ring-zinc-700 focus:ring-white sm:w-72"
      />
    </form>
  );
}
