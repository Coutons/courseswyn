import type { Metadata } from "next";
import dynamicImport from "next/dynamic";
import SearchClient from "./SearchClient";

const NewsletterSignupCard = dynamicImport(() => import("@/app/newsletter/SignupCard"), { ssr: false });

const PRIMARY_KEYWORD = "Udemy Coupons";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://courseswyn.com").replace(/\/$/, "");

type SearchPageProps = {
  searchParams: {
    q?: string;
  };
};

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = (searchParams?.q || "").trim();
  const hasQuery = query.length > 0;
  const title = hasQuery
    ? `Search results for "${query}" | Courseswyn`
    : `${PRIMARY_KEYWORD} Search | Courseswyn`;
  const description = hasQuery
    ? `Browse Udemy coupons, promo codes, and free course deals matching "${query}" curated by the Courseswyn editorial team.`
    : "Explore up-to-date Udemy coupon codes, promo links, and exclusive discounts curated by Courseswyn.";
  const urlPath = hasQuery ? `/search?q=${encodeURIComponent(query)}` : "/search";

  return {
    title,
    description,
    keywords: hasQuery
      ? [
          "Udemy coupons",
          "Udemy coupon codes",
          "Udemy promo codes",
          "Udemy discounts",
          "Udemy deals",
          "free Udemy courses",
          "online learning discounts",
          query,
        ]
      : [
          "Udemy coupons",
          "Udemy coupon codes",
          "Udemy promo codes",
          "Udemy discounts",
          "Udemy deals",
          "free Udemy courses",
          "online learning discounts",
        ],
    alternates: {
      canonical: urlPath,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: urlPath,
      siteName: "Courseswyn",
    },
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams?.q || "").trim();
  const hasQuery = query.length > 0;
  const heading = hasQuery ? `Search results for "${query}"` : "Search Udemy coupons & discounts";
  const heroDescription = hasQuery
    ? `We found curated Udemy coupons, 100% off codes, and promo deals related to "${query}". Adjust the filters or refine your query to discover more.`
    : "Use the search bar to uncover the newest Udemy coupons, 100% off codes, and promo discounts. Filter by provider, price, or category to surface the perfect course deal.";

  const searchJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section
        style={{
          padding: 16,
          border: "1px solid rgba(20, 184, 166, 0.24)",
          borderRadius: 16,
          background: "linear-gradient(135deg, #06212b 0%, #0d2f3c 60%, #051e24 100%)",
        }}
      >
        <h1 style={{ marginBottom: 8 }}>{heading}</h1>
        <p className="muted" style={{ marginTop: 0 }}>{heroDescription}</p>
        <div className="muted" style={{ marginTop: 12, fontSize: 13, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/?provider=udemy&freeOnly=1" style={{ color: "var(--brand)", fontWeight: 600 }}>Free Udemy coupons</a>
          <a href="/?provider=udemy&category=development" style={{ color: "var(--brand)", fontWeight: 600 }}>Development coupons</a>
          <a href="/?provider=udemy&category=design" style={{ color: "var(--brand)", fontWeight: 600 }}>Design coupons</a>
          <a href="/?provider=udemy&category=it-and-software" style={{ color: "var(--brand)", fontWeight: 600 }}>IT & software coupons</a>
        </div>
      </section>

      <NewsletterSignupCard />

      <SearchClient />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchJsonLd) }} />
    </div>
  );
}
