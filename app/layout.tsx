import "../styles/globals.css";
import React from "react";
import Script from "next/script";
import dynamicImport from "next/dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://courseswyn.com").replace(/\/$/, "");

const NewsletterSignupCard = dynamicImport(() => import("@/app/newsletter/SignupCard"), { ssr: false });

export const metadata = {
  title: "Courseswyn Deals",
  description: "Daily updated Udemy coupons, 100% off course deals, and free learning resources curated by Courseswyn.",
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Google Analytics */}
        <Script
          id="gtag-base"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VPY4HMMKBH"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VPY4HMMKBH');
            `,
          }}
        />
        {/* Organization & WebSite JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Courseswyn",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.svg`,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Courseswyn",
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <header className="site-header">
          <div className="container">
            <h1 style={{ margin: 0, lineHeight: 0 }}>
              <a
                href="/"
                style={{ display: "inline-flex", alignItems: "center", gap: 0, textDecoration: "none" }}
                aria-label="Courseswyn Home"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" viewBox="0 0 88 44" aria-hidden>
                  <defs>
                    <linearGradient id="crwGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#35ffb0" />
                      <stop offset="100%" stopColor="#00c777" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="88" height="44" rx="14" fill="#061016" />
                  <g
                    transform="translate(12,10)"
                    fill="none"
                    stroke="url(#crwGradient)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2H10C6 2 4 4 4 8v16c0 4 2 6 6 6h8" />
                    <path d="M34 2v22M34 2h10c6 0 8 2.4 8 7.2 0 4.8-2 7.2-8 7.2H34l14 13.6" />
                    <path d="M56 2l5.4 24L66 13l4.6 13L76 2" />
                  </g>
                </svg>
              </a>
            </h1>
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              <a href="/" className="nav-link">
                Home
              </a>
              <a href="/categories" className="nav-link">
                Categories
              </a>
              <a href="/udemy-coupons" className="nav-link">
                Udemy Coupons
              </a>
              <a href="/search" className="nav-link">
                Courses
              </a>
              <a href="/contact" className="nav-link">
                Contact
              </a>
              <form action="/search" method="get" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="search"
                  name="q"
                  placeholder="Search courses..."
                  aria-label="Search courses"
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(20, 184, 166, 0.24)",
                    background: "#0f1320",
                    color: "#e6e9f2",
                    minWidth: 180,
                  }}
                />
                <button
                  type="submit"
                  className="pill"
                  style={{ padding: "6px 14px" }}
                >
                  Search
                </button>
              </form>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <div className="container" style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "grid", gap: 12 }}>
              <strong style={{ fontSize: 16 }}>Stay ahead of new Udemy coupons</strong>
              <NewsletterSignupCard />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              <div style={{ minWidth: 160 }}>
                <strong style={{ display: "block", marginBottom: 8 }}>Explore</strong>
                <div style={{ display: "grid", gap: 6 }}>
                  <a href="/udemy-coupons" className="footer-link">Udemy coupons</a>
                  <a href="/?provider=udemy&freeOnly=1" className="footer-link">Free Udemy courses</a>
                  <a href="/categories" className="footer-link">Browse categories</a>
                  <a href="/search" className="footer-link">Advanced search</a>
                </div>
              </div>
              <div style={{ minWidth: 160 }}>
                <strong style={{ display: "block", marginBottom: 8 }}>Popular topics</strong>
                <div style={{ display: "grid", gap: 6 }}>
                  <a href="/?provider=udemy&category=development" className="footer-link">Web development coupons</a>
                  <a href="/?provider=udemy&category=it-and-software" className="footer-link">IT & software coupons</a>
                  <a href="/?provider=udemy&category=design" className="footer-link">Design coupons</a>
                  <a href="/post/udemy-coupons-guide" className="footer-link">Udemy coupon guide</a>
                </div>
              </div>
              <div style={{ minWidth: 160 }}>
                <strong style={{ display: "block", marginBottom: 8 }}>Company</strong>
                <div style={{ display: "grid", gap: 6 }}>
                  <a href="/contact" className="footer-link">Contact form</a>
                  <a href="mailto:hello@courseswyn.com" className="footer-link">Email us: hello@courseswyn.com</a>
                  <a href="/sitemap" className="footer-link">Sitemap</a>
                </div>
              </div>
            </div>
            <div className="site-footer-bottom">
              <span>© {new Date().getFullYear()} Courseswyn. All rights reserved.</span>
              <div className="footer-inline-links">
                <a href="/privacy" className="footer-link">Privacy Policy</a>
                <a href="/terms" className="footer-link">Terms of Use</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}