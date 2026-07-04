"use client";

import { useMemo, useState } from "react";
import { filterSignals, type SignalFilters } from "@/lib/filter-signals";
import type { Signal, SignalBundle } from "@/lib/types";
import { SignalCard } from "./SignalCard";

const REGIONS = ["הכל", "צפון", "מרכז", "דרום", "ירושלים", "תל אביב והמרכז"];

export function DashboardClient({ bundle }: { bundle: SignalBundle }) {
  const [type, setType] = useState<"" | "tender" | "company">("");
  const [query, setQuery] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [region, setRegion] = useState("הכל");
  const [urgency, setUrgency] = useState<"" | Signal["urgency"]>("");

  const filters: SignalFilters = useMemo(
    () => ({
      type: type || undefined,
      query: query || undefined,
      minScore: minScore || undefined,
      region: region !== "הכל" ? region : undefined,
      urgency: urgency || undefined,
    }),
    [type, query, minScore, region, urgency],
  );

  const filtered = useMemo(
    () => filterSignals(bundle.signals, filters),
    [bundle.signals, filters],
  );

  return (
    <>
      <div className="glass-sm mb-8 space-y-5 p-6">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["", "הכל"],
              ["tender", "מכרזים"],
              ["company", "חברות"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => setType(val)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                type === val
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="search"
            placeholder="חיפוש..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field"
          />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="input-field"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r} className="bg-zinc-900">
                {r === "הכל" ? "כל האזורים" : r}
              </option>
            ))}
          </select>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as "" | Signal["urgency"])}
            className="input-field"
          >
            <option value="" className="bg-zinc-900">כל הדחיפויות</option>
            <option value="critical" className="bg-zinc-900">דחוף</option>
            <option value="high" className="bg-zinc-900">גבוה</option>
            <option value="medium" className="bg-zinc-900">בינוני</option>
            <option value="low" className="bg-zinc-900">נמוך</option>
          </select>
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/25 px-4 py-2">
            <span className="shrink-0 text-xs font-medium text-zinc-600">ציון מינ׳</span>
            <input
              type="range"
              min={0}
              max={90}
              step={10}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <span className="w-7 text-center font-mono text-sm font-semibold text-orange-400">
              {minScore}
            </span>
          </div>
        </div>

        <p className="text-sm text-zinc-600">
          <span className="font-semibold text-zinc-400">{filtered.length}</span>
          {" "}מתוך {bundle.signals.length} סיגנלים
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-sm py-16 text-center">
          <p className="text-zinc-500">אין תוצאות לסינון הנוכחי.</p>
          <p className="mt-1 text-sm text-zinc-600">נסה להוריד את הציון המינימלי או לשנות את האזור.</p>
        </div>
      )}
    </>
  );
}
