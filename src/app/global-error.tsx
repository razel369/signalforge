"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SignalForge] Global error:", error);
  }, [error]);

  return (
    <html lang="he" dir="rtl">
      <body className="min-h-full bg-[#04040a] font-sans text-zinc-50 antialiased">
        <main className="dot-grid mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
          <p className="font-mono text-sm uppercase tracking-wider text-orange-400">
            משהו השתבש
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            שגיאה לא צפויה
          </h1>
          <p className="mt-3 max-w-md text-zinc-400">
            הצלחנו לתעד את הבעיה. נסה לרענן, ואם זה ממשיך — חזור לדף הבית.
          </p>
          {error.digest && (
            <p className="mt-4 font-mono text-xs text-zinc-600">
              קוד: {error.digest}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => reset()} className="btn-primary btn-glow">
              נסה שוב
            </button>
            <Link href="/" className="btn-secondary">
              חזרה לדף הבית
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}