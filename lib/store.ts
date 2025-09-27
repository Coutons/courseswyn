import { promises as fs } from "fs";
import path from "path";
import type { Deal } from "@/types/deal";
import { deals as mockDeals } from "@/lib/mockData";
import { getSupabaseAdmin } from "@/lib/supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const DEALS_FILE = path.join(DATA_DIR, "deals.json");

async function readDealsFromFile(): Promise<Deal[]> {
  try {
    const buf = await fs.readFile(DEALS_FILE, "utf-8");
    const data = JSON.parse(buf) as Deal[];
    if (Array.isArray(data)) return data;
    return mockDeals;
  } catch {
    return mockDeals;
  }
}

async function writeDealsToFile(all: Deal[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DEALS_FILE, JSON.stringify(all, null, 2), "utf-8");
}

export async function readDeals(): Promise<Deal[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .order("updatedAt", { ascending: false })
      .order("createdAt", { ascending: false });

    if (!error && Array.isArray(data)) {
      return data as Deal[];
    }

    if (error) {
      console.error("Supabase readDeals error", error);
    }
  }

  return await readDealsFromFile();
}

export async function getDealById(id: string): Promise<Deal | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from("deals").select("*").eq("id", id).maybeSingle();
    if (error) {
      if (error.code === "PGRST116") return null; // Row not found
      console.error("Supabase getDealById error", error);
      throw new Error("Failed to fetch deal");
    }
    return (data as Deal) ?? null;
  }

  const all = await readDealsFromFile();
  return all.find((d) => d.id === id) ?? null;
}

export async function createDeal(deal: Deal): Promise<Deal> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from("deals").insert(deal).select("*").single();
    if (error) {
      console.error("Supabase createDeal error", error);
      throw new Error(error.message || "Failed to create deal");
    }
    return data as Deal;
  }

  const all = await readDealsFromFile();
  all.unshift(deal);
  await writeDealsToFile(all);
  return deal;
}

export async function updateDeal(id: string, patch: Partial<Deal>): Promise<Deal> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from("deals").update(patch).eq("id", id).select("*").single();
    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Not found");
      }
      console.error("Supabase updateDeal error", error);
      throw new Error(error.message || "Failed to update deal");
    }
    return data as Deal;
  }

  const all = await readDealsFromFile();
  const idx = all.findIndex((d) => d.id === id);
  if (idx === -1) {
    throw new Error("Not found");
  }
  const next = { ...all[idx], ...patch } as Deal;
  all[idx] = next;
  await writeDealsToFile(all);
  return next;
}

export async function deleteDeal(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("deals").delete().eq("id", id);
    if (error) {
      console.error("Supabase deleteDeal error", error);
      throw new Error(error.message || "Failed to delete deal");
    }
    return;
  }

  const all = await readDealsFromFile();
  const next = all.filter((d) => d.id !== id);
  await writeDealsToFile(next);
}

export async function writeDeals(all: Deal[]): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    throw new Error("writeDeals is not supported when Supabase is configured. Use createDeal/updateDeal/deleteDeal instead.");
  }
  await writeDealsToFile(all);
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
