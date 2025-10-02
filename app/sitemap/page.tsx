import type { Metadata } from "next";
import Link from "next/link";
import { readDeals } from "@/lib/store";
import { buildDealLink } from "@/lib/links";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Sitemap | Courseswyn",
  description: "Explore the Courseswyn site structure: Udemy coupons, categories, blog guides, and key resources in one place.",
  alternates: { canonical: "/sitemap" },
  openGraph: {
    title: "Sitemap | Courseswyn",
    description: "Browse all Courseswyn pages including Udemy coupons, categories, and guides.",
    url: "/sitemap",
  },
};

function slugifyCategory(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeName(raw?: string | null) {
  if (!raw) return undefined;
  return String(raw).replace(/&amp;/gi, "&").trim();
}

export default async function SitemapPage() {
  const deals = await readDeals();
  const categoriesMap = new Map<string, { name: string; count: number }>();
  deals.forEach((deal: any) => {
    const name = normalizeName(deal.category);
    if (!name) return;
    const key = name.toLowerCase();
    const current = categoriesMap.get(key) || { name, count: 0 };
    if (current.name.includes("&amp;") && !name.includes("&amp;")) {
      current.name = name;
    }
    current.count += 1;
    categoriesMap.set(key, current);
  });

  const categories = Array.from(categoriesMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 24)
    .map((c) => ({ ...c, slug: slugifyCategory(c.name) }));

  const latestDeals = deals
    .slice()
    .sort((a: any, b: any) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
    .slice(0, 6);

  const staticLinks = [
    { href: "/", label: "Homepage" },
    { href: "/udemy-coupons", label: "Udemy coupons" },
    { href: "/search", label: "Advanced search" },
    { href: "/categories", label: "Browse categories" },
    { href: "/contact", label: "Contact" },
  ];

  const blogLinks = [
    { href: "/post/udemy-coupons-guide", label: "Ultimate guide to Udemy coupons" },
    { href: "/post/how-to-redeem-udemy-coupons", label: "How to redeem Udemy coupons" },
  ];

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section
        className="card"
        style={{
          border: "1px solid rgba(20, 184, 166, 0.24)",
          borderRadius: 16,
          background: "linear-gradient(135deg, #06212b 0%, #0d2f3c 60%, #051e24 100%)",
        }}
      >
        <div className="card-body" style={{ display: "grid", gap: 12 }}>
          <h1 style={{ margin: 0 }}>Sitemap</h1>
          <p className="muted" style={{ margin: 0 }}>
            Jump to the most important sections of Courseswyn, including daily Udemy coupons, category pages, search filters, and editorial guides.
          </p>
        </div>
      </section>

      <section className="card" style={{ borderRadius: 14 }}>
        <div className="card-body" style={{ display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Primary pages</h2>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            {staticLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer-link">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card" style={{ borderRadius: 14 }}>
        <div className="card-body" style={{ display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Popular Udemy coupon categories</h2>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {categories.map((cat) => (
              <div key={cat.slug} style={{ border: "1px solid rgba(20, 184, 166, 0.24)", borderRadius: 12, padding: 12 }}>
                <Link href={`/?category=${cat.slug}`} className="footer-link" style={{ display: "block", fontWeight: 600, color: "#e6f6f4" }}>
                  {cat.name}
                </Link>
                <div className="muted" style={{ fontSize: 12 }}>{cat.count} deals</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card" style={{ borderRadius: 14 }}>
        <div className="card-body" style={{ display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Latest Udemy coupon listings</h2>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            {latestDeals.map((deal: any) => (
              <li key={deal.id}>
                <Link href={`/deal/${deal.slug || deal.id}`} className="footer-link" style={{ color: "#e6f6f4" }}>
                  {deal.title || "Untitled deal"}
                </Link>
                {deal.provider ? <span className="muted" style={{ marginLeft: 6 }}>• {deal.provider}</span> : null}
              </li>
            ))}
          </ul>
          <Link href="/udemy-coupons" className="pill" style={{ width: "fit-content" }}>Browse all coupons</Link>
        </div>
      </section>

      <section className="card" style={{ borderRadius: 14 }}>
        <div className="card-body" style={{ display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Guides & resources</h2>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            {blogLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer-link">{link.label}</Link>
              </li>
            ))}
            <li>
              <a href="/?provider=udemy&freeOnly=1" className="footer-link">Find 100% off coupons</a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
