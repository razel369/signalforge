"use client";

import { useState } from "react";
import Link from "next/link";

type Status = "idle" | "sending" | "sent" | "error";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [devLink, setDevLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDevLink(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/auth/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        devLink?: string;
      };
      if (!data.ok) {
        setError(data.error ?? "שגיאה");
        setStatus("error");
        return;
      }
      setStatus("sent");
      if (data.devLink) setDevLink(data.devLink);
    } catch {
      setError("שגיאת רשת");
      setStatus("error");
    }
  }

  return (
    <main className="dot-grid mx-auto flex max-w-md flex-col items-center px-6 py-24">
      <div className="glass-sm w-full p-8">
        <h1 className="text-2xl font-bold text-white">התחבר ל-SignalForge</h1>
        <p className="mt-2 text-sm text-zinc-500">
          נשלח לך קישור התחברות חד־פעמי. בלי סיסמה.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-zinc-400">
              אימייל
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-1.5"
              placeholder="you@company.com"
              dir="ltr"
            />
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-primary btn-glow w-full disabled:opacity-60"
          >
            {status === "sending" ? "שולח…" : "שלח קישור התחברות"}
          </button>
        </form>

        {status === "sent" && (
          <div className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-300">
            <p>הקישור נשלח למייל שלך.</p>
            {devLink && (
              <p className="mt-2 break-all text-xs text-amber-300">
                <strong>Dev mode:</strong>{" "}
                <a href={devLink} className="underline" target="_blank" rel="noreferrer">
                  {devLink}
                </a>
              </p>
            )}
          </div>
        )}

        {status === "error" && error && (
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-zinc-600">
          <Link href="/" className="hover:text-white">
            חזרה לדף הבית
          </Link>
        </p>
      </div>
    </main>
  );
}