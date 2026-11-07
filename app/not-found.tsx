import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 py-24 text-center">
      <h1 className="text-4xl font-extrabold">Introuvable</h1>
      <p className="mt-3 text-zinc-400">Ce film, cette série ou cette page n&apos;existe pas.</p>
      <Link href="/" className="mt-6 inline-block rounded bg-white px-5 py-2 font-semibold text-black">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
