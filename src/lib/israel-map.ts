import type { Zone } from "./regions";
import { ZONE_MARKERS } from "./regions";
import type { Signal } from "./types";

export function countByZone(signals: Signal[]): Map<Zone, number> {
  const counts = new Map<Zone, number>();
  for (const s of signals) {
    const z = s.zone as Zone;
    if (ZONE_MARKERS[z]) {
      counts.set(z, (counts.get(z) ?? 0) + 1);
    }
  }
  return counts;
}

export function markerIntensity(count: number, max: number): number {
  if (count <= 0) return 0.2;
  if (max <= 0) return 0.4;
  return 0.4 + (count / max) * 0.6;
}

export { ZONE_MARKERS };
