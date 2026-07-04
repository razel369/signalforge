export type PricingTierId = "starter" | "pro" | "enterprise";

export type PricingTier = {
  id: PricingTierId;
  name: string;
  tagline: string;
  price: number | null; // null = "contact us"
  currency: string;
  interval: "month" | "year" | null;
  features: string[];
  highlight: boolean;
  paddlePriceIdKey: "PADDLE_PRICE_ID_PRO" | "PADDLE_PRICE_ID_ENTERPRISE" | null;
  cta: string;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "כדי להתחיל לחקור",
    price: 0,
    currency: "USD",
    interval: "month",
    features: ["עד 10 סיגנלים ביום", "מכרזי רמ״י בסיסיים", "דשבורד ציבורי"],
    highlight: false,
    paddlePriceIdKey: null,
    cta: "התחל חינם",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "לצוותי מכירות שרוצים יתרון",
    price: 49,
    currency: "USD",
    interval: "month",
    features: [
      "60 סיגנלים חיים כל יום",
      "סינון לפי עיר, תחום ודחיפות",
      "התראות אימייל — מיילית מיידית",
      "API access — מוכן לחיבור CRM",
      "ייצוא CSV",
    ],
    highlight: true,
    paddlePriceIdKey: "PADDLE_PRICE_ID_PRO",
    cta: "פתח Pro עכשיו",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "לצוותים ולסוכנויות",
    price: 199,
    currency: "USD",
    interval: "month",
    features: [
      "הכל ב-Pro",
      "Slack/Teams alerts",
      "Webhook ל-CRM/ERP",
      "תובנות AI על סיגנלים",
      "SLA ותמיכה אישית",
    ],
    highlight: false,
    paddlePriceIdKey: "PADDLE_PRICE_ID_ENTERPRISE",
    cta: "פתח Enterprise",
  },
];

export function getTier(id: PricingTierId): PricingTier | undefined {
  return PRICING_TIERS.find((t) => t.id === id);
}

export function paddlePriceIdFor(tier: PricingTier): string | null {
  if (!tier.paddlePriceIdKey) return null;
  return process.env[tier.paddlePriceIdKey] ?? null;
}