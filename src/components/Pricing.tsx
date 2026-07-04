import Link from "next/link";
import { PricingCtaButton } from "./PricingCtaButton";
import { PRICING_TIERS } from "@/lib/pricing";

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="section-label mx-auto mb-5 w-fit">תמחור B2B</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">בחר את התוכנית</h2>
          <p className="mx-auto mt-4 max-w-md text-zinc-500">
            לצוותים שצריכים לתפוס מכרזים בזמן — לא מנוי צרכני.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {PRICING_TIERS.map((tier) => {
            const isFree = tier.price === 0;
            const isCustom = tier.price === null;
            const priceText = isFree ? "חינם" : isCustom ? "מותאם" : `$${tier.price}`;
            const intervalText = isFree || isCustom ? "" : `/${tier.interval === "month" ? "חודש" : tier.interval}`;
            return (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-2xl p-8 ${
                  tier.highlight
                    ? "glass border-orange-500/25 shadow-[0_0_60px_rgba(249,115,22,0.08)]"
                    : "glass-sm"
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-l from-orange-400 to-orange-600 px-3.5 py-1 text-xs font-bold text-white shadow-lg shadow-orange-500/30">
                    מומלץ
                  </span>
                )}
                <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                <p className="mt-5 font-mono text-4xl font-bold tracking-tight text-white">
                  {priceText}
                  {intervalText && (
                    <span className="text-base font-normal text-zinc-500">{intervalText}</span>
                  )}
                </p>
                <p className="mt-2 text-sm text-zinc-500">{tier.tagline}</p>
                <ul className="mt-7 flex-1 space-y-3.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-400">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-xs text-orange-400">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  {isFree ? (
                    <Link
                      href="/dashboard"
                      className="btn-secondary block w-full !rounded-xl !py-3"
                    >
                      {tier.cta}
                    </Link>
                  ) : (
                    <PricingCtaButton tierId={tier.id} ctaLabel={tier.cta} highlight={tier.highlight} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-12 text-center text-sm text-zinc-600">
          <Link href="/dashboard" className="font-medium text-orange-400 hover:text-orange-300">
            הדשבורד החי בחינם ←
          </Link>
        </p>
      </div>
    </section>
  );
}