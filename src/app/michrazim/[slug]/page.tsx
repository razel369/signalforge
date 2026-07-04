import Link from "next/link";
import type { Metadata } from "next";
import { AlertSignup } from "@/components/AlertSignup";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SignalCard } from "@/components/SignalCard";
import { filterSignalsByRegion, filterSignalsForCity } from "@/lib/filter-signals";
import { getCityBySlug, CITY_PAGES } from "@/lib/seo-pages";
import { getSignals } from "@/lib/signals";

export const revalidate = 3600;
export const dynamic = "force-static";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CITY_PAGES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return { title: "לא נמצא" };

  return {
    title: `מכרזים ${city.name} 2026 | SignalForge`,
    description: `מכרזים פעילים ב${city.name} — מדורגים לפי דחיפות ופוטנציאל.`,
    keywords: city.keywords,
  };
}

export default async function CityMichrazimPage({ params }: Props) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) {
    return (
      <main className="dot-grid mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl text-white">עיר לא נמצאה</h1>
        <Link href="/michrazim" className="mt-4 inline-block text-orange-400">
          חזרה
        </Link>
      </main>
    );
  }

  const bundle = await getSignals();
  const exact = filterSignalsForCity(bundle.signals, city);
  const hasExact = exact.length > 0;

  // Regional fallback only kicks in when zero exact matches exist, so the
  // page is never broken — but the heading always disambiguates.
  const regional = hasExact ? [] : filterSignalsByRegion(bundle.signals, city);

  const display = (hasExact ? exact : regional).slice(0, 12);
  const mode: "exact" | "regional" | "empty" = hasExact
    ? "exact"
    : regional.length > 0
      ? "regional"
      : "empty";

  return (
    <main className="dot-grid mx-auto max-w-6xl px-6 py-12">
      <Breadcrumbs
        items={[
          { label: "מכרזים לפי עיר", href: "/michrazim" },
          { label: city.name },
        ]}
      />

      <header className="page-hero">
        <p className="section-label mb-5">
          <span className="section-label-dot" />
          {city.region}
        </p>
        <h1>
          {mode === "exact"
            ? `מכרזים ${city.name}`
            : mode === "regional"
              ? `מכרזים באזור ${city.region}`
              : `מכרזים ${city.name}`}
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-500">
          {mode === "exact"
            ? `סיגנלים חיים ב${city.name} — מדורגים לפי דחיפות ופוטנציאל.`
            : mode === "regional"
              ? `אין כרגע סיגנלים ספציפיים ב${city.name} — מציגים את הסיגנלים החמים באזור ${city.region}.`
              : `עדיין אין סיגנלים פעילים ב${city.name} — בקרוב ייפתחו כאן מכרזים חדשים.`}
        </p>
      </header>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: mode === "exact" ? "סיגנלים בעיר" : mode === "regional" ? "סיגנלים באזור" : "סיגנלים בעיר",
            value: display.length,
          },
          { label: "מכרזים כללי", value: bundle.stats.tenders },
          { label: "ציון ממוצע", value: bundle.stats.avgScore },
        ].map((s) => (
          <div key={s.label} className="stat-card stat-card--orange">
            <p className="text-sm text-zinc-600">{s.label}</p>
            <p className="mt-2 font-mono text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <AlertSignup source={`city-${city.slug}`} city={city.name} compact />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          {mode === "exact"
            ? `${exact.length} סיגנלים ב${city.name}`
            : mode === "regional"
              ? `${regional.length} סיגנלים באזור ${city.region}`
              : `בקרוב ייפתחו מכרזים חדשים ב${city.name}`}
        </h2>
        <Link href="/dashboard" className="text-sm font-medium text-orange-400 hover:text-orange-300">
          דשבורד ←
        </Link>
      </div>

      {mode === "empty" ? (
        <div className="glass-sm p-10 text-center text-zinc-500">
          בקרוב ייפתחו מכרזים חדשים ב{city.name}. הירשם להתראות כדי לקבל עדכון ראשון.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {display.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      )}
    </main>
  );
}
