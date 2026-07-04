"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type MeResponse =
  | { authenticated: false }
  | {
      authenticated: true;
      email: string;
      plan: "pro" | "enterprise" | null;
      status: string | null;
      current_period_end: string | null;
    };

const MAX_POLLS = 30; // 30 × 2s = 60s

export function ReturnView() {
  const [state, setState] = useState<"loading" | "paid" | "pending" | "not-signed-in">(
    "loading",
  );
  const [plan, setPlan] = useState<"pro" | "enterprise" | null>(null);
  const polls = useRef(0);

  useEffect(() => {
    let cancelled = false;
    async function tick() {
      if (cancelled) return;
      polls.current += 1;
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = (await res.json()) as MeResponse;
      if (cancelled) return;
      if (!data.authenticated) {
        setState("not-signed-in");
        return;
      }
      if (data.plan) {
        setPlan(data.plan);
        setState("paid");
        return;
      }
      if (polls.current >= MAX_POLLS) {
        setState("pending");
        return;
      }
      setTimeout(tick, 2000);
    }
    tick();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <main className="dot-grid mx-auto flex max-w-md flex-col items-center px-6 py-32 text-center">
        <p className="text-zinc-400">מאמתים חיוב…</p>
      </main>
    );
  }

  if (state === "not-signed-in") {
    return (
      <main className="dot-grid mx-auto flex max-w-md flex-col items-center px-6 py-32 text-center">
        <p className="text-zinc-300">יש להתחבר כדי לסיים את הרכישה.</p>
        <Link href="/signin" className="btn-primary mt-6">
          התחבר
        </Link>
      </main>
    );
  }

  if (state === "pending") {
    return (
      <main className="dot-grid mx-auto flex max-w-md flex-col items-center px-6 py-32 text-center">
        <p className="text-zinc-300">החיוב עוד מתעדכן אצלנו.</p>
        <p className="mt-2 text-sm text-zinc-600">זה לוקח עד 10 שניות.</p>
        <Link href="/dashboard" className="btn-secondary mt-6">
          חזור לדשבורד
        </Link>
      </main>
    );
  }

  return (
    <main className="dot-grid mx-auto flex max-w-md flex-col items-center px-6 py-32 text-center">
      <div className="rounded-full bg-orange-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300 ring-1 ring-orange-500/30">
        חיוב הושלם
      </div>
      <h1 className="mt-6 text-3xl font-bold text-white">
        ברוך הבא ל-{plan === "pro" ? "Pro" : "Enterprise"}
      </h1>
      <p className="mt-3 text-zinc-400">
        המנוי פעיל. כל הסיגנלים חיים וההתראות פתוחות.
      </p>
      <Link href="/dashboard" className="btn-primary btn-glow mt-8">
        פתח דשבורד
      </Link>
    </main>
  );
}