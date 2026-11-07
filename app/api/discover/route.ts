import { type NextRequest, NextResponse } from "next/server";
import { discover, titleOf, yearOf } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const kind = sp.get("kind") === "tv" ? "tv" : "movie";
  const page = Math.max(1, Math.min(500, Number(sp.get("page")) || 1));
  try {
    const { results, totalPages } = await discover(kind, {
      genre: sp.get("genre") ?? undefined,
      year: sp.get("year") ?? undefined,
      rating: sp.get("rating") ?? undefined,
      sort: sp.get("sort") ?? undefined,
      page,
    });
    return NextResponse.json({
      items: results.map((m) => ({
        id: m.id,
        type: kind,
        title: titleOf(m),
        poster: m.poster_path,
        year: yearOf(m),
      })),
      hasMore: page < totalPages,
    });
  } catch {
    return NextResponse.json({ items: [], hasMore: false }, { status: 502 });
  }
}
