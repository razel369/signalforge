import { createClient, type SupabaseClient } from "@supabase/supabase-js";

declare global {
  // eslint-disable-next-line no-var
  var __sf_supabase__: SupabaseClient | undefined;
}

function client(): SupabaseClient {
  if (globalThis.__sf_supabase__) return globalThis.__sf_supabase__;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  }
  const c = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  globalThis.__sf_supabase__ = c;
  return c;
}

export type DbUser = {
  id: string;
  email: string;
  paddle_customer_id: string | null;
  created_at: string;
};

export type DbSubscription = {
  id: string;
  user_id: string;
  paddle_subscription_id: string | null;
  paddle_price_id: string;
  status: string;
  current_period_end: string | null;
  updated_at: string;
};

export type UserPlan = {
  email: string;
  plan: "pro" | "enterprise" | null;
  status: string | null;
  current_period_end: string | null;
};

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

function priceIdToPlan(priceId: string | null | undefined): "pro" | "enterprise" | null {
  if (!priceId) return null;
  if (priceId === process.env.PADDLE_PRICE_ID_PRO) return "pro";
  if (priceId === process.env.PADDLE_PRICE_ID_ENTERPRISE) return "enterprise";
  return null;
}

export async function findOrCreateUser(email: string): Promise<DbUser> {
  const c = client();
  const existing = await c
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle<DbUser>();
  if (existing.data) return existing.data;

  const { data, error } = await c
    .from("users")
    .insert({ email })
    .select("*")
    .single<DbUser>();
  if (error) throw error;
  return data!;
}

export async function getUserById(id: string): Promise<DbUser | null> {
  const c = client();
  const { data } = await c.from("users").select("*").eq("id", id).maybeSingle<DbUser>();
  return data ?? null;
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const c = client();
  const { data } = await c.from("users").select("*").eq("email", email).maybeSingle<DbUser>();
  return data ?? null;
}

export async function setUserPaddleCustomerId(
  userId: string,
  paddleCustomerId: string,
): Promise<void> {
  const c = client();
  await c
    .from("users")
    .update({ paddle_customer_id: paddleCustomerId })
    .eq("id", userId);
}

export async function upsertSubscriptionFromTx(params: {
  userId: string;
  paddleSubscriptionId: string | null;
  paddlePriceId: string;
  status: string;
  currentPeriodEnd: string | null;
}): Promise<void> {
  const c = client();
  const { data: existing } = await c
    .from("subscriptions")
    .select("id")
    .eq("user_id", params.userId)
    .maybeSingle<{ id: string }>();

  if (existing?.id) {
    await c
      .from("subscriptions")
      .update({
        paddle_price_id: params.paddlePriceId,
        status: params.status,
        current_period_end: params.currentPeriodEnd,
        paddle_subscription_id: params.paddleSubscriptionId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await c.from("subscriptions").insert({
      user_id: params.userId,
      paddle_price_id: params.paddlePriceId,
      status: params.status,
      current_period_end: params.currentPeriodEnd,
      paddle_subscription_id: params.paddleSubscriptionId,
    });
  }
}

export async function getUserPlan(userId: string): Promise<UserPlan | null> {
  const c = client();
  const { data: user } = await c
    .from("users")
    .select("email")
    .eq("id", userId)
    .maybeSingle<{ email: string }>();
  if (!user) return null;

  const { data: sub } = await c
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle<DbSubscription>();

  if (!sub) {
    return { email: user.email, plan: null, status: null, current_period_end: null };
  }

  const active = ACTIVE_STATUSES.has(sub.status);
  return {
    email: user.email,
    plan: active ? priceIdToPlan(sub.paddle_price_id) : null,
    status: sub.status,
    current_period_end: sub.current_period_end,
  };
}

const userPlanCache = new Map<string, { plan: UserPlan; at: number }>();
const USER_PLAN_TTL = 60_000;

export async function getUserPlanCached(userId: string): Promise<UserPlan | null> {
  const hit = userPlanCache.get(userId);
  if (hit && Date.now() - hit.at < USER_PLAN_TTL) return hit.plan;
  const plan = await getUserPlan(userId);
  if (plan) userPlanCache.set(userId, { plan, at: Date.now() });
  return plan;
}

export function invalidateUserPlanCache(userId?: string): void {
  if (userId) userPlanCache.delete(userId);
  else userPlanCache.clear();
}

export async function issueMagicLink(email: string, tokenHash: string): Promise<void> {
  const c = client();
  await c.from("magic_links").insert({
    email,
    token: tokenHash,
    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  });
}

export async function consumeMagicLink(tokenHash: string): Promise<string | null> {
  const c = client();
  const { data } = await c
    .from("magic_links")
    .select("*")
    .eq("token", tokenHash)
    .maybeSingle<{ email: string; consumed: boolean; expires_at: string }>();

  if (!data) return null;
  if (data.consumed) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  await c.from("magic_links").update({ consumed: true }).eq("token", tokenHash);
  return data.email;
}