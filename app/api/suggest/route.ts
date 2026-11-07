import { type NextRequest, NextResponse } from "next/server";
import { search, titleOf, yearOf } from "@/lib/tmdb";

// La clé TMDB reste côté serveur : le navigateur appelle cette route.
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);
  try {
    const results = await search(q);
    return NextResponse.json(
      [...results]
        .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
        .slice(0, 7)
        .map((m) => ({
        id: m.id,
        type: m.media_type,
        title: titleOf(m),
        year: yearOf(m),
        poster: m.poster_path,
      })),
    );
  } catch {
    return NextResponse.json([]);
  }
}
