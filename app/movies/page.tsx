import type { Metadata } from "next";
import Browse from "@/components/Browse";

export const metadata: Metadata = { title: "Films — Moviez" };

export default function MoviesPage() {
  return <Browse kind="movie" />;
}
