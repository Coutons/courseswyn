"use client";
import { getBrand } from "@/lib/brand";
import { buildDealLink } from "@/lib/links";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' preserveAspectRatio='xMidYMid slice'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop offset='0%' stop-color='%23083c3a'/%3E%3Cstop offset='100%' stop-color='%230d1f2d'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' fill-opacity='0.4' font-size='42' font-family='Segoe UI, sans-serif'%3ECourseswyn%3C/text%3E%3C/svg%3E";

export default function DealCard({ deal }: { deal: any }) {
  const brand = getBrand(deal.provider);
  const key = String(deal.slug || deal.id || "");
  const p = typeof deal.price === "number" && isFinite(deal.price) && deal.price > 0 ? deal.price : 9.99;
  const opRaw = typeof deal.originalPrice === "number" && isFinite(deal.originalPrice) ? deal.originalPrice : 119.99;
  const op = opRaw > p ? opRaw : 119.99;
  const r = typeof deal.rating === "number" && isFinite(deal.rating) ? deal.rating : genRating(key);
  const s = typeof deal.students === "number" && isFinite(deal.students) ? deal.students : genStudents(key);
  const hasDiscount = op > p && p > 0;
  const discountPct = hasDiscount ? Math.round(100 - (p / op) * 100) : null;
  const title = normalizeTitle(String(deal.title || ""));
  const imageSrc = deal.image ? String(deal.image) : PLACEHOLDER_IMAGE;

  return (
    <article className="card">
      <header className="card-header">
        <h3 title={deal.title}>
          <a href={`/deal/${deal.slug || deal.id}`} style={{ color: "inherit", textDecoration: "none" }}>
            {title}
          </a>
        </h3>
      </header>
      <div className="card-body">
        <div className="card-image-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={title}
            width={640}
            height={360}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {deal.duration && (
            <span
              className="pill"
              style={{ position: "absolute", top: 8, right: 8, background: "#3b82f6", color: "#0b0d12", fontWeight: 800 }}
            >
              {`Duration: ${formatDuration(deal.duration)}`}
            </span>
          )}
        </div>
        <div className="meta" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {deal.category && <span className="provider">{deal.category}</span>}
          {deal.subcategory && <span className="category">{deal.subcategory}</span>}
        </div>
        <div className="prices" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="price">{p === 0 ? "Free" : `$${p.toFixed(2)}`}</span>
          {op && (
            <span className="original">${op.toFixed(2)}</span>
          )}
          {hasDiscount && (
            <span
              title={`${discountPct}% OFF`}
              style={{
                background: "#ef4444",
                color: "#0b0d12",
                padding: "2px 8px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {discountPct}% OFF
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {p === 0 && (
            <span style={{
              background: "#10b981",
              color: "#0b0d12",
              padding: "2px 8px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
            }}>
              FREE
            </span>
          )}
          {deal.expiresAt && (
            <span style={{ color: "#fbbf24", fontSize: 12 }}>
              Expires in {formatRemaining(deal.expiresAt)}
            </span>
          )}
        </div>
        <div className="stats">
          <span>⭐ {r.toFixed(1)}</span>
          <span>👥 {formatStudents(s)}</span>
        </div>
      </div>
      <footer className="card-footer">
        {deal.coupon && <span className="coupon">Coupon: {deal.coupon}</span>}
        <div style={{ display: "flex", gap: 8 }}>
          <a className="btn" href={`/deal/${deal.slug || deal.id}`}>Details</a>
          <a
            className="btn"
            href={buildDealLink(deal)}
            target="_blank"
            rel="noreferrer sponsored"
            data-provider={deal.provider?.toLowerCase()}
            data-impact="true"
          >
            Get Deal
          </a>
        </div>
      </footer>
    </article>
  );
}

function formatRemaining(expiresAt: string) {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (isNaN(ms)) return "-";
  if (ms <= 0) return "expired";
  const days = Math.floor(ms / (24 * 3600_000));
  const hours = Math.floor((ms % (24 * 3600_000)) / 3600_000);
  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((ms % 3600_000) / 60_000);
  return `${hours}h ${mins}m`;
}

function normalizeTitle(s: string) {
  // Decode a few common HTML entities and map en-dash to the user's preferred ampersand joiner
  let out = s;
  out = out.replace(/&amp;/g, "&");
  out = out.replace(/&quot;/g, '"');
  out = out.replace(/&apos;|&#8217;/g, "'");
  out = out.replace(/&ndash;|&#8211;/g, " & ");
  out = out.replace(/\s{2,}/g, " ").trim();
  return out;
}

function formatDuration(s: string) {
  if (!s) return "";
  const str = String(s).trim();
  // Convert formats like "12h 30m" -> "12 hours 30 minutes"
  const m =
    str.match(/^(\d+)h(?:\s*(\d+))?m?$/i) ||
    str.match(/^(\d+)h(?:\s*(\d+)m)?$/i) ||
    str.match(/^(\d+)\s*h(?:\s*(\d+)\s*m)?$/i);
  if (m) {
    const h = parseInt(m[1] || "0", 10);
    const mins = parseInt(m[2] || "0", 10);
    const parts: string[] = [];
    if (h) parts.push(`${h} ${h === 1 ? "hour" : "hours"}`);
    if (mins) parts.push(`${mins} ${mins === 1 ? "minute" : "minutes"}`);
    return parts.join(" ") || str;
  }
  // If already contains words, keep as-is
  if (/hour|minute/i.test(str)) return str;
  // If it's a simple number, assume hours
  const num = Number(str);
  if (isFinite(num) && num > 0) return `${num} ${num === 1 ? "hour" : "hours"}`;
  return str;
}

function seededRandom(key: string): number {
  let h = 2166136261 >>> 0; // FNV-1a 32-bit
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (h >>> 0) / 0xffffffff;
}

function genRating(key: string): number {
  const r = seededRandom(key + ":rating");
  const val = 4.5 + 0.3 * r;
  return Math.round(val * 10) / 10;
}

function genStudents(key: string): number {
  const r = seededRandom(key + ":students");
  const min = 1000, max = 80000;
  const val = Math.floor(min + (max - min) * Math.pow(r, 0.6));
  return Math.round(val / 10) * 10;
}

function formatStudents(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}
