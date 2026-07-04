"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PricingTierId } from "@/lib/pricing";

type Props = { tierId: PricingTierId; ctaLabel: string; highlight: boolean };

export function PricingCtaButton({ tierId, ctaLabel, highlight }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      const me = (await res.json()) as { authenticated: boolean };
      if (!me.authenticated) {
        router.push(`/signin?next=checkout&tier=${tierId}`);
        return;
      }

      const out = await fetch("/api/paddle/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId }),
      });
      const data = (await out.json()) as { ok: boolean; url?: string; error?: string };
      if (!data.ok || !data.url) {
        setError(data.error ?? "שגיאה");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("שגיאת רשת");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={
          highlight
            ? "btn-primary btn-glow block w-full !rounded-xl !py-3 disabled:opacity-60"
            : "btn-secondary block w-full !rounded-xl !py-3 disabled:opacity-60"
        }
      >
        {loading ? "מעביר לתשלום…" : ctaLabel}
      </button>
      {error && <p className="mt-2 text-center text-xs text-red-400">{error}</p>}
    </div>
  );
}