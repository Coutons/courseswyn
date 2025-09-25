import "../styles/globals.css";
import React from "react";
import Script from "next/script";

export const metadata = {
  title: "Coursespeak Deals",
  description: "Find the best course deals and coupons",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Google AdSense Auto Ads */}
        <Script
          id="adsense-auto"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8220442576502761"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Organization & WebSite JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Coursespeak",
              url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"}`,
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"}/logo.svg`,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Coursespeak",
              url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"}`,
              potentialAction: {
                "@type": "SearchAction",
                target: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <header className="site-header">
          <div className="container">
            <h1 style={{ margin: 0, lineHeight: 0 }}>
              <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }} aria-label="Coursespeak Home">
                {/* Inline SVG logo to avoid asset loading issues */}
                <svg xmlns="http://www.w3.org/2000/svg" width="176" height="32" viewBox="0 0 220 48" aria-hidden>
                  <defs>
                    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#3b82f6"/>
                      <stop offset="100%" stop-color="#06b6d4"/>
                    </linearGradient>
                  </defs>
                  <g transform="translate(0,0)">
                    <rect x="0" y="0" width="220" height="48" rx="10" fill="#0f1320"/>
                    <g transform="translate(10,8)">
                      <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#g)"/>
                      <path d="M9 22c0-4.97 4.03-9 9-9 2.2 0 4.22.78 5.8 2.08l-2.1 2.1A6.5 6.5 0 0 0 18 15.5c-3.04 0-5.5 2.46-5.5 5.5s2.46 5.5 5.5 5.5a6.5 6.5 0 0 0 6.08-4.7l2.36.69A9 9 0 0 1 18 31c-4.97 0-9-4.03-9-9z" fill="#0b0d12" opacity=".9"/>
                    </g>
                    <g>
                      <text x="52" y="30" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="20" font-weight="700" fill="#eaf4ff">Coursespeak</text>
                      <text x="52" y="42" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="10" fill="#9db7ff">Deals & Coupons</text>
                    </g>
                  </g>
                </svg>
              </a>
            </h1>
            <nav>
              <a href="/">Home</a>
              <a href="/categories">Categories</a>
              <a href="/search">Search</a>
              <a href="/saved">Saved</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <div className="container">© {new Date().getFullYear()} Coursespeak</div>
        </footer>
      </body>
    </html>
  );
}
