"use client";

import { useSyncExternalStore } from "react";

// "Ma liste" et "Continuer à regarder", stockés dans le navigateur (localStorage).

export type Saved = {
  id: number;
  type: "movie" | "tv";
  title: string;
  poster: string | null;
  year?: string;
};

export type Progress = Saved & { season?: number; episode?: number; updatedAt: number };

const LIST_KEY = "moviez:list";
const PROGRESS_KEY = "moviez:progress";
const EVENT = "moviez:storage";

const EMPTY: never[] = [];
const cache = new Map<string, { raw: string | null; value: unknown[] }>();

function read<T>(key: string): T[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    return EMPTY;
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T[];
  let value: unknown[] = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) value = parsed;
  } catch {
    /* données corrompues : on repart de zéro */
  }
  cache.set(key, { raw, value });
  return value as T[];
}

function write(key: string, value: unknown[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* stockage plein ou bloqué */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

const useStore = <T,>(key: string): T[] =>
  useSyncExternalStore(
    subscribe,
    () => read<T>(key),
    () => EMPTY,
  );

export const useMyList = () => useStore<Saved>(LIST_KEY);
export const useProgress = () => useStore<Progress>(PROGRESS_KEY);

const same = (a: { id: number; type: string }, b: { id: number; type: string }) =>
  a.id === b.id && a.type === b.type;

export function toggleMyList(item: Saved) {
  const list = read<Saved>(LIST_KEY);
  const next = list.some((x) => same(x, item))
    ? list.filter((x) => !same(x, item))
    : [{ ...item }, ...list];
  write(LIST_KEY, next);
}

export function saveProgress(item: Saved, season?: number, episode?: number) {
  const rest = read<Progress>(PROGRESS_KEY).filter((x) => !same(x, item));
  write(PROGRESS_KEY, [{ ...item, season, episode, updatedAt: Date.now() }, ...rest].slice(0, 20));
}

export function removeProgress(item: Saved) {
  write(
    PROGRESS_KEY,
    read<Progress>(PROGRESS_KEY).filter((x) => !same(x, item)),
  );
}
