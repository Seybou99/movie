"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
      <p className="mt-2 text-zinc-400">Le catalogue n&apos;a pas répondu. Réessaie dans un instant.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded bg-white px-5 py-2 font-semibold text-black"
      >
        Réessayer
      </button>
    </div>
  );
}
