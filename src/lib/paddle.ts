import crypto from "crypto";
import { paddlePriceIdFor, getTier, type PricingTierId } from "./pricing";

const PADDLE_BASE =
  process.env.PADDLE_ENVIRONMENT === "production"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";

function apiKey(): string {
  const k = process.env.PADDLE_API_KEY;
  if (!k) throw new Error("Missing PADDLE_API_KEY");
  return k;
}

function paddleSecret(): string {
  const s = process.env.PADDLE_WEBHOOK_SECRET;
  if (!s) throw new Error("Missing PADDLE_WEBHOOK_SECRET");
  return s;
}

type PaddleCheckoutResponse = {
  data: { id: string; url: string };
};

export async function createCheckoutSession(params: {
  tierId: PricingTierId;
  email: string;
  customerId?: string | null;
  returnUrl: string;
}): Promise<{ url: string }> {
  const tier = getTier(params.tierId);
  if (!tier) throw new Error("Unknown pricing tier");
  const priceId = paddlePriceIdFor(tier);
  if (!priceId) throw new Error("Pricing tier not purchasable");

  const body: Record<string, unknown> = {
    items: [{ price_id: priceId, quantity: 1 }],
    checkout: {
      url: params.returnUrl,
    },
    custom_data: { tier_id: params.tierId },
  };

  if (params.email) {
    body.customer = params.customerId
      ? { id: params.customerId }
      : { email: params.email };
  }

  const res = await fetch(`${PADDLE_BASE}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paddle transactions ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as PaddleCheckoutResponse;
  if (!json?.data?.url) throw new Error("Paddle: no checkout URL");
  return { url: json.data.url };
}

/**
 * Verify a Paddle Billing v2 webhook signature.
 *
 * Header format: `Paddle-Signature: ts=<unix>;h1=<sha256-hex>`
 * h1 = HMAC-SHA256(secret, `ts.payload`)
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  if (!signatureHeader) return false;
  const parts = Object.fromEntries(
    signatureHeader
      .split(";")
      .map((kv) => kv.split("="))
      .filter((kv) => kv.length === 2)
      .map(([k, v]) => [k.trim(), v.trim()]),
  ) as Record<string, string>;
  const ts = parts.ts;
  const h1 = parts.h1;
  if (!ts || !h1) return false;

  const signed = `${ts}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", paddleSecret())
    .update(signed)
    .digest("hex");

  if (expected.length !== h1.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(h1));
  } catch {
    return false;
  }
}