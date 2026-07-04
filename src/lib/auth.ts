import crypto from "crypto";
import { cookies } from "next/headers";
import { consumeMagicLink, issueMagicLink } from "./db";

const COOKIE_NAME = "sf_session";
const COOKIE_PATH = "/";

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("Missing AUTH_SECRET");
  return s;
}

export function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export function randomToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function signSessionCookie(email: string, userId: string): string {
  const payload = JSON.stringify({ e: email, u: userId, iat: Date.now() });
  const b64 = Buffer.from(payload).toString("base64url");
  const sig = crypto
    .createHmac("sha256", secret())
    .update(b64)
    .digest("base64url");
  return `${b64}.${sig}`;
}

export function verifySessionCookie(value: string | undefined): { email: string; userId: string } | null {
  if (!value) return null;
  const [b64, sig] = value.split(".");
  if (!b64 || !sig) return null;
  const expected = crypto
    .createHmac("sha256", secret())
    .update(b64)
    .digest("base64url");
  if (
    expected.length !== sig.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  ) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString("utf8")) as {
      e: string;
      u: string;
      iat: number;
    };
    return { email: payload.e, userId: payload.u };
  } catch {
    return null;
  }
}

export async function readSession(): Promise<{ email: string; userId: string } | null> {
  const jar = await cookies();
  const c = jar.get(COOKIE_NAME);
  return verifySessionCookie(c?.value);
}

export async function setSession(email: string, userId: string): Promise<void> {
  const jar = await cookies();
  const value = signSessionCookie(email, userId);
  jar.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: COOKIE_PATH,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export type RequestMagicLinkResult = {
  ok: boolean;
  link?: string;
  devToken?: string;
};

export async function requestMagicLink(
  email: string,
  baseUrl: string,
): Promise<RequestMagicLinkResult> {
  const normalized = email.trim().toLowerCase();
  const token = randomToken();
  const tokenHash = hashToken(token);
  await issueMagicLink(normalized, tokenHash);

  const link = `${baseUrl.replace(/\/$/, "")}/auth/callback?token=${token}`;

  if (process.env.NODE_ENV !== "production" && process.env.RESEND_API_KEY === undefined) {
    return { ok: true, link, devToken: token };
  }
  return { ok: true, link };
}

export async function consumeMagicLinkRaw(rawToken: string): Promise<string | null> {
  return consumeMagicLink(hashToken(rawToken));
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;