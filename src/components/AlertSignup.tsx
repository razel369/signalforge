"use client";

import { useState } from "react";

type Props = {
  source?: string;
  city?: string;
  compact?: boolean;
};

export function AlertSignup({ source = "landing", city, compact }: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim() || undefined,
          source,
          city,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "שגיאה");
      setStatus("ok");
      setMessage("נרשמת בהצלחה. נשלח סיגנלים חמים לאימייל שלך.");
      setEmail("");
      setPhone("");
    } catch (err) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "שגיאה בהרשמה");
    }
  }

  if (status === "ok") {
    return (
      <div className="glass-sm p-8 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
          ✓
        </div>
        <p className="font-medium text-sky-300">{message}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={
        compact
          ? "glass-sm flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
          : "p-8"
      }
    >
      {!compact && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white">קבל התראות לפני סגירה</h3>
          <p className="mt-2 text-sm text-zinc-500">
            סיגנלים מדורגים ישירות למייל.{city ? ` · ${city}` : ""}
          </p>
        </div>
      )}
      <div className={compact ? "flex flex-1 flex-col gap-3 sm:flex-row" : "space-y-3"}>
        <input
          type="email"
          required
          placeholder="אימייל עסקי"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        {!compact && (
          <input
            type="tel"
            placeholder="טלפון (אופציונלי)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
          />
        )}
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary shrink-0 !rounded-xl disabled:opacity-50"
      >
        {status === "loading" ? "שולח..." : "הירשם"}
      </button>
      {status === "err" && (
        <p className={`text-sm text-red-400 ${compact ? "sm:basis-full" : "mt-3"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
