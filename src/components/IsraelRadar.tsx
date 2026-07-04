import Image from "next/image";
import type { Signal } from "@/lib/types";
import type { Zone } from "@/lib/regions";
import { countByZone, markerIntensity, ZONE_MARKERS } from "@/lib/israel-map";

type Props = { signals: Signal[]; signalCount: number };

export function IsraelRadar({ signals, signalCount }: Props) {
  const zoneCounts = countByZone(signals);
  const maxCount = Math.max(1, ...zoneCounts.values());
  const zones = Object.keys(ZONE_MARKERS) as Zone[];

  return (
    <div className="radar-stage-v2">
      <div className="radar-canvas relative aspect-[4/5] w-full">
        <div className="radar-map-glow" aria-hidden />
        <div className="radar-sweep-subtle" aria-hidden />

        <div className="radar-map-frame">
          <Image
            src="/israel-radar-base.png"
            alt="מפת סיגנלים — ישראל"
            fill
            priority
            className="radar-map-image object-contain"
            sizes="(max-width: 540px) 50vw, 280px"
          />

          <svg viewBox="0 0 100 100" className="radar-overlay" aria-hidden>
            <defs>
              <radialGradient id="blip-tender" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fb923c" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="blip-company" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
              </radialGradient>
              <filter id="blip-glow">
                <feGaussianBlur stdDeviation="1.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {zones.map((zone) => {
              const m = ZONE_MARKERS[zone];
              const count = zoneCounts.get(zone) ?? 0;
              const active = count > 0;
              const intensity = markerIntensity(count, maxCount);
              const hasTender = signals.some(
                (s) => s.zone === zone && s.type === "tender",
              );
              const fill = hasTender ? "url(#blip-tender)" : "url(#blip-company)";
              const r = 1.8 + (count / maxCount) * 2.4;

              return (
                <g key={zone} transform={`translate(${m.x}, ${m.y})`}>
                  {active && (
                    <circle
                      r={r * 3}
                      fill={fill}
                      opacity={intensity * 0.3}
                      className="radar-blip-pulse"
                    />
                  )}
                  <circle
                    r={r}
                    fill={active ? "#fb923c" : "#52525b"}
                    opacity={active ? intensity : 0.25}
                    filter={active ? "url(#blip-glow)" : undefined}
                  />
                  <circle r={0.85} fill="white" opacity={active ? 1 : 0.2} />
                </g>
              );
            })}
          </svg>

          <div className="radar-labels" aria-hidden>
            {zones
              .filter((z) => (zoneCounts.get(z) ?? 0) > 0)
              .map((zone) => {
                const m = ZONE_MARKERS[zone];
                const count = zoneCounts.get(zone) ?? 0;
                return (
                  <span
                    key={zone}
                    className="radar-label"
                    style={{ left: `${m.x}%`, top: `${m.y}%` }}
                  >
                    {m.label}
                    <span className="radar-label-count">{count}</span>
                  </span>
                );
              })}
          </div>

          <div className="radar-map-vignette" aria-hidden />
        </div>
      </div>

      <div className="radar-footer">
        <div className="radar-count-pill">
          <span className="font-mono text-xl font-bold text-white">{signalCount}</span>
          <span className="text-[11px] font-medium text-zinc-500">סיגנלים פעילים</span>
        </div>
        <div className="radar-legend">
          <span className="radar-legend-item">
            <span className="radar-legend-dot radar-legend-dot--tender" />
            מכרז רמ״י
          </span>
          <span className="radar-legend-item">
            <span className="radar-legend-dot radar-legend-dot--company" />
            חברה חדשה
          </span>
        </div>
      </div>
    </div>
  );
}
