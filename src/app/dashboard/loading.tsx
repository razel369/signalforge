export default function Loading() {
  return (
    <main className="dot-grid mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <div className="h-6 w-32 animate-pulse rounded bg-white/[0.06]" />
        <div className="mt-4 h-10 w-64 animate-pulse rounded bg-white/[0.06]" />
      </div>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="stat-card stat-card--white">
            <div className="h-4 w-20 animate-pulse rounded bg-white/[0.06]" />
            <div className="mt-3 h-9 w-24 animate-pulse rounded bg-white/[0.08]" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass h-[180px] animate-pulse rounded-2xl border-white/[0.06] p-5"
          />
        ))}
      </div>
    </main>
  );
}