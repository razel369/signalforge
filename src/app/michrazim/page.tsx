import Link from "next/link";
import type { Metadata } from "next";
import { AlertSignup } from "@/components/AlertSignup";
import { CITY_PAGES, NICHE_PAGES } from "@/lib/seo-pages";

export const metadata: Metadata = {
  title: "מכרזים לפי עיר ותחום | SignalForge",
  description:
    "מכרזים ממשלתיים ועירוניים בישראל — לפי עיר ולפי תחום. נתונים חיים, דירוג חכם והתראות לפני סגירה.",
};

export default function MichrazimHubPage() {
  return (
    <main className="dot-grid mx-auto max-w-6xl px-6 py-12">
      <header className="mb-12">
        <p className="section-label mb-5">
          <span className="section-label-dot" />
          15 ערים · 5 תחומים
        </p>
        <h1 className="text-4xl font-bold text-white">מכרזים בישראל</h1>
        <p className="mt-3 max-w-xl text-zinc-500">
          בחר עיר או תחום — סיגנלים מדורגים ממקורות רשמיים.
        </p>
      </header>

      <div className="mb-14">
        <AlertSignup source="michrazim-hub" compact />
      </div>

      <section className="mb-16">
        <h2 className="mb-6 text-xl font-bold text-white">לפי עיר</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CITY_PAGES.map((city) => (
            <Link
              key={city.slug}
              href={`/michrazim/${city.slug}`}
              className="glass-sm glass-sm-interactive p-5"
            >
              <span className="font-medium text-white">מכרזים {city.name}</span>
              <span className="mt-1 block font-mono text-xs text-zinc-600">
                {city.region}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold text-white">לפי תחום</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {NICHE_PAGES.map((niche) => (
            <Link
              key={niche.slug}
              href={`/michrazim/niche/${niche.slug}`}
              className="glass-sm glass-sm-interactive p-6"
            >
              <h3 className="font-semibold text-orange-400">{niche.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                {niche.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
