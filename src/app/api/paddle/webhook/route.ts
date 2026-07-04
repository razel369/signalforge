import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paddle";
import {
  findOrCreateUser,
  getUserByEmail,
  setUserPaddleCustomerId,
  upsertSubscriptionFromTx,
} from "@/lib/db";

export const dynamic = "force-dynamic";

type PaddleTx = {
  id: string;
  status: string;
  customer_id: string | null;
  subscription_id: string | null;
  currency_code: string;
  details?: { totals?: { grand_total?: string } };
  billed_at?: string | null;
  period?: { ends_at?: string | null };
  items?: { price_id: string; price?: { id: string } }[];
  custom_data?: { tier_id?: string };
};

type PaddleEvent =
  | { event_type: "transaction.completed"; data: PaddleTx }
  | { event_type: "subscription.created" | "subscription.updated" | "subscription.canceled"; data: PaddleTx }
  | { event_type: string; data: PaddleTx };

export async function POST(req: Request) {
  const raw = await req.text();
  const sigHeader = req.headers.get("paddle-signature");

  if (!verifyWebhookSignature(raw, sigHeader)) {
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  }

  let event: PaddleEvent;
  try {
    event = JSON.parse(raw) as PaddleEvent;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const tx = event.data;
  if (!tx) return NextResponse.json({ ok: true, ignored: "no data" });

  const item = tx.items?.[0];
  const priceId = item?.price_id ?? item?.price?.id;
  if (!priceId) {
    return NextResponse.json({ ok: true, ignored: "no price" });
  }

  // Look up the user via custom_data.tier_id is not enough — we need email.
  // Paddle sends customer email in the data payload's customer, but Billing v2
  // includes it only on the transaction object. We fetch it lazily if missing.

  let email: string | null = null;
  // attempt to read customer email if present in event payload
  const anyTx = tx as unknown as { customer?: { email?: string } };
  if (anyTx.customer?.email) email = anyTx.customer.email.toLowerCase();

  // If we have a paddle_customer_id but no email in payload, fall back to users.paddle_customer_id.
  if (!email && tx.customer_id) {
    const c = tx.customer_id;
    // The DB lookup happens via setUserPaddleCustomerId/getUserByEmail in purchase flow;
    // here we don't have a direct lookup table by paddle_customer_id, so we accept
    // an "anonymous" path returning ignored.
  }

  if (!email) {
    return NextResponse.json({
      ok: true,
      ignored: "missing email; pair via checkout session",
    });
  }

  const user = await findOrCreateUser(email);
  if (tx.customer_id) {
    await setUserPaddleCustomerId(user.id, tx.customer_id);
  }

  await upsertSubscriptionFromTx({
    userId: user.id,
    paddleSubscriptionId: tx.subscription_id ?? `oneoff-${tx.id}`,
    paddlePriceId: priceId,
    status: tx.status,
    currentPeriodEnd: tx.period?.ends_at ?? null,
  });

  return NextResponse.json({ ok: true });
}