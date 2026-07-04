import { NextResponse } from "next/server";
import { consumeMagicLinkRaw, setSession } from "@/lib/auth";
import { findOrCreateUser } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/signin?error=missing", req.url));
  }

  const email = await consumeMagicLinkRaw(token);
  if (!email) {
    return NextResponse.redirect(new URL("/signin?error=expired", req.url));
  }

  const user = await findOrCreateUser(email);
  await setSession(user.email, user.id);

  return NextResponse.redirect(new URL("/return", req.url));
}