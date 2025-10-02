import type { Metadata } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://courseswyn.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "How to Redeem Udemy Coupons Successfully",
  description:
    "A practical walkthrough for applying Udemy coupons, avoiding common errors, and making sure you secure free or discounted enrollments.",
  alternates: {
    canonical: "/post/how-to-redeem-udemy-coupons",
  },
  openGraph: {
    title: "How to Redeem Udemy Coupons | Courseswyn",
    description:
      "Follow these simple steps to redeem Udemy coupons without hitting quota or checkout errors.",
    url: "/post/how-to-redeem-udemy-coupons",
    type: "article",
  },
};

const steps = [
  {
    heading: "Step 1: Open the deal from Courseswyn",
    content:
      "Always start from the Courseswyn deal card so the coupon link loads with the correct parameters. This ensures the code or discounted price is applied when you land on Udemy.",
  },
  {
    heading: "Step 2: Log into Udemy first",
    content:
      "Log in before clicking \"Enroll now\". Udemy sometimes strips coupon pricing when you are signed out, especially on mobile browsers.",
  },
  {
    heading: "Step 3: Confirm the discounted price",
    content:
      "Check the left-hand summary on the Udemy checkout page. A valid 100% off coupon will show $0.00 due. Partial coupons will display the discounted amount.",
  },
  {
    heading: "Step 4: Clear old cart items if the coupon fails",
    content:
      "Remove other discounted courses from your cart and refresh the page. Udemy occasionally blocks stacking multiple promotions in a single checkout.",
  },
  {
    heading: "Step 5: Enroll immediately",
    content:
      "Free and 100% off coupons often expire after 24–48 hours or when the enrollment quota is met. Secure the seat now and start learning later.",
  },
  {
    heading: "Step 6: Bookmark your go-to filters",
    content:
      "Keep shortcuts to the Courseswyn filters that match your interest—like development, IT & software, or design—so you can refresh coupons quickly.",
  },
];

const faqEntries = [
  {
    question: "Why is my Udemy coupon showing a full price?",
    answer:
      "The quota or expiry may have passed. Refresh the Courseswyn listing for the latest code or try another deal from the same category.",
  },
  {
    question: "Can I redeem Udemy coupons on mobile?",
    answer:
      "Yes, but coupon links work best in the Udemy mobile app or desktop browser. If the price doesn\'t update, switch devices or clear cache.",
  },
  {
    question: "How many coupons can I redeem per day?",
    answer:
      "There is no hard limit from Udemy, but each coupon has its own quota. Enroll quickly to avoid missing out on popular courses.",
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
      name: 'How to Redeem Udemy Coupons',
      item: `${SITE_URL}/post/how-to-redeem-udemy-coupons`,
    },
  ],
};

export default function HowToRedeemUdemyCouponsPage() {
  const faqJson = buildFaqJsonLd();

  return (
    <article className="card" style={{ padding: 0 }}>
      <div className="card-body" style={{ display: "grid", gap: 20 }}>
        <header>
          <p className="pill" style={{ display: "inline-flex", marginBottom: 12 }}>Guides</p>
          <h1 style={{ margin: 0 }}>How to Redeem Udemy Coupons Successfully</h1>
          <p className="muted" style={{ marginTop: 8, maxWidth: 720 }}>
            Follow this checklist to make sure your Udemy coupons apply correctly and your enrollment stays free or deeply discounted.
          </p>
          <div className="muted" style={{ fontSize: 13, display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <span>Updated {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
            <span>Reading time: 4 minutes</span>
          </div>
        </header>

        <section style={{ display: "grid", gap: 16 }}>
          {steps.map((step) => (
            <div key={step.heading}>
              <h2 style={{ marginBottom: 8 }}>{step.heading}</h2>
              <p className="muted" style={{ marginTop: 0, lineHeight: 1.7 }}>{step.content}</p>
            </div>
          ))}
        </section>

        <section style={{ background: "#081823", borderRadius: 14, padding: 18, display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Helpful resources</h2>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            <li>
              <a href="/udemy-coupons" style={{ color: "var(--brand)", fontWeight: 600 }}>Udemy coupons hub</a>
              <span className="muted" style={{ marginLeft: 6 }}>See fresh deals and filters.</span>
            </li>
            <li>
              <a href="/?provider=udemy&freeOnly=1" style={{ color: "var(--brand)", fontWeight: 600 }}>100% off Udemy courses</a>
              <span className="muted" style={{ marginLeft: 6 }}>Jump straight to free enrollments.</span>
            </li>
            <li>
              <a href="/search" style={{ color: "var(--brand)", fontWeight: 600 }}>Advanced search</a>
              <span className="muted" style={{ marginLeft: 6 }}>Combine filters for better results.</span>
            </li>
          </ul>
        </section>

        <section style={{ display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Udemy coupon troubleshooting FAQ</h2>
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
