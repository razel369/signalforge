import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "SignalForge",
    version: "0.1.0",
    time: new Date().toISOString(),
  });
}
