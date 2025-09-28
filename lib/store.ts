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

export async function getDealById(idOrSlug: string): Promise<Deal | null> {
  const key = String(idOrSlug);
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const byId = await supabase.from("deals").select("*").eq("id", key).maybeSingle();
    if (byId.error && byId.error.code !== "PGRST116") {
      console.error("Supabase getDealById error", byId.error);
    }
    if (byId.data) {
      return byId.data as Deal;
    }

    const bySlug = await supabase.from("deals").select("*").eq("slug", key).maybeSingle();
    if (bySlug.error && bySlug.error.code !== "PGRST116") {
      console.error("Supabase getDealById slug error", bySlug.error);
    }
    if (bySlug.data) {
      return bySlug.data as Deal;
    }
  }

  const all = await readDealsFromFile();
  return all.find((d) => d.id === key || d.slug === key) ?? null;
}

export async function createDeal(deal: Deal): Promise<Deal> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("deals").insert(deal).select("*").single();
      if (!error) {
        return data as Deal;
      }
      console.error("Supabase createDeal error", error);
    } catch (error) {
      console.error("Supabase createDeal exception", error);
    }
  }

  const all = await readDealsFromFile();
  all.unshift(deal);
  await writeDealsToFile(all);
  return deal;
}

export async function updateDeal(id: string, patch: Partial<Deal>): Promise<Deal> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("deals")
        .update(patch)
        .eq("id", id)
        .select("*")
        .single();
      if (!error) {
        return data as Deal;
      }
      if (error.code === "PGRST116") {
        throw new Error("Not found");
      }
      console.error("Supabase updateDeal error", error);
    } catch (error) {
      console.error("Supabase updateDeal exception", error);
    }
  }

  const all = await readDealsFromFile();
  const idx = all.findIndex((d) => d.id === id);
  if (idx === -1) {
    throw new Error("Not found");
  }
  const base = all[idx];
  const next: Deal = {
    ...base,
    ...patch,
    createdAt: base.createdAt ?? new Date().toISOString(),
    updatedAt: patch.updatedAt ?? new Date().toISOString(),
  };
  all[idx] = next;
  await writeDealsToFile(all);
  return next;
}

export async function deleteDeal(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { error } = await supabase.from("deals").delete().eq("id", id);
      if (!error) {
        return;
      }
      console.error("Supabase deleteDeal error", error);
    } catch (error) {
      console.error("Supabase deleteDeal exception", error);
    }
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
