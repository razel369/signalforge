import Link from "next/link";
import type { Metadata } from "next";
import { AlertSignup } from "@/components/AlertSignup";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SignalCard } from "@/components/SignalCard";
import { filterSignalsForNiche } from "@/lib/filter-signals";
import { getNicheBySlug, NICHE_PAGES } from "@/lib/seo-pages";
import { getSignals } from "@/lib/signals";

export const revalidate = 3600;
export const dynamic = "force-static";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return NICHE_PAGES.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const niche = getNicheBySlug(slug);
  if (!niche) return { title: "לא נמצא" };

  return {
    title: `${niche.name} 2026 | SignalForge`,
    description: niche.description,
    keywords: niche.keywords,
  };
}

export default async function NicheMichrazimPage({ params }: Props) {
  const { slug } = await params;
  const niche = getNicheBySlug(slug);
  if (!niche) {
    return (
      <main className="dot-grid mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl text-white">נושא לא נמצא</h1>
        <Link href="/michrazim" className="mt-4 inline-block text-orange-400">
          חזרה
        </Link>
      </main>
    );
  }

  const bundle = await getSignals();
  const matched = filterSignalsForNiche(bundle.signals, niche);
  const display =
    matched.length > 0
      ? matched.slice(0, 12)
      : bundle.signals.filter((s) => s.type === "tender").slice(0, 6);

  return (
    <main className="dot-grid mx-auto max-w-6xl px-6 py-12">
      <Breadcrumbs
        items={[
          { label: "מכרזים", href: "/michrazim" },
          { label: niche.name },
        ]}
      />

      <header className="page-hero">
        <p className="section-label mb-5">
          <span className="section-label-dot" />
          תחום
        </p>
        <h1>{niche.name}</h1>
        <p className="mt-4 max-w-2xl text-zinc-500">{niche.description}</p>
      </header>

      <div className="mb-10">
        <AlertSignup source={`niche-${niche.slug}`} compact />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          {matched.length > 0 ? `${matched.length} סיגנלים` : "מכרזים פעילים"}
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
