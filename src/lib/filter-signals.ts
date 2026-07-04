import type { CityPage, NichePage } from "./seo-pages";
import { cityMatchesText } from "./seo-pages";
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

export function filterSignalsForCity(signals: Signal[], city: CityPage): Signal[] {
  return signals.filter((s) => {
    if (s.city.includes(city.name) || city.name.includes(s.city)) return true;
    if (s.zone === city.region || s.region === city.region) return true;
    const blob = `${s.title} ${s.subtitle} ${s.city}`;
    return cityMatchesText(city, blob);
  });
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
