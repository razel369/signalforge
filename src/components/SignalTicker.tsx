import type { Signal } from "@/lib/types";

type Props = { signals: Signal[] };

export function SignalTicker({ signals }: Props) {
  const items = signals.slice(0, 12);
  const doubled = [...items, ...items];

  if (items.length === 0) return null;

  return (
    <div className="ticker-wrap" aria-hidden>
      <div className="ticker-track">
        {doubled.map((s, i) => (
          <span key={`${s.id}-${i}`} className="ticker-item">
            <span className={`ticker-dot ${s.type === "company" ? "!bg-cyan-400" : ""}`} />
            <span className="text-zinc-400">{s.title}</span>
            <span className="font-mono text-orange-400/80">{s.score}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
