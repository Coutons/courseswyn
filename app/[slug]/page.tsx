import { readDeals } from "@/lib/store";
import { notFound, permanentRedirect } from "next/navigation";

const RESERVED = new Set([
  "deal",
  "api",
  "categories",
  "_next",
  "favicon.ico",
  "sitemap.xml",
  "robots.txt",
  "search",
  "saved",
]);

export default async function LegacySlugRedirect({ params }: { params: { slug: string } }) {
  const seg = decodeURIComponent(params.slug || "").trim();
  if (!seg || RESERVED.has(seg)) {
    // Let specific routes or 404 handle it
    notFound();
  }

  const key = seg.toLowerCase();
  const deals = await readDeals();
  const found = deals.find((d) => String(d.slug || d.id || "").toLowerCase() === key);
  if (found) {
    permanentRedirect(`/deal/${found.slug || found.id}`);
  }
  notFound();
}
