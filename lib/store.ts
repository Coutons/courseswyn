import { promises as fs } from "fs";
import path from "path";
import type { Deal } from "@/types/deal";
import { deals as mockDeals } from "@/lib/mockData";

const DATA_DIR = path.join(process.cwd(), "data");
const DEALS_FILE = path.join(DATA_DIR, "deals.json");

export async function readDeals(): Promise<Deal[]> {
  try {
    const buf = await fs.readFile(DEALS_FILE, "utf-8");
    const data = JSON.parse(buf) as Deal[];
    if (Array.isArray(data)) return data;
    return mockDeals;
  } catch {
    return mockDeals;
  }
}

export async function writeDeals(all: Deal[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DEALS_FILE, JSON.stringify(all, null, 2), "utf-8");
}

export function requireAdmin(req: Request): void {
  const envTokens = [
    process.env.ADMIN_PASSWORD,
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
    process.env.NEXT_PUBLIC_ADMIN_TOKEN,
    process.env.ADMIN_DEV_TOKEN,
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  const fallbackToken = process.env.ADMIN_DEV_TOKEN?.trim() || "dev-admin";
  const allowedTokens = envTokens.length ? envTokens : [fallbackToken];

  if (!allowedTokens.length) {
    throw new Error("ADMIN_PASSWORD not configured");
  }

  const token = (req.headers.get("x-admin-token") || "").trim();
  if (!token) {
    throw new Error("Missing admin token");
  }

  if (!allowedTokens.includes(token)) {
    throw new Error("Invalid admin token");
  }
}
