"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Suggestion = {
  id: number;
  type: "movie" | "tv";
  title: string;
  year: string;
  poster: string | null;
};

export default function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const box = useRef<HTMLDivElement>(null);

  // Suggestions : on attend 250 ms après la dernière frappe, et on annule les requêtes périmées.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(term)}`, {
          signal: ctrl.signal,
        });
        setItems((await res.json()) as Suggestion[]);
        setActive(-1);
        setOpen(true);
      } catch {
        /* requête annulée */
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  // Ferme la liste quand on clique ailleurs.
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const go = (s: Suggestion) => {
    setOpen(false);
    setQ("");
    router.push(`/${s.type}/${s.id}`);
  };

  const visible = open && q.trim().length >= 2 && items.length > 0;

  return (
    <div ref={box} className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (active >= 0 && items[active]) return go(items[active]);
          if (q.trim()) {
            setOpen(false);
            router.push(`/search?q=${encodeURIComponent(q.trim())}`);
          }
        }}
      >
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            if (e.target.value.trim().length < 2) setItems([]);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => (a + 1) % Math.max(items.length, 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => (a <= 0 ? items.length - 1 : a - 1));
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="Rechercher un film, une série…"
          role="combobox"
          aria-expanded={visible}
          aria-controls="suggestions"
          aria-autocomplete="list"
          autoComplete="off"
          className="w-40 rounded bg-zinc-900 px-3 py-1.5 text-sm outline-none ring-1 ring-zinc-700 focus:ring-white sm:w-72"
        />
      </form>

      {visible && (
        <ul
          id="suggestions"
          role="listbox"
          className="absolute right-0 mt-2 w-72 overflow-hidden rounded-md bg-zinc-900 shadow-xl ring-1 ring-zinc-700 sm:w-96"
        >
          {items.map((s, i) => (
            <li key={`${s.type}-${s.id}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                onClick={() => go(s)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left ${
                  i === active ? "bg-zinc-800" : ""
                }`}
              >
                <span className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-zinc-800">
                  {s.poster && (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${s.poster}`}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm text-white">{s.title}</span>
                  <span className="block text-xs text-zinc-400">
                    {s.type === "tv" ? "Série" : "Film"}
                    {s.year && ` · ${s.year}`}
                  </span>
                </span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push(`/search?q=${encodeURIComponent(q.trim())}`);
              }}
              className="w-full border-t border-zinc-800 px-3 py-2 text-left text-xs text-zinc-400 hover:bg-zinc-800"
            >
              Voir tous les résultats pour « {q.trim()} »
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
