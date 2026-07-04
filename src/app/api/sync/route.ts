import { NextResponse } from "next/server";
import { syncSignals } from "@/lib/signals";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  try {
    const bundle = await syncSignals();
    return NextResponse.json({ ok: true, stats: bundle.stats });
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
