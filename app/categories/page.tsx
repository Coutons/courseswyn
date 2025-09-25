import type { Metadata } from "next";
import { readDeals } from "@/lib/store";
import { promises as fs } from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "All Categories & Subcategories | Coursespeak",
  description: "Browse all primary categories and subcategories of Udemy deals and free coupons on Coursespeak.",
  alternates: { canonical: "/categories" },
  openGraph: {
    title: "All Categories & Subcategories | Coursespeak",
    description: "Explore all categories and subcategories of Udemy deals and free Udemy coupons.",
    url: "/categories",
    type: "website",
  },
};

function normName(raw?: string | null) {
  if (!raw) return undefined;
  let v = String(raw).trim();
  v = v.replace(/&amp;/gi, "&");
  v = v.replace(/\s+/g, " ");
  return v || undefined;
}

function slugifyName(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function CategoriesPage() {
  const deals = await readDeals();
  const cats = new Map<string, { name: string; count: number; subs: Map<string, number> }>();
  for (const d of deals) {
    const cName = normName((d as any).category);
    if (!cName) continue;
    const cKey = cName.toLowerCase();
    if (!cats.has(cKey)) cats.set(cKey, { name: cName, count: 0, subs: new Map() });
    const bucket = cats.get(cKey)!;
    bucket.count += 1;
    const sName = normName((d as any).subcategory);
    if (sName) {
      bucket.subs.set(sName, (bucket.subs.get(sName) || 0) + 1);
    }
  }
  const listRaw = Array.from(cats.values()).sort((a, b) => b.count - a.count);
  // Resolve icon paths on the server to avoid client-side event handlers
  const list = await Promise.all(listRaw.map(async (c) => {
    const cSlug = slugifyName(c.name);
    const file = path.join(process.cwd(), "public", "categories", `${cSlug}.svg`);
    let icon = "/categories/default.svg";
    try {
      await fs.access(file);
      icon = `/categories/${cSlug}.svg`;
    } catch {}
    return { ...c, icon };
  }));

  return (
    <div>
      <section
        style={{
          padding: 16,
          border: "1px solid #1f2330",
          borderRadius: 12,
          background: "linear-gradient(135deg, #0f1320 0%, #11182a 50%, #0f1320 100%)",
          marginBottom: 16,
        }}
      >
        <h1 style={{ marginBottom: 6 }}>All Categories & Subcategories</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          Explore every primary category and subcategory available on Coursespeak. Click a category or subcategory to view the latest deals and free Udemy coupons.
        </p>
      </section>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
        {list.map((c) => {
          const cSlug = slugifyName(c.name);
          return (
            <div key={cSlug} className="card" style={{ color: "#eaf4ff" }}>
              <div className="card-body" style={{ display: "grid", gap: 8 }}>
                <a href={`/?category=${encodeURIComponent(cSlug)}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.icon} alt="" width={18} height={18} style={{ filter: "brightness(1.2)" }} />
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                    <span className="muted" style={{ fontSize: 12, marginLeft: "auto" }}>{c.count} deals</span>
                  </div>
                </a>
                {c.subs.size > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {Array.from(c.subs.entries()).sort((a, b) => b[1] - a[1]).map(([sub, n]) => {
                      const q = new URLSearchParams();
                      q.set("category", cSlug);
                      // subcategory filter not implemented in API, so use q text search to hint
                      q.set("q", sub);
                      return (
                        <a
                          key={sub}
                          href={`/?${q.toString()}`}
                          className="pill"
                          style={{ textDecoration: "none" }}
                          title={`${sub} (${n})`}
                        >
                          {sub}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
