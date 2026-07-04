import Link from "next/link";
import { DashboardClient } from "@/components/DashboardClient";
import { AlertSignup } from "@/components/AlertSignup";
import { getSignals } from "@/lib/signals";

export const revalidate = 1800;
export const dynamic = "force-static";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ refresh?: string }>;
}) {
  const params = await searchParams;
  const bundle = await getSignals(params.refresh === "1");

  const stats = [
    { label: "סיגנלים", value: bundle.signals.length, tone: "white" as const },
    { label: "מכרזים", value: bundle.stats.tenders, tone: "orange" as const },
    { label: "חברות", value: bundle.stats.companies, tone: "sky" as const },
    { label: "ציון ממוצע", value: bundle.stats.avgScore, tone: "white" as const },
  ];

  return (
    <main className="dot-grid mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label mb-4">
            <span className="section-label-dot live-dot" />
            נתונים חיים
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">דשבורד</h1>
          <p className="mt-2 font-mono text-sm text-zinc-600">
            עודכן{" "}
            {bundle.stats.lastSync
              ? new Date(bundle.stats.lastSync).toLocaleString("he-IL")
              : "—"}
          </p>
        </div>
        <Link
          href="/dashboard?refresh=1"
          className="btn-secondary !px-5 !py-2.5 !text-sm"
        >
          רענן נתונים
        </Link>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`stat-card stat-card--${s.tone}`}
          >
            <p className="text-sm font-medium text-zinc-600">{s.label}</p>
            <p className="mt-2 font-mono text-3xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <AlertSignup source="dashboard" compact />
      </div>

      <DashboardClient bundle={bundle} />
    </main>
  );
}
