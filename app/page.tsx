import DealCard from "@/components/DealCard";
import { headers } from "next/headers";
import { uniqueProviders } from "@/lib/mockData";
import type { Metadata } from "next";
import DealsList from "@/components/DealsList";
import { readDeals } from "@/lib/store";
import { slugifyCategory } from "@/lib/slug";
import { buildDealLink } from "@/lib/links";
import { promises as fs } from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "100% Off and Free Udemy Coupons | Coursespeak Deals",
  description: "Discover 100% Off and Free Udemy Coupons updated daily. Browse the latest Udemy discounts, free courses, and best deals curated by Coursespeak.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "100% Off and Free Udemy Coupons | Coursespeak Deals",
    description: "Find 100% Off and Free Udemy Coupons. New deals and free courses added daily.",
    url: "/",
    siteName: "Coursespeak",
    type: "website",
  },
};

// Ensure the homepage is always rendered dynamically and never cached with an empty state
export const dynamic = "force-dynamic";
export const revalidate = 0;

function filterList(all: any[], opts: { q?: string; category?: string; provider?: string; freeOnly?: string }) {
  const term = opts.q?.trim().toLowerCase();
  const cat = opts.category?.trim().toLowerCase();
  const prov = opts.provider?.trim().toLowerCase();
  return all.filter((d) => {
    const okTerm = !term
      ? true
      : String(d.title || "").toLowerCase().includes(term) ||
        String(d.provider || "").toLowerCase().includes(term) ||
        String(d.category || "").toLowerCase().includes(term);
    // If a category slug is provided, compare against slugified category from the data
    const okCat = !cat ? true : slugifyCategory(String(d.category || "")) === cat;
    const okProv = !prov ? true : String(d.provider || "").toLowerCase() === prov;
    const okFree = opts.freeOnly ? (d.price ?? 0) === 0 : true;
    return okTerm && okCat && okProv && okFree;
  });
}

function sortList(items: any[], sort?: string): any[] {
  switch (sort) {
    case "updated":
      return [...items].sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    case "rating":
      return [...items].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "students":
      return [...items].sort((a, b) => (b.students ?? 0) - (a.students ?? 0));
    case "price":
      return [...items].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case "newest":
    default:
      return [...items].sort((a, b) => new Date(b.expiresAt ?? 0).getTime() - new Date(a.expiresAt ?? 0).getTime());
  }
}

async function getDeals(params: { q?: string; category?: string; page?: string; provider?: string; sort?: string; freeOnly?: string }) {
  // Compute server-side from local data for initial render to avoid API variability
  const all = await readDeals();
  const filtered = sortList(
    filterList(all, {
      q: params.q,
      category: params.category,
      provider: params.provider,
      freeOnly: params.freeOnly,
    }),
    params.sort
  );
  const pageNum = Math.max(1, Number(params.page ?? 1));
  const pageSize = 12;
  const start = (pageNum - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return { items, total, page: pageNum, totalPages };
}

export default async function Page({ searchParams }: { searchParams: { q?: string; category?: string; page?: string; provider?: string; sort?: string; freeOnly?: string } }) {
  const providers = uniqueProviders();
  let pageData = await getDeals(searchParams);
  // Guard: if for any reason we computed an empty list, fall back to unfiltered first page
  if (!pageData.items || pageData.items.length === 0) {
    const all = await readDeals();
    const fallback = all.slice(0, 12);
    pageData = { items: fallback, total: all.length, page: 1, totalPages: Math.max(1, Math.ceil(all.length / 12)) } as any;
  }
  const { items, total, page, totalPages } = pageData;
  // Reduce payload passed to the client component to avoid large serialization (App Router limit ~1MB)
  const lightItems = (items || []).map((d: any) => ({
    id: d.id,
    slug: d.slug,
    title: d.title,
    provider: d.provider,
    url: d.url,
    finalUrl: buildDealLink(d),
    price: d.price,
    originalPrice: d.originalPrice,
    rating: d.rating,
    students: d.students,
    image: d.image,
    category: d.category,
    subcategory: d.subcategory,
    expiresAt: d.expiresAt,
    coupon: d.coupon,
    updatedAt: d.updatedAt,
  }));
  // Build dynamic primary categories from all deals, merging equivalent names
  // e.g., "IT & Software" vs "IT &amp; Software"
  const all = await readDeals();
  const catCount = new Map<string, { name: string; count: number }>();
  const normName = (raw?: string) => {
    if (!raw) return undefined;
    let v = String(raw).trim();
    v = v.replace(/&amp;/gi, "&");
    v = v.replace(/\s+/g, " ");
    return v;
  };
  for (const d of all) {
    const raw = (d as any).category as string | undefined;
    const name = normName(raw);
    if (!name) continue;
    const key = name.toLowerCase();
    const prev = catCount.get(key) || { name, count: 0 };
    // keep the prettier display name (non-entity) if present
    if (prev.name.includes("&amp;") && !name.includes("&amp;")) prev.name = name;
    prev.count += 1;
    catCount.set(key, prev);
  }
  const categoriesRaw = Array.from(catCount.values())
    .sort((a, b) => b.count - a.count)
    .map(({ name, count }) => ({
      name,
      count,
      slug: name
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    }));
  // Resolve icon path server-side to avoid client event handlers
  const categories = await Promise.all(
    categoriesRaw.map(async (c) => {
      const file = path.join(process.cwd(), "public", "categories", `${c.slug}.svg`);
      let icon = "/categories/default.svg";
      try {
        await fs.access(file);
        icon = `/categories/${c.slug}.svg`;
      } catch {}
      return { ...c, icon };
    })
  );
  // Build ItemList JSON-LD for the first page of deals
  const itemListJson = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: (items || []).slice(0, 12).map((d: any, idx: number) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/deal/${d.slug || d.id}`,
      name: String(d.title || ''),
    })),
  };
  // If viewing a filtered category, annotate with a Category ItemList as well
  const categoryDisplay = (() => {
    if (!searchParams.category) return undefined;
    // Try to find a matching display name by slug in our categories list
    const slug = String(searchParams.category).toLowerCase();
    const match = categories.find((c) => c.slug === slug);
    return match?.name || slug.replace(/-/g, ' ');
  })();
  const categoryItemListJson = categoryDisplay
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListName: categoryDisplay,
        itemListElement: (items || []).slice(0, 12).map((d: any, idx: number) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/deal/${d.slug || d.id}`,
          name: String(d.title || ''),
        })),
      }
    : undefined;

  return (
    <div>
      {/* TEMP DEBUG: remove after verifying production */}
      <div style={{ padding: 8, border: "1px dashed #334155", borderRadius: 8, marginBottom: 8, background: "#0f1320", color: "#9fb0c8", fontSize: 12 }}>
        Debug: total deals {total}, showing {lightItems.length} on page {page}/{totalPages}. First titles: {lightItems.slice(0, 2).map((x: any) => x.title).join(" | ")}
      </div>
      <section
        style={{
          padding: 16,
          border: "1px solid #1f2330",
          borderRadius: 12,
          background: "linear-gradient(135deg, #0f1320 0%, #11182a 50%, #0f1320 100%)",
        }}
      >
        <h1 style={{ marginBottom: 6 }}>100% Off and Free Udemy Coupons</h1>
        <div style={{ color: "#a9b0c0", marginBottom: 8 }}>{total} results</div>
        <p className="muted" style={{ marginTop: 0, marginBottom: 0 }}>
          Daily updated collection of Udemy deals featuring 100% off coupons and free Udemy courses. Filter by provider, category, price, and more.
        </p>
        <p className="muted" style={{ marginTop: 8, marginBottom: 0, fontSize: 13 }}>
          Find free Udemy courses, 100% off Udemy coupons, Udemy discount codes, and the latest Udemy deals updated daily. Browse all topics on our <a href="/categories" style={{ color: "#eaf4ff" }}>Categories</a> page.
        </p>
      </section>

      {/* ItemList JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJson) }}
      />
      {categoryItemListJson ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryItemListJson) }}
        />
      ) : null}

      {/* SEO keyword chips (Coursera removed) */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12, marginBottom: 12 }}>
        {(() => {
          const chips: Array<{ label: string; href: string; active: boolean }> = [];
          // All Deals
          {
            const sp = new URLSearchParams();
            if (searchParams.q) sp.set("q", searchParams.q);
            if (searchParams.category) sp.set("category", searchParams.category);
            if (searchParams.sort) sp.set("sort", searchParams.sort);
            chips.push({ label: "All Deals", href: `/?${sp.toString()}`, active: !searchParams.provider && !searchParams.freeOnly });
          }
          // Udemy Deals
          {
            const sp = new URLSearchParams();
            if (searchParams.q) sp.set("q", searchParams.q);
            if (searchParams.category) sp.set("category", searchParams.category);
            if (searchParams.sort) sp.set("sort", searchParams.sort);
            sp.set("provider", "udemy");
            chips.push({ label: "Udemy Deals", href: `/?${sp.toString()}`, active: (searchParams.provider || "").toLowerCase() === "udemy" && !searchParams.freeOnly });
          }
          // 100% Off Udemy Coupons
          {
            const sp = new URLSearchParams();
            if (searchParams.q) sp.set("q", searchParams.q);
            if (searchParams.category) sp.set("category", searchParams.category);
            if (searchParams.sort) sp.set("sort", searchParams.sort);
            sp.set("provider", "udemy");
            sp.set("freeOnly", "1");
            const active = (searchParams.provider || "").toLowerCase() === "udemy" && (searchParams.freeOnly === "1" || searchParams.freeOnly === "true");
            chips.push({ label: "100% Off Udemy Coupons", href: `/?${sp.toString()}`, active });
          }
          // Free Udemy Courses
          {
            const sp = new URLSearchParams();
            if (searchParams.q) sp.set("q", searchParams.q);
            if (searchParams.category) sp.set("category", searchParams.category);
            if (searchParams.sort) sp.set("sort", searchParams.sort);
            sp.set("provider", "udemy");
            sp.set("freeOnly", "1");
            const active = (searchParams.provider || "").toLowerCase() === "udemy" && (searchParams.freeOnly === "1" || searchParams.freeOnly === "true");
            chips.push({ label: "Free Udemy Courses", href: `/?${sp.toString()}`, active });
          }
          return chips.map((c) => (
            <a
              key={c.label}
              href={c.href}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid #1f2330",
                background: c.active ? "#151a28" : "#0f1320",
                color: "#eaf4ff",
                textDecoration: "none",
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              {c.label}
            </a>
          ));
        })()}
      </div>

      {/* Sort controls */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {[ 
          { key: "newest", label: "Newest" },
          { key: "rating", label: "Rating" },
          { key: "students", label: "Students" },
          { key: "price", label: "Price" },
        ].map((s) => {
          const sp = new URLSearchParams();
          if (searchParams.q) sp.set("q", searchParams.q);
          if (searchParams.category) sp.set("category", searchParams.category);
          if (searchParams.provider) sp.set("provider", searchParams.provider);
          if (searchParams.freeOnly) sp.set("freeOnly", searchParams.freeOnly);
          sp.set("sort", s.key);
          return (
            <a
              key={s.key}
              href={`/?${sp.toString()}`}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #1f2330",
                background: (searchParams.sort ?? "newest") === s.key ? "#151a28" : "#0f1320",
                color: "#d7eaff",
                textDecoration: "none",
                fontSize: 12,
              }}
            >
              {s.label}
            </a>
          );
        })}
      </div>

      <DealsList
        initialItems={lightItems}
        initialPage={page}
        totalPages={totalPages}
        baseParams={{
          q: searchParams.q,
          category: searchParams.category,
          provider: searchParams.provider,
          sort: searchParams.sort,
          freeOnly: searchParams.freeOnly,
          pageSize: "12",
        }}
      />

      {/* Categories Cards (dynamic primary categories) */}
      <section style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 8 }}>Top Categories</h2>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          {categories.map((c) => {
            const sp = new URLSearchParams();
            sp.set("category", c.slug);
            return (
              <a
                key={c.slug}
                href={`/?${sp.toString()}`}
                className="card"
                style={{ textDecoration: "none", color: "#eaf4ff" }}
                title={`${c.name} coupons & free courses`}
              >
                <div className="card-body" style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.icon} alt="" width={18} height={18} style={{ filter: "brightness(1.2)" }} />
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                  </div>
                  <div className="muted" style={{ fontSize: 12 }}>{c.count} deals</div>
                </div>
              </a>
            );
          })}
        </div>
      </section>
      {/* Show more handled inside DealsList (moved below categories per your request) */}
      {/* SEO helper text */}
      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>About these Udemy coupons</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Explore the best 100% Off and Free Udemy Coupons handpicked for learners. We regularly refresh discounts so you can enroll in top Udemy courses without breaking the bank.
        </p>
      </section>
    </div>
  );
}
