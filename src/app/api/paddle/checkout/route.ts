import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { setUserPaddleCustomerId, getUserByEmail } from "@/lib/db";
import { createCheckoutSession } from "@/lib/paddle";
import type { PricingTierId } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const VALID: PricingTierId[] = ["pro", "enterprise"];

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "לא מחובר" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { tierId?: string };
  const tierId = body.tierId;
  if (!tierId || !VALID.includes(tierId as PricingTierId)) {
    return NextResponse.json({ ok: false, error: "tier לא תקין" }, { status: 400 });
  }

  const user = await getUserByEmail(session.email);
  if (!user) {
    return NextResponse.json({ ok: false, error: "משתמש לא נמצא" }, { status: 404 });
  }

  const base = (process.env.SITE_URL ?? new URL(req.url).origin).replace(/\/$/, "");
  const returnUrl = `${base}/return?plan=${tierId}`;

  try {
    const out = await createCheckoutSession({
      tierId: tierId as PricingTierId,
      email: user.email,
      customerId: user.paddle_customer_id,
      returnUrl,
    });
    return NextResponse.json({ ok: true, url: out.url });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "checkout failed" },
      { status: 500 },
    );
  }
}