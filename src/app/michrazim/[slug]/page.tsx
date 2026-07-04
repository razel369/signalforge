import Link from "next/link";
import type { Metadata } from "next";
import { AlertSignup } from "@/components/AlertSignup";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SignalCard } from "@/components/SignalCard";
import { filterSignalsForCity } from "@/lib/filter-signals";
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
  const local = filterSignalsForCity(bundle.signals, city);
  const display =
    local.length > 0
      ? local.slice(0, 12)
      : bundle.signals.filter((s) => s.type === "tender").slice(0, 6);

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
        <h1>מכרזים {city.name}</h1>
        <p className="mt-4 max-w-2xl text-zinc-500">
          סיגנלים חיים באזור {city.region} — מדורגים לפי דחיפות ופוטנציאל.
        </p>
      </header>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {[
          { label: "סיגנלים בעיר", value: local.length || display.length },
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
          {local.length > 0
            ? `${local.length} סיגנלים ב${city.name}`
            : `מכרזים באזור ${city.region}`}
        </h2>
        <Link href="/dashboard" className="text-sm font-medium text-orange-400 hover:text-orange-300">
          דשבורד ←
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {display.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    </main>
  );
}
