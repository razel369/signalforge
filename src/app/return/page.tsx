import { Suspense } from "react";
import { ReturnView } from "@/components/ReturnView";

export const dynamic = "force-dynamic";

export default function ReturnPage() {
  return (
    <Suspense
      fallback={
        <main className="dot-grid mx-auto flex max-w-md flex-col items-center px-6 py-32 text-center">
          <p className="text-zinc-400">בודקים את החיוב…</p>
        </main>
      }
    >
      <ReturnView />
    </Suspense>
  );
}