import type { Metadata } from "next";
import Browse from "@/components/Browse";

export const metadata: Metadata = { title: "Séries — Moviez" };

export default function SeriesPage() {
  return <Browse kind="tv" />;
}
