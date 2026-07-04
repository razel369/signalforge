import type { CityPage, NichePage } from "./seo-pages";
import type { Signal, SignalType } from "./types";

export type SignalFilters = {
  type?: SignalType;
  query?: string;
  minScore?: number;
  region?: string;
  urgency?: Signal["urgency"];
};

export function filterSignals(signals: Signal[], filters: SignalFilters): Signal[] {
  let out = signals;

  if (filters.type) {
    out = out.filter((s) => s.type === filters.type);
  }
  if (filters.minScore != null && filters.minScore > 0) {
    out = out.filter((s) => s.score >= filters.minScore!);
  }
  if (filters.region) {
    const r = filters.region.toLowerCase();
    out = out.filter(
      (s) =>
        s.zone.toLowerCase().includes(r) ||
        s.region.toLowerCase().includes(r) ||
        s.city.toLowerCase().includes(r) ||
        s.subtitle.toLowerCase().includes(r),
    );
  }
  if (filters.urgency) {
    out = out.filter((s) => s.urgency === filters.urgency);
  }
  if (filters.query?.trim()) {
    const q = filters.query.trim().toLowerCase();
    out = out.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.zone.toLowerCase().includes(q),
    );
  }

  return out;
}

/**
 * Exact city match only. Case-insensitive, whitespace-trimmed, no regional
 * fallback here — the page layer is responsible for deciding whether to
 * surface a regional fallback when no exact matches exist.
 */
export function filterSignalsForCity(signals: Signal[], city: CityPage): Signal[] {
  const target = city.name.trim().toLowerCase();
  return signals.filter((s) => s.city.trim().toLowerCase() === target);
}

/**
 * Regional fallback filtered by zone. Used only when the exact city match
 * returns zero results.
 */
export function filterSignalsByRegion(signals: Signal[], city: CityPage): Signal[] {
  const region = city.region.trim();
  return signals.filter((s) => s.zone === region || s.region === region);
}

export function filterSignalsForNiche(signals: Signal[], niche: NichePage): Signal[] {
  if (niche.slug === "mishari" || niche.slug === "bniya") {
    return signals.filter((s) => s.type === "tender");
  }
  if (niche.slug === "rechesh") {
    return signals.filter(
      (s) =>
        s.type === "tender" ||
        (s.type === "company" && Number(s.score) >= 50),
    );
  }
  return signals.filter((s) => {
    const blob = `${s.title} ${s.subtitle}`.toLowerCase();
    return niche.keywords.some((k) => blob.includes(k.replace("מכרזי ", "").replace("מכרז ", "")));
  });
}
