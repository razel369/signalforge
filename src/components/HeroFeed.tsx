import Link from "next/link";
import type { Signal } from "@/lib/types";
import { SignalCard } from "./SignalCard";

type Props = {
  signals: Signal[];
  lastSync: string | null;
  embedded?: boolean;
};

export function HeroFeed({ signals, lastSync, embedded }: Props) {
  const preview = signals.slice(0, 4);

  const list = (
    <>
      <div className={embedded ? "divide-y divide-white/[0.05]" : "divide-y divide-white/[0.05]"}>
        {preview.length > 0 ? (
          preview.map((signal, i) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              variant="compact"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))
        ) : (
          <p className="px-6 py-12 text-center text-sm text-zinc-500">טוען סיגנלים...</p>
        )}
      </div>

      <div className="border-t border-white/[0.06] bg-white/[0.02] px-6 py-3.5 text-center">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-orange-400 transition hover:text-orange-300"
        >
          כל הסיגנלים ←
        </Link>
      </div>
    </>
  );

  if (embedded) {
    return <div className="flex h-full flex-col">{list}</div>;
  }

  const syncLabel = lastSync
    ? new Date(lastSync).toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="glass overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-30" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
          </span>
          <span className="text-sm font-semibold text-zinc-200">סיגנלים חיים</span>
        </div>
        <span className="rounded-md bg-black/30 px-2 py-1 font-mono text-[11px] text-zinc-500">
          עודכן {syncLabel}
        </span>
      </div>
      {list}
    </div>
  );
}
