import type { MetadataRoute } from "next";
import { readDeals } from "@/lib/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://courseswyn.com").replace(/\/$/, "");

  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/categories`, lastModified: new Date() },
    { url: `${base}/udemy-coupons`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/post/udemy-coupons-guide`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/post/how-to-redeem-udemy-coupons`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  try {
    const deals = await readDeals();
    // Collect categories
    const catLast = new Map<string, string | undefined>();
    for (const d of deals) {
      const path = `/deal/${d.slug || d.id}`;
      const last = d.updatedAt || d.createdAt || undefined;
      routes.push({ url: `${base}${path}`, lastModified: last ? new Date(last) : new Date() });
      const cRaw = (d as any).category as string | undefined;
      if (cRaw) {
        const name = String(cRaw).replace(/&amp;/gi, "&").trim();
        const slug = name
          .toLowerCase()
          .replace(/&/g, " and ")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        const prev = catLast.get(slug);
        const ts = (d.updatedAt || d.createdAt) as string | undefined;
        // keep most recent timestamp
        if (!prev || (ts && new Date(ts) > new Date(prev))) {
          catLast.set(slug, ts);
        }
      }
    }
    // Append category URLs
    for (const [slug, ts] of catLast.entries()) {
      routes.push({ url: `${base}/?category=${encodeURIComponent(slug)}`, lastModified: ts ? new Date(ts) : new Date(), changeFrequency: "daily", priority: 0.6 });
    }
  } catch {
    // ignore if store not available
  }

  return routes;
}
