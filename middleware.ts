import { NextRequest, NextResponse } from "next/server";
// Import deals statically to check slugs at the edge
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dealsData from "./data/deals.json";

type Deal = { id: string; slug?: string; title?: string };
const deals: Deal[] = Array.isArray(dealsData) ? dealsData : [];

const RESERVED = new Set([
  "", // root
  "deal",
  "api",
  "categories",
  "_next",
  "favicon.ico",
  "sitemap.xml",
  "robots.txt",
  "search",
  "saved",
  "assets",
  "public",
]);

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // Only handle single-segment paths like /sample-post or /sample-post/
  const m = path.match(/^\/([^\/]+)\/?$/);
  if (!m) return NextResponse.next();
  const seg = decodeURIComponent(m[1]);
  if (RESERVED.has(seg)) return NextResponse.next();

  const key = seg.toLowerCase();
  const found = deals.find((d) => (d.slug || d.id || "").toString().toLowerCase() === key);
  if (found) {
    url.pathname = `/deal/${found.slug || found.id}`;
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
