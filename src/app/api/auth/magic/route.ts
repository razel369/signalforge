import { Resend } from "resend";
import { NextResponse } from "next/server";
import { requestMagicLink } from "@/lib/auth";

export const dynamic = "force-dynamic";

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function baseUrl(req: Request): string {
  const env = process.env.SITE_URL?.replace(/\/$/, "");
  if (env) return env;
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string };
  const email = body.email?.trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "אימייל לא תקין" }, { status: 400 });
  }

  const link = await requestMagicLink(email, baseUrl(req));

  if (process.env.NODE_ENV !== "production" && link.devToken) {
    // Local/dev with no Resend configured: return the link so the user can click.
    return NextResponse.json({ ok: true, devLink: link.link });
  }

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM ?? "SignalForge <onboarding@resend.dev>";
    try {
      await resend.emails.send({
        from,
        to: email,
        subject: "התחברות ל-SignalForge",
        html: `<div dir="rtl" style="font-family:system-ui;background:#04040a;color:#fff;padding:32px">
          <h2 style="color:#fb923c">כניסה ל-SignalForge</h2>
          <p>לחץ על הכפתור כדי להתחבר. הקישור תקף ל-15 דקות.</p>
          <p><a href="${link.link}" style="display:inline-block;background:#f97316;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">התחבר</a></p>
          <p style="color:#777;font-size:12px">אם לא ביקשת להתחבר, התעלם מהודעה זו.</p>
        </div>`,
      });
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: "שליחת המייל נכשלה" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
