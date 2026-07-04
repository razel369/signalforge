import { promises as fs } from "fs";
import path from "path";
import { fetchRecentCompanies } from "./datagov";
import { fetchActiveTenders } from "./rmi";
import { rankSignals, scoreCompany, scoreTender } from "./scoring";
import type { Signal, SignalBundle } from "./types";

const CACHE_FILE = path.join(process.cwd(), "data", "signals-cache.json");
const FRESH_MS = 30 * 60 * 1000; // 30 min
const STALE_MS = 24 * 60 * 60 * 1000; // 24 h fallback

type CacheEntry = { bundle: SignalBundle; at: number };

let memCache: { bundle: SignalBundle; at: number } | null = null;

async function readDisk(): Promise<CacheEntry | null> {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as CacheEntry;
    if (parsed?.bundle?.signals && typeof parsed.at === "number") return parsed;
  } catch {}
  return null;
}

async function writeDisk(entry: CacheEntry): Promise<void> {
  try {
    await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await fs.writeFile(CACHE_FILE, JSON.stringify(entry), "utf-8");
  } catch {}
}

function freshEnough(at: number): boolean {
  return Date.now() - at < FRESH_MS;
}

export async function syncSignals(): Promise<SignalBundle> {
  const [tenders, companies] = await Promise.all([
    fetchActiveTenders().catch(() => []),
    fetchRecentCompanies(50).catch(() => []),
  ]);

  const tenderSignals = rankSignals(tenders.map(scoreTender)).slice(0, 80);
  const companySignals = rankSignals(companies.map(scoreCompany))
    .filter((s) => s.score >= 40)
    .slice(0, 25);

  const signals = rankSignals([...tenderSignals, ...companySignals]).slice(0, 100);

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

  const entry = { bundle, at: Date.now() };
  memCache = entry;
  await writeDisk(entry);
  return bundle;
}

export async function getSignals(force = false): Promise<SignalBundle> {
  if (force) {
    return syncSignals();
  }

  if (memCache && freshEnough(memCache.at)) {
    return memCache.bundle;
  }

  const disk = await readDisk();
  if (disk) {
    memCache = disk;
    if (freshEnough(disk.at)) return disk.bundle;

    if (Date.now() - disk.at < STALE_MS) {
      // Stale-while-revalidate: return stale bundle, refresh in background.
      void syncSignals().catch(() => {});
      return disk.bundle;
    }
  }

  return syncSignals();
}