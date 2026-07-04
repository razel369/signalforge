import Link from "next/link";
import { readSession } from "@/lib/auth";
import { getUserPlanCached } from "@/lib/db";

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden className="shrink-0">
      <rect width="28" height="28" rx="8" fill="url(#logo-grad)" />
      <path d="M8 18L14 8L20 18" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 15.5H17.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="28" y2="28">
          <stop stopColor="#fb923c" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const NAV = [
  ["/michrazim", "מכרזים"],
  ["/dashboard", "דשבורד"],
  ["/#pricing", "תמחור"],
] as const;

export async function SiteHeader() {
  const session = await readSession();
  const plan = session ? await getUserPlanCached(session.userId) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#04040a]/70 backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-center gap-2.5 opacity-90 transition hover:opacity-100">
          <LogoMark />
          <span className="text-[1.05rem] font-bold tracking-tight text-white">
            Signal<span className="text-orange-400">Forge</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {NAV.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-4 py-2 text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            plan?.plan ? (
              <span className="rounded-full bg-orange-500/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300 ring-1 ring-orange-500/30">
                {plan.plan === "pro" ? "Pro" : "Enterprise"}
              </span>
            ) : (
              <Link
                href="/#pricing"
                className="rounded-full bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-orange-500/30 hover:bg-orange-500/15"
              >
                שדרג ל-Pro
              </Link>
            )
          ) : (
            <Link
              href="/signin"
              className="rounded-full bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/[0.07] hover:text-white"
            >
              התחבר
            </Link>
          )}
          <Link href="/dashboard" className="btn-primary !px-4 !py-2.5 !text-sm sm:!px-5">
            פתח דשבורד
          </Link>
        </div>
      </div>
    </header>
  );
}