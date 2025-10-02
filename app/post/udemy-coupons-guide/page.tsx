import type { Metadata } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://courseswyn.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Ultimate Guide to Udemy Coupons & 100% Off Codes",
  description:
    "Learn how to find, redeem, and track Udemy coupons—including 100% off codes, flash sales, and instructor promos—so you never miss a deal.",
  alternates: {
    canonical: "/post/udemy-coupons-guide",
  },
  openGraph: {
    title: "Ultimate Guide to Udemy Coupons | Courseswyn",
    description:
      "Everything you need to know about Udemy coupons, free courses, and promo codes—updated by the Courseswyn editorial team.",
    url: "/post/udemy-coupons-guide",
    type: "article",
  },
};

const sections = [
  {
    heading: "1. Understand the different Udemy coupon types",
    content:
      "Udemy coupons come from two sources: instructor-generated codes and platform-wide promotions. Instructor codes usually unlock 100% off enrollments for a limited quota. Platform promos (Flash Sales, Black Friday, New Year) slash prices sitewide, but rarely reach 100% off.",
  },
  {
    heading: "2. Monitor daily coupon drops",
    content:
      "Check the Courseswyn homepage each day for the latest curated Udemy coupons. Want instant alerts? Subscribe to the newsletter so fresh deals land directly in your inbox before they expire.",
  },
  {
    heading: "3. Filter for 100% off coupons",
    content:
      "Use the 100% off filter on our Udemy coupons hub to instantly surface free courses. We tag every listing with the current price, so you can see whether a code is still working.",
  },
  {
    heading: "4. Redeem coupons correctly",
    content:
      "Open the course page via the Courseswyn deal card, log in to Udemy, and click 'Enroll now'. If the price shows $0.00, the coupon applied successfully. If not, try refreshing or clearing your cart—some codes fail when other discounted courses are present.",
  },
  {
    heading: "5. Act before the quota disappears",
    content:
      "Many instructor coupons cap enrollments at 500–1,000 seats. Popular coding and certification courses can reach the limit in a few hours. Add reminders to revisit Courseswyn throughout the day for new drops.",
  },
  {
    heading: "6. Track categories that matter to you",
    content:
      "Bookmark category filters such as Development, IT & Software, and Design. Every filter URL on Courseswyn is shareable—perfect for checking only the topics you follow.",
  },
  {
    heading: "7. Combine coupons with flash sales",
    content:
      "During Udemy flash sales, even a partial coupon can stack with platform-wide pricing. If a coupon fails, wait for a seasonal sale (Black Friday, Cyber Monday, New Year) where prices often drop to $9.99 or less.",
  },
  {
    heading: "8. Keep an eye on the expiry",
    content:
      "Most coupons are valid for 48–72 hours. Courseswyn displays the timestamp or relative countdown so you always know when a code is about to lapse.",
  },
];

const faqEntries = [
  {
    question: "Where can I find the latest Udemy coupons?",
    answer: "Visit the Courseswyn Udemy coupons hub and subscribe to alerts for daily curated codes.",
  },
  {
    question: "Why isn\'t my Udemy coupon working?",
    answer:
      "Coupons fail when the enrollment quota is full or when the course is no longer eligible. Try removing other discounted items from your cart and retry with a fresh Courseswyn link.",
  },
  {
    question: "Are there free Udemy certifications?",
    answer:
      "Many certification prep courses offer 100% off coupons for a short window. Use the 'Free Udemy courses' filter on Courseswyn to find them quickly.",
  },
];

function buildFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntries.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

const breadcrumbJson = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Udemy Coupons',
      item: `${SITE_URL}/udemy-coupons`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Ultimate Guide to Udemy Coupons',
      item: `${SITE_URL}/post/udemy-coupons-guide`,
    },
  ],
};

export default function UdemyCouponsGuidePage() {
  const faqJson = buildFaqJsonLd();

  return (
    <article className="card" style={{ padding: 0 }}>
      <div className="card-body" style={{ display: "grid", gap: 20 }}>
        <header>
          <p className="pill" style={{ display: "inline-flex", marginBottom: 12 }}>Guides</p>
          <h1 style={{ margin: 0 }}>Ultimate Guide to Udemy Coupons & 100% Off Codes</h1>
          <p className="muted" style={{ marginTop: 8, maxWidth: 720 }}>
            A step-by-step playbook for discovering and redeeming Udemy coupons before they expire.
          </p>
          <div className="muted" style={{ fontSize: 13, display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <span>Updated {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
            <span>Reading time: 5 minutes</span>
          </div>
        </header>

        <section style={{ display: "grid", gap: 16 }}>
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 style={{ marginBottom: 8 }}>{section.heading}</h2>
              <p className="muted" style={{ marginTop: 0, lineHeight: 1.7 }}>{section.content}</p>
            </div>
          ))}
        </section>

        <section style={{ background: "#081823", borderRadius: 14, padding: 18, display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Helpful links</h2>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            <li>
              <a href="/udemy-coupons" style={{ color: "var(--brand)", fontWeight: 600 }}>Udemy coupons hub</a>
              <span className="muted" style={{ marginLeft: 6 }}>Daily curated codes and filters.</span>
            </li>
            <li>
              <a href="/?provider=udemy&freeOnly=1" style={{ color: "var(--brand)", fontWeight: 600 }}>Free Udemy courses filter</a>
              <span className="muted" style={{ marginLeft: 6 }}>Instantly surface 100% off coupons.</span>
            </li>
            <li>
              <a href="/categories" style={{ color: "var(--brand)", fontWeight: 600 }}>Browse course categories</a>
              <span className="muted" style={{ marginLeft: 6 }}>Follow the topics you care about.</span>
            </li>
          </ul>
        </section>

        <section style={{ display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Udemy coupon FAQ</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {faqEntries.map((faq) => (
              <details
                key={faq.question}
                style={{ background: "#101a27", border: "1px solid #142232", borderRadius: 12, padding: 12 }}
              >
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>{faq.question}</summary>
                <div style={{ color: "#b8c7d6", marginTop: 8 }}>{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />
    </article>
  );
}
