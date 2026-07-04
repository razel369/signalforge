import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#04040a]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-lg font-bold text-white">
              Signal<span className="text-orange-400">Forge</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">
              מנוע סיגנלים B2B ישראלי. מכרזי רמ״י וחברות חדשות — מדורגים, מסוננים, מוכנים לפעולה.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">מוצר</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/dashboard" className="text-zinc-400 hover:text-white">דשבורד</Link></li>
              <li><Link href="/michrazim" className="text-zinc-400 hover:text-white">מכרזים לפי עיר</Link></li>
              <li><Link href="/#pricing" className="text-zinc-400 hover:text-white">תמחור</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">מקורות</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="https://apps.land.gov.il" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white">
                  רמ״י
                </a>
              </li>
              <li>
                <a href="https://data.gov.il" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white">
                  data.gov.il
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-zinc-600">
          <p>© 2026 SignalForge · נתונים ממקורות ממשלתיים פתוחים</p>
          <p>לא קשור לרשות מקרקעי ישראל או לממשלת ישראל</p>
        </div>
      </div>
    </footer>
  );
}
