import type { Metadata } from "next";
import DealsList from "@/components/DealsList";
import { readDeals } from "@/lib/store";

export const metadata: Metadata = {
  title: "Udemy Coupons, Promo Codes & 100% Off Deals | Courseswyn",
  description:
    "Discover the latest Udemy coupons, 100% off promo codes, and free courses updated daily. Let Courseswyn guide you to the best savings on Udemy.",
  alternates: {
    canonical: "/udemy-coupons",
  },
  openGraph: {
    title: "Udemy Coupons & Promo Codes | Courseswyn",
    description:
      "The best collection of Udemy coupons: discount codes, 100% off deals, and free courses verified by the Courseswyn team.",
    url: "/udemy-coupons",
    type: "article",
  },
};

export const revalidate = 1800;

const FAQ_ENTRIES = [
  {
    question: "How can I find 100% off Udemy coupons?",
    answer:
      "Bookmark this page and check back daily—our team refreshes the list of coupons and free courses multiple times a day. You can also subscribe to Courseswyn email alerts to get notified instantly.",
  },
  {
    question: "How long do Udemy coupons usually stay active?",
    answer:
      "Most Udemy coupons last only 1-3 days or until the enrollment quota is reached. Redeem the code as soon as you find a course that fits your goals.",
  },
  {
    question: "Do Udemy coupons work for every course?",
    answer:
      "No. Coupons are issued by individual instructors and apply only to their courses. Use the Get Deal button to confirm the coupon still works on Udemy before enrolling.",
  },
];

function buildFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ENTRIES.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function buildItemListJson(deals: any[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: deals.slice(0, 12).map((deal: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://courseswyn.com'}/deal/${deal.slug || deal.id}`,
      name: String(deal.title || ''),
    })),
  };
}

function toClientDeal(deal: any) {
  return {
    id: deal.id,
    slug: deal.slug,
    title: deal.title,
    provider: deal.provider,
    url: deal.url,
    finalUrl: deal.finalUrl,
    price: deal.price,
    originalPrice: deal.originalPrice,
    rating: deal.rating,
    students: deal.students,
    image: deal.image,
    category: deal.category,
    subcategory: deal.subcategory,
    expiresAt: deal.expiresAt,
    coupon: deal.coupon,
    updatedAt: deal.updatedAt,
  };
}

export default async function UdemyCouponsPage() {
  const allDeals = await readDeals();
  const udemyDeals = (allDeals || []).filter(
    (deal) => String(deal.provider || '').toLowerCase() === 'udemy'
  );
  const sorted = [...udemyDeals].sort(
    (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
  );

  const total = sorted.length;
  const pageSize = 12;
  const initialItems = sorted.slice(0, pageSize).map(toClientDeal);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const faqJsonLd = buildFaqJsonLd();
  const itemListJson = buildItemListJson(sorted);

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <section
        className="card"
        style={{
          border: '1px solid rgba(0, 138, 92, 0.24)',
          borderRadius: 16,
          background: 'linear-gradient(135deg, #06212b 0%, #0d2f3c 60%, #051e24 100%)',
        }}
      >
        <div className="card-body" style={{ display: 'grid', gap: 10 }}>
          <h1 style={{ margin: 0 }}>Udemy Coupons & Promo Codes</h1>
          <p className="muted" style={{ margin: 0 }}>
            The best free and discounted Udemy courses updated every single day. Find 100% off coupons, exclusive promo
            codes, and curated recommendations for trending Udemy classes on sale.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
            <span className="pill" style={{ background: '#0a3c31', color: '#d7f6ec' }}>
              {total} curated Udemy deals
            </span>
            <span className="pill" style={{ background: '#15202d', color: '#9fcfd0' }}>
              Auto-refreshed multiple times per day
            </span>
            <span className="pill" style={{ background: '#19333c', color: '#bbe9e0' }}>
              Filter for 100% off codes & free courses
            </span>
          </div>
        </div>
      </section>

      <section className="card" style={{ borderRadius: 14 }}>
        <div className="card-body" style={{ display: 'grid', gap: 16 }}>
          <h2 style={{ margin: 0 }}>Latest Udemy Coupons</h2>
          <p className="muted" style={{ margin: 0 }}>
            Use the filters to surface 100% off coupons only, or click Show more to browse the full archive. Each card
            includes course rating, student count, and coupon expiration details so you can act quickly.
          </p>
          <DealsList
            initialItems={initialItems}
            initialPage={1}
            totalPages={totalPages}
            baseParams={{ provider: 'udemy', sort: 'newest', pageSize: String(pageSize) }}
          />
        </div>
      </section>

      <section className="card" style={{ borderRadius: 14 }}>
        <div className="card-body" style={{ display: 'grid', gap: 12 }}>
          <h2 style={{ margin: 0 }}>Tips to Maximize Udemy Coupons</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#b5dce0', fontSize: 14, display: 'grid', gap: 8 }}>
            <li>Subscribe to Courseswyn alerts so you never miss freshly dropped Udemy coupons.</li>
            <li>Redeem the code right away—popular coupons can run out in just a few hours.</li>
            <li>Stack coupons with Udemy’s official Flash Sales or seasonal promos for extra savings.</li>
            <li>Prioritize highly rated instructors to ensure your free course delivers real value.</li>
          </ul>
        </div>
      </section>

      <section className="card" style={{ borderRadius: 14 }}>
        <div className="card-body" style={{ display: 'grid', gap: 12 }}>
          <h2 style={{ margin: 0 }}>Udemy Coupon FAQ</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {FAQ_ENTRIES.map((item) => (
              <div key={item.question} style={{ border: '1px solid rgba(0, 138, 92, 0.24)', borderRadius: 12, padding: 16 }}>
                <h3 style={{ marginTop: 0 }}>{item.question}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJson) }} />
    </div>
  );
}
