import type { Signal } from "@/lib/types";
import { HeroFeed } from "./HeroFeed";
import { IsraelRadar } from "./IsraelRadar";

type Props = {
  signals: Signal[];
  lastSync: string | null;
};

export function HeroVisual({ signals, lastSync }: Props) {
  const syncLabel = lastSync
    ? new Date(lastSync).toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="hero-command glass animate-fade-up overflow-hidden" style={{ animationDelay: "100ms" }}>
      <div className="hero-command-header">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-30" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
          </span>
          <span className="text-sm font-semibold text-zinc-200">מרכז סיגנלים חי</span>
        </div>
        <span className="rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-zinc-500">
          עודכן {syncLabel}
        </span>
      </div>

      <div className="hero-command-body">
        <div className="hero-command-map">
          <IsraelRadar signals={signals} signalCount={signals.length} />
        </div>

        <div className="hero-command-divider" aria-hidden />

        <div className="hero-command-feed">
          <HeroFeed signals={signals} lastSync={lastSync} embedded />
        </div>
      </div>
    </div>
  );
}
