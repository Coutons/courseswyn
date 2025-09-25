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
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) throw new Error("ADMIN_PASSWORD not set");
  const token = (req.headers.get("x-admin-token") || "").trim();
  if (token !== expected) throw new Error("Unauthorized");
}
