import Link from "next/link";
import { AlertSignup } from "@/components/AlertSignup";
import { AuroraBg } from "@/components/AuroraBg";
import { HeroVisual } from "@/components/HeroVisual";
import { Pricing } from "@/components/Pricing";
import { SignalTicker } from "@/components/SignalTicker";
import { getSignals } from "@/lib/signals";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const bundle = await getSignals();

  return (
    <main>
      {/* Hero */}
      <section className="hero-cinematic">
        <AuroraBg />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="animate-fade-up">
              <p className="section-label mb-8">
                <span className="section-label-dot live-dot" />
                מנוע הסיגנלים הישראלי
              </p>

              <h1 className="display-hero text-white">
                תפוס
                <br />
                <span className="display-hero-accent">מכרזים</span>
                <br />
                לפני כולם
              </h1>

            <p className="mt-7 max-w-md text-lg leading-relaxed text-zinc-400">
              מכרזי קרקע מרמ״י וחברות חדשות מרשם החברות — מדורגים לפי דחיפות, עיר ופוטנציאל.
            </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/dashboard" className="btn-primary btn-glow">
                  פתח דשבורד
                </Link>
                <Link href="/michrazim" className="btn-secondary">
                  מכרזים לפי עיר
                </Link>
              </div>

              <dl className="mt-14 grid grid-cols-3 gap-6">
                {[
                  { label: "סיגנלים", value: bundle.signals.length },
                  { label: "מכרזים", value: bundle.stats.tenders },
                  { label: "ציון ממוצע", value: bundle.stats.avgScore },
                ].map((s) => (
                  <div key={s.label} className="stat-card stat-card--orange !p-4">
                    <dt className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                      {s.label}
                    </dt>
                    <dd className="stat-num mt-2">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <HeroVisual signals={bundle.signals} lastSync={bundle.stats.lastSync} />
          </div>
        </div>
      </section>

      <SignalTicker signals={bundle.signals} />

      {/* Bento features */}
      <section className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <p className="section-label mx-auto mb-5 w-fit">למה אנחנו שונים</p>
            <h2 className="font-display text-3xl text-white sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              לא עוד רשימה. מנוע סיגנלים.
            </h2>
          </div>

          <div className="bento-grid">
            <div className="bento-card bento-card--orange bento-wide">
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">מקורות רשמיים</p>
              <h3 className="mt-3 text-2xl font-bold text-white">API ישיר מרמ״י ו-data.gov.il</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
                לא CSV ישן, לא scraping שבור. נתונים חיים כל שעה, ישירות מהמקור.
              </p>
            </div>

            <div className="bento-card bento-card--violet">
              <p className="bento-stat">{bundle.stats.avgScore}</p>
              <p className="mt-2 text-sm text-zinc-500">ציון ממוצע</p>
            </div>

            <div className="bento-card bento-card--cyan">
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">דירוג</p>
              <h3 className="mt-2 text-xl font-bold text-white">0–99 חכם</h3>
              <p className="mt-2 text-sm text-zinc-500">ימים לסגירה, גודל, רלוונטיות.</p>
            </div>

            <div className="bento-card bento-card--orange">
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">B2B</p>
              <h3 className="mt-2 text-xl font-bold text-white">מוכן למכירה</h3>
              <p className="mt-2 text-sm text-zinc-500">סינון, מייל, CRM, Webhook.</p>
            </div>

            <div className="bento-card bento-card--violet bento-wide">
              <p className="bento-stat">{bundle.signals.length}</p>
              <p className="mt-2 text-lg font-semibold text-white">סיגנלים פעילים עכשיו</p>
              <p className="mt-1 text-sm text-zinc-500">מכרזים וחברות חדשות — מדורגים ומוכנים.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-t border-white/[0.06] py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">משלושה שלבים לסיגנל</h2>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { n: "01", title: "סריקה", desc: "רמ״י + רשם החברות, כל שעה." },
              { n: "02", title: "דירוג", desc: "ציון לפי דחיפות ופוטנציאל." },
              { n: "03", title: "פעולה", desc: "סינון, התראות, ייצוא." },
            ].map((step) => (
              <div key={step.n} className="glass-sm p-8 text-center">
                <span className="step-num mx-auto mb-6">{step.n}</span>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm text-zinc-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alert */}
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="gradient-border">
          <div className="gradient-border-inner">
            <AlertSignup source="landing" />
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-bold text-white">מכרזים לפי עיר</h2>
        <p className="mt-2 text-zinc-500">15 ערים · נתונים חיים</p>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {[
            ["tel-aviv", "תל אביב"],
            ["haifa", "חיפה"],
            ["jerusalem", "ירושלים"],
            ["beer-sheva", "באר שבע"],
            ["ashdod", "אשדוד"],
            ["netanya", "נתניה"],
          ].map(([slug, name]) => (
            <Link
              key={slug}
              href={`/michrazim/${slug}`}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-400 transition hover:border-orange-500/40 hover:bg-orange-500/[0.08] hover:text-white"
            >
              {name}
            </Link>
          ))}
          <Link
            href="/michrazim"
            className="rounded-full bg-gradient-to-l from-orange-500/20 to-violet-500/20 px-4 py-2.5 text-sm font-semibold text-orange-300 transition hover:from-orange-500/30"
          >
            כל הערים
          </Link>
        </div>
      </section>

      <Pricing />
    </main>
  );
}
