import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { getUserPlan } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
  const plan = await getUserPlan(session.userId);
  if (!plan) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
  return NextResponse.json({ authenticated: true, ...plan });
}