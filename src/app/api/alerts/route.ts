import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type WaitlistEntry = {
  email: string;
  phone?: string;
  source: string;
  city?: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

async function readWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as WaitlistEntry[];
  } catch {
    return [];
  }
}

async function writeWaitlist(entries: WaitlistEntry[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email?: string;
      phone?: string;
      source?: string;
      city?: string;
    };

    const email = body.email?.trim().toLowerCase();
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "אימייל לא תקין" }, { status: 400 });
    }

    const entries = await readWaitlist();
    if (entries.some((e) => e.email === email)) {
      return NextResponse.json({ ok: true, message: "כבר רשום" });
    }

    entries.push({
      email,
      phone: body.phone?.trim(),
      source: body.source ?? "unknown",
      city: body.city,
      createdAt: new Date().toISOString(),
    });

    await writeWaitlist(entries);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "failed" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const entries = await readWaitlist();
  return NextResponse.json({ ok: true, count: entries.length });
}
