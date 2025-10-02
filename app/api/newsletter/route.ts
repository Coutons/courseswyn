import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const STORAGE_FILE = path.join(process.cwd(), "data", "newsletter-subscribers.json");

async function readSubscribers(): Promise<string[]> {
  try {
    const raw = await fs.readFile(STORAGE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeSubscribers(list: string[]): Promise<void> {
  const dir = path.dirname(STORAGE_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(STORAGE_FILE, JSON.stringify(list, null, 2), "utf8");
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || !/.+@.+\..+/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const list = await readSubscribers();
    if (!list.includes(email)) {
      list.push(email);
      await writeSubscribers(list);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Newsletter subscribe failed", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
