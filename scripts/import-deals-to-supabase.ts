import { config } from "dotenv";
import { readFile } from "fs/promises";
import path from "path";
import type { Deal } from "../types/deal";
import { createClient } from "@supabase/supabase-js";

config();
config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
    process.exit(1);
  }
  const client = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });

  const filePath = path.join(process.cwd(), "data", "deals.json");
  console.log("Loading deals from", filePath);
  const raw = await readFile(filePath, "utf-8");
  const deals = JSON.parse(raw) as Deal[];
  if (!Array.isArray(deals) || deals.length === 0) {
    console.log("No deals found in local JSON file.");
    return;
  }

  // Normalise timestamps to ISO strings if missing
  const prepared = deals.map((d) => ({
    ...d,
    createdAt: d.createdAt || new Date().toISOString(),
    updatedAt: d.updatedAt || new Date().toISOString(),
  }));

  console.log(`Importing ${prepared.length} deals to Supabase...`);
  const batches = chunk(prepared, 500);

  for (const [index, batch] of batches.entries()) {
    const { error } = await client
      .from("deals")
      .upsert(batch, { onConflict: "id" });
    if (error) {
      console.error("Failed to upsert batch", index + 1, error.message, error.details ?? "");
      process.exit(1);
    }
    console.log(`Batch ${index + 1}/${batches.length} imported (${batch.length} records).`);
  }

  console.log("Import completed successfully.");
}

main().catch((err) => {
  console.error("Unexpected error while importing deals", err);
  process.exit(1);
});
