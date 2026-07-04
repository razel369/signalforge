import { fetchRecentCompanies } from "./datagov";
import { fetchActiveTenders } from "./rmi";
import { rankSignals, scoreCompany, scoreTender } from "./scoring";
import type { Signal, SignalBundle } from "./types";

let cache: { bundle: SignalBundle; at: number } | null = null;
const CACHE_TTL_MS = 30 * 60 * 1000;

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export async function syncSignals(): Promise<SignalBundle> {
  const [tenders, companies] = await Promise.all([
    withTimeout(fetchActiveTenders(), 25_000, []),
    withTimeout(fetchRecentCompanies(30), 15_000, []),
  ]);

  const tenderSignals = rankSignals(tenders.map(scoreTender)).slice(0, 50);
  const companySignals = rankSignals(companies.map(scoreCompany))
    .filter((s) => s.score >= 40)
    .slice(0, 15);

  const signals = rankSignals([...tenderSignals, ...companySignals]).slice(0, 60);

  const bundle: SignalBundle = {
    signals,
    stats: {
      tenders: signals.filter((s) => s.type === "tender").length,
      companies: signals.filter((s) => s.type === "company").length,
      avgScore:
        signals.length > 0
          ? Math.round(
              signals.reduce((sum, s) => sum + s.score, 0) / signals.length,
            )
          : 0,
      lastSync: new Date().toISOString(),
    },
  };

  cache = { bundle, at: Date.now() };
  return bundle;
}

export async function getSignals(force = false): Promise<SignalBundle> {
  if (!force && cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.bundle;
  }
  return syncSignals();
}
