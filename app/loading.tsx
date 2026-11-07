export default function Loading() {
  return (
    <div className="px-4 py-10 sm:px-10" aria-busy="true">
      <div className="mb-8 h-[40vh] animate-pulse rounded-lg bg-zinc-900" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-[2/3] w-36 shrink-0 animate-pulse rounded-md bg-zinc-900 sm:w-44" />
        ))}
      </div>
    </div>
  );
}
