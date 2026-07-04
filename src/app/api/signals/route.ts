import { NextResponse } from "next/server";
import { filterSignals } from "@/lib/filter-signals";
import { getSignals } from "@/lib/signals";
import type { SignalType } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as SignalType | null;
  const force = searchParams.get("refresh") === "1";
  const query = searchParams.get("q") ?? undefined;
  const region = searchParams.get("region") ?? undefined;
  const minScore = searchParams.get("minScore");
  const limit = searchParams.get("limit");

  try {
    const bundle = await getSignals(force);
    let signals = filterSignals(bundle.signals, {
      type: type ?? undefined,
      query,
      region,
      minScore: minScore ? Number(minScore) : undefined,
    });

    if (limit) {
      signals = signals.slice(0, Number(limit));
    }

    return NextResponse.json({
      ok: true,
      ...bundle,
      signals,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "sync failed",
      },
      { status: 500 },
    );
  }
}
