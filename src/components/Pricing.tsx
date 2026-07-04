import Link from "next/link";

export function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "₪1,490",
      desc: "30 סיגנלים בשבוע · מייל יומי",
      features: ["מכרזי רמ״י", "חברות חדשות", "דירוג אוטומטי"],
    },
    {
      name: "Pro",
      price: "₪3,990",
      highlight: true,
      desc: "100 סיגנלים · Webhook + API",
      features: ["סינון לפי אזור", "התראות מיידיות", "ייצוא CRM"],
    },
    {
      name: "Enterprise",
      price: "מותאם",
      desc: "מקורות מותאמים · SLA · white-label",
      features: ["מקורות נוספים", "SLA", "white-label"],
    },
  ];

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
          {tiers.map((tier) => (
            <div
              key={tier.name}
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
                {tier.price}
                {tier.price !== "מותאם" && (
                  <span className="text-base font-normal text-zinc-500">/חודש</span>
                )}
              </p>
              <p className="mt-2 text-sm text-zinc-500">{tier.desc}</p>
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
                {tier.highlight ? (
                  <a
                    href="mailto:hello@signalforge.co.il?subject=Pro"
                    className="btn-primary block w-full !rounded-xl !py-3"
                  >
                    בקש גישת Pro
                  </a>
                ) : tier.name === "Starter" ? (
                  <Link
                    href="/dashboard"
                    className="btn-secondary block w-full !rounded-xl !py-3"
                  >
                    התחל בחינם
                  </Link>
                ) : (
                  <a
                    href="mailto:hello@signalforge.co.il?subject=Enterprise"
                    className="btn-secondary block w-full !rounded-xl !py-3"
                  >
                    צור קשר
                  </a>
                )}
              </div>
            </div>
          ))}
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
