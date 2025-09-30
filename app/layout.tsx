import "../styles/globals.css";
import React from "react";
import Script from "next/script";

export const metadata = {
  title: "Courseswyn Deals",
  description: "Daily updated Udemy coupons, 100% off course deals, and free learning resources curated by Courseswyn.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://courseswyn.com"),
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
        {/* Google AdSense Auto Ads */}
        <Script
          id="adsense-auto"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8220442576502761"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Impact STAT Tag */}
        <Script
          id="impact-stat-tag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(a,b,c,d,e,f,g){
                e['ire_o'] = c;
                e[c] = e[c] || function(){
                  (e[c].a = e[c].a||[]).push(arguments)
                };
                f = d.createElement(b);
                g = d.getElementsByTagName(b)[0];
                f.async = 1;
                f.src = a;
                g.parentNode.insertBefore(f,g);
              })('//d.impactradius-event.com/A6564357-35a5-419d-9b2e-28c3c7b15ac311.js','script','impactStat',document,window);
              
              if (typeof impactStat === 'function') {
                try {
                  impactStat('transformLinks');
                  impactStat('trackImpression');
                  console.log('Impact STAT tag initialized successfully');
                } catch (e) {
                  console.error('Error initializing Impact STAT tag:', e);
                }
              } else {
                console.error('impactStat function not found');
              }
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
              url: typeof window !== "undefined" ? window.location.origin : "https://courseswyn.com",
              logo: typeof window !== "undefined" ? `${window.location.origin}/logo.svg` : "https://courseswyn.com/logo.svg",
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
              url: typeof window !== "undefined" ? window.location.origin : "https://courseswyn.com",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  typeof window !== "undefined"
                    ? `${window.location.origin}/search?q={search_term_string}`
                    : "https://courseswyn.com/search?q={search_term_string}",
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
                gap: "1.5rem",
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
                    border: "1px solid #1f2330",
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
          <div className="container">© {new Date().getFullYear()} Courseswyn</div>
        </footer>
      </body>
    </html>
  );
}