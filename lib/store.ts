import { promises as fs } from "fs";
import path from "path";
import type { Deal } from "@/types/deal";
import { deals as mockDeals } from "@/lib/mockData";

const DEFAULT_DATA_DIR = path.join(process.cwd(), "data");

function resolveDealsFilePath(): string {
  const raw = process.env.DEALS_PATH?.trim();
  if (!raw) {
    return path.join(DEFAULT_DATA_DIR, "deals.json");
  }
  let resolved = path.resolve(raw);
  if (!path.extname(resolved)) {
    resolved = path.join(resolved, "deals.json");
  }
  return resolved;
}

const DEALS_FILE = resolveDealsFilePath();
const DEALS_DIR = path.dirname(DEALS_FILE);

async function readDealsFromFile(): Promise<Deal[]> {
  try {
    const buf = await fs.readFile(DEALS_FILE, "utf-8");
    const data = JSON.parse(buf) as Deal[];
    if (Array.isArray(data)) {
      return data;
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await writeDealsToFile(mockDeals);
    }
    return mockDeals;
  }
  return mockDeals;
}

async function writeDealsToFile(all: Deal[]): Promise<void> {
  await fs.mkdir(DEALS_DIR, { recursive: true });
  await fs.writeFile(DEALS_FILE, JSON.stringify(all, null, 2), "utf-8");
}

function sortByRecency(deals: Deal[]): Deal[] {
  return [...deals].sort((a, b) => {
    const timeA = new Date(a.updatedAt ?? a.createdAt ?? a.expiresAt ?? 0).getTime();
    const timeB = new Date(b.updatedAt ?? b.createdAt ?? b.expiresAt ?? 0).getTime();
    return timeB - timeA;
  });
}

export async function readDeals(): Promise<Deal[]> {
  return sortByRecency(await readDealsFromFile());
}

export async function getDealById(idOrSlug: string): Promise<Deal | null> {
  const key = String(idOrSlug);
  const all = await readDealsFromFile();
  return all.find((deal) => deal.id === key || deal.slug === key) ?? null;
}

export async function createDeal(deal: Deal): Promise<Deal> {
  const all = await readDealsFromFile();
  if (all.some((item) => item.id === deal.id)) {
    throw new Error("ID already exists");
  }
  if (deal.slug && all.some((item) => item.slug === deal.slug)) {
    throw new Error("Slug already exists");
  }
  const now = new Date().toISOString();
  const next: Deal = {
    ...deal,
    createdAt: deal.createdAt ?? now,
    updatedAt: deal.updatedAt ?? now,
  };
  all.unshift(next);
  await writeDealsToFile(all);
  return next;
}

export async function updateDeal(id: string, patch: Partial<Deal>): Promise<Deal> {
  const all = await readDealsFromFile();
  const idx = all.findIndex((deal) => deal.id === id);
  if (idx === -1) {
    throw new Error("Not found");
  }
  if (patch.slug && all.some((deal, index) => index !== idx && deal.slug === patch.slug)) {
    throw new Error("Slug already exists");
  }
  const base = all[idx];
  const now = new Date().toISOString();
  const next: Deal = {
    ...base,
    ...patch,
    createdAt: base.createdAt ?? now,
    updatedAt: patch.updatedAt ?? now,
  };
  all[idx] = next;
  await writeDealsToFile(all);
  return next;
}

export async function deleteDeal(id: string): Promise<void> {
  const all = await readDealsFromFile();
  const next = all.filter((deal) => deal.id !== id);
  if (next.length === all.length) {
    throw new Error("Not found");
  }
  await writeDealsToFile(next);
}

export async function writeDeals(all: Deal[]): Promise<void> {
  await writeDealsToFile(all);
}
