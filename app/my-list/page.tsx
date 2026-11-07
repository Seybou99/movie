import type { Metadata } from "next";
import MyListGrid from "@/components/MyListGrid";

export const metadata: Metadata = { title: "Ma liste — Moviez" };

export default function MyListPage() {
  return (
    <div className="px-4 py-8 sm:px-10">
      <h1 className="mb-6 text-2xl font-bold">Ma liste</h1>
      <MyListGrid />
    </div>
  );
}
