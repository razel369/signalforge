import Link from "next/link";

export default function NotFound() {
  return (
    <main className="dot-grid mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <div className="relative">
        <div className="absolute -inset-12 -z-10 rounded-full bg-orange-500/10 blur-3xl" aria-hidden />
        <p className="font-mono text-7xl font-bold tracking-tighter text-white sm:text-8xl">
          404
        </p>
      </div>
      <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">הדף לא נמצא</h1>
      <p className="mt-3 max-w-md text-zinc-400">
        הקישור שחיפשת לא קיים או פג תוקף. אולי זה הזמן לבדוק סיגנלים חדשים?
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary btn-glow">
          חזרה לדף הבית
        </Link>
        <Link href="/dashboard" className="btn-secondary">
          פתח דשבורד
        </Link>
      </div>
    </main>
  );
}