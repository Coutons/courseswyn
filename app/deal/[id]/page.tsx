import type { Deal } from "@/types/deal";
import type { Metadata } from "next";
import { readDeals, getDealById } from "@/lib/store";
import { renderMarkdownToHtml } from "@/lib/markdown";
import ActionsPanel from "@/components/ActionsPanel";
import RelatedList from "@/components/RelatedList";
import { buildDealLink } from "@/lib/links";
import type { ReactNode } from "react";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://courseswyn.com").replace(/\/$/, "");

async function getDeal(id: string): Promise<Deal> {
  const deal = (await getDealById(id)) ?? (await findBySlug(id));
  if (!deal) throw new Error("Deal not found");
  return deal;
}

async function findBySlug(slug: string): Promise<Deal | null> {
  const all = await readDeals();
  return all.find((d) => d.slug === slug) ?? null;
}

function normalizeTitle(s: string) {
  let out = s || "";
  out = out.replace(/&amp;/g, "&");
  out = out.replace(/&quot;/g, '"');
  out = out.replace(/&apos;|&#8217;/g, "'");
  out = out.replace(/&ndash;|&#8211;/g, " & ");
  out = out.replace(/\s{2,}/g, " ").trim();
  return out;
}

// Fallback helpers for rating/students (deterministic), and price display
function seededRandom(key: string): number {
  let h = 2166136261 >>> 0;
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

function renderStars(rating?: number) {
  const r = Math.max(0, Math.min(5, rating ?? 0));
  const full = Math.floor(r);
  const frac = r - full;
  const hasHalf = frac >= 0.25 && frac < 0.75;
  const extraFull = frac >= 0.75 ? 1 : 0;
  const totalFull = full + extraFull;
  const total = 5;
  const stars: ("full" | "half" | "empty")[] = [];
  for (let i = 0; i < total; i++) {
    if (i < totalFull) stars.push("full");
    else if (i === totalFull && hasHalf) stars.push("half");
    else stars.push("empty");
  }
  return (
    <span aria-label={`Rating ${r.toFixed(1)} out of 5`} style={{ display: "inline-flex", gap: 2 }}>
      {stars.map((t, i) => (
        <Star key={i} type={t} />
      ))}
    </span>
  );
}

function Star({ type }: { type: "full" | "half" | "empty" }) {
  // Inline SVG star with optional half fill using a clipPath
  const fill = type === "empty" ? "none" : "currentColor";
  const stroke = "currentColor";
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden focusable="false" style={{ color: "#fbbf24" }}>
      {type === "half" ? (
        <>
          <defs>
            <clipPath id="half">
              <rect x="0" y="0" width="12" height="24" />
            </clipPath>
          </defs>
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.869 1.402-8.168L.132 9.21l8.2-1.192L12 .587z" fill="none" stroke={stroke} strokeWidth="1" />
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.869 1.402-8.168L.132 9.21l8.2-1.192L12 .587z" fill={fill} clipPath="url(#half)" />
        </>
      ) : (
        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.869 1.402-8.168L.132 9.21l8.2-1.192L12 .587z" fill={fill} stroke={stroke} strokeWidth="1" />
      )}
    </svg>
  );
}

export default async function DealDetail({ params }: { params: { id: string } }) {
  const d = await getDeal(params.id);
  // UI fallback values (keep display consistent even when fields are missing)
  const key = String(d.slug || d.id);
  const providerLabel = typeof d.provider === "string" ? d.provider.trim() : "";
  const platformLabel = providerLabel || "Udemy";
  const rawCategory = typeof d.category === "string" ? d.category.trim() : "";
  const categoryLabel = rawCategory || platformLabel;
  const rawSubcategory = typeof d.subcategory === "string" ? d.subcategory.trim() : "";
  const subcategoryLabel = rawSubcategory || categoryLabel;
  const instructorName = typeof d.instructor === "string" ? d.instructor.trim() : "";
  const categoryHref = rawCategory ? `/?category=${encodeURIComponent(rawCategory)}` : null;
  const subcategoryHref = rawSubcategory ? `/?category=${encodeURIComponent(rawSubcategory)}` : null;
  
  const categoryLink: ReactNode = categoryHref ? (
    <a href={categoryHref} style={{ color: "#6aa2ff", textDecoration: "underline" }}>{categoryLabel}</a>
  ) : (
    categoryLabel
  );
  
  const subcategoryLink: ReactNode = subcategoryHref ? (
    <a href={subcategoryHref} style={{ color: "#6aa2ff", textDecoration: "underline" }}>{subcategoryLabel}</a>
  ) : (
    categoryLink
  );
  
  const instructorHighlight: ReactNode = instructorName ? (
    <>
      <strong>{instructorName}</strong> leads this Udemy course in {categoryLink}, blending real project wins with step-by-step coaching.
    </>
  ) : (
    <>
      This Udemy course blends real project wins with step-by-step coaching from instructors who live and breathe {categoryLabel}.
    </>
  );
  
  const communityParagraph: ReactNode = instructorName ? (
    <>
      <strong>{instructorName}</strong> also keeps an eye on the Q&amp;A and steps in quickly when you need clarity. You&apos;ll find fellow learners trading tips, keeping you motivated as you sharpen your {categoryLabel} skill set with trusted Udemy discounts.
    </>
  ) : (
    <>
      The teaching team also keeps an eye on the Q&amp;A and steps in quickly when you need clarity. You&apos;ll find fellow learners trading tips, keeping you motivated as you sharpen your {categoryLabel} skill set with trusted Udemy discounts.
    </>
  );
  
  const reviewParagraphs: ReactNode[] = [
    <>
      This Udemy coupon unlocks a guided path into <strong>{normalizeTitle(d.title)}</strong>, so you know exactly what outcomes to expect before you even press play.
    </>,
    instructorHighlight,
    <>
      The modules are sequenced to unpack {subcategoryLabel} step by step, blending theory with scenarios you can reuse at work while keeping the Udemy course reviews tone in mind.
    </>,
    <>
      Video walkthroughs sit alongside quick-reference sheets, checklists, and practice prompts that make it easy to translate the material into real projects, especially when you grab Udemy discounts like this one.
    </>,
    <>
      Because everything lives on <strong>{platformLabel}</strong>, you can move at your own pace, revisit lectures from any device, and pick the payment setup that fits your budget—ideal for stacking extra Udemy coupon savings.
    </>,
    communityParagraph,
    <>
      Ready to dive into <strong>{normalizeTitle(d.title)}</strong>? This deal keeps the momentum high and hands you the tools to apply {subcategoryLink} with confidence while your Udemy coupon is still active.
    </>,
  ];

  const displayPrice = typeof d.price === "number" && isFinite(d.price) && d.price > 0 ? d.price : 9.99;
  const displayOriginal = typeof d.originalPrice === "number" && isFinite(d.originalPrice) && d.originalPrice > displayPrice ? d.originalPrice : 119.99;
  const displayRating = typeof d.rating === "number" && isFinite(d.rating) ? d.rating : genRating(key);
  const displayStudents = typeof d.students === "number" && isFinite(d.students) ? d.students : genStudents(key);
  const allDeals = await readDeals();
  // Latest posts (newest updates first), exclude itself
  const pool = allDeals.filter((x) => x.id !== d.id);
  const parseIso = (s?: string) => (s ? new Date(s).getTime() : 0);
  const related = pool
    .slice()
    .sort((a, b) => (parseIso(b.updatedAt as any || b.createdAt as any) - parseIso(a.updatedAt as any || a.createdAt as any)));
  return (
    <div>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: d.title,
            provider: {
              "@type": "Organization",
              name: d.provider,
            },
            offers: {
              "@type": "Offer",
              price: d.price,
              priceCurrency: "USD",
              url: d.url,
              availability: "https://schema.org/InStock",
              validThrough: d.expiresAt ?? undefined,
            },
            aggregateRating: d.rating
              ? {
                  "@type": "AggregateRating",
                  ratingValue: d.rating,
                  reviewCount: Math.max(1, Math.floor((d.students ?? 0) / 10)),
                }
              : undefined,
            url: `${SITE_URL}/deal/${d.slug || d.id}`,
          }),
        }}
      />
      {/* Breadcrumbs JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
              },
              d.category
                ? {
                    "@type": "ListItem",
                    position: 2,
                    name: d.category,
                    item: `${SITE_URL}/?category=${encodeURIComponent(String(d.category).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""))}`,
                  }
                : undefined,
              {
                "@type": "ListItem",
                position: d.category ? 3 : 2,
                name: normalizeTitle(d.title),
                item: `${SITE_URL}/deal/${d.slug || d.id}`,
              },
            ].filter(Boolean),
          }),
        }}
      />
      {d.faqs?.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: d.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      ) : null}

      <div className="detail-grid" style={{ marginTop: 16 }}>
        {/* LEFT: main content (Udemy: title/desc/rating/students on the left) */}
        <div className="left">
          <section>
            <h2 style={{ marginBottom: 8 }}>{normalizeTitle(d.title)}</h2>
            {d.description && (
              <p className="muted" style={{ fontSize: 16, marginTop: 0 }}>{d.description}</p>
            )}
            {d.instructor && (
              <div className="muted" style={{ marginTop: 6 }}>Created by {d.instructor}</div>
            )}
            <div className="muted" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
              <a className="pill" href={`/?provider=${encodeURIComponent(d.provider)}`}>{d.provider}</a>
              {d.duration && (
                <span title="Duration" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span aria-hidden>⏱</span> {d.duration}
                </span>
              )}
              <span title="Students enrolled" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span aria-hidden>👥</span> {d.students?.toLocaleString?.() ?? "-"} enrolled
              </span>
              {d.language && (
                <span title="Language" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span aria-hidden>🌐</span> {d.language}
                </span>
              )}
              <span title="Rating" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                {renderStars(d.rating)}
                <span className="muted">{(d.rating ?? 0).toFixed(1)}</span>
              </span>
            </div>
            {(d.category || d.subcategory) && (
              <div className="muted" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                {d.category && <a className="pill" href={`/?category=${encodeURIComponent(d.category)}`}>{d.category}</a>}
                {d.subcategory && <a className="pill" href={`/?category=${encodeURIComponent(d.subcategory)}`}>{d.subcategory}</a>}
              </div>
            )}
          </section>

          {d.learn?.length ? (
            <section style={{ marginTop: 24 }}>
              <h3>What you&apos;ll learn</h3>
              <ul style={{ display: "grid", gap: 8, paddingLeft: 18 }}>
                {d.learn.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {d.requirements?.length ? (
            <section style={{ marginTop: 24 }}>
              <h3>Requirements</h3>
              <ul style={{ display: "grid", gap: 8, paddingLeft: 18 }}>
                {d.requirements.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {d.content && (
            <section style={{ marginTop: 24 }}>
              <h3>About this course</h3>
              <div style={{ lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(d.content) }} />
            </section>
          )}

          {d.curriculum?.length ? (
            <section style={{ marginTop: 24 }}>
              <h3>Course content</h3>
              <div style={{ display: "grid", gap: 8 }}>
                {d.curriculum.map((sec, i) => (
                  <details key={i} style={{ background: "var(--card)", border: "1px solid #1f2330", borderRadius: 8, padding: 12 }}>
                    <summary style={{ cursor: "pointer", fontWeight: 600 }}>{sec.section}</summary>
                    <ul style={{ marginTop: 8, display: "grid", gap: 6, paddingLeft: 18 }}>
                      {sec.lectures.map((lec, j) => (
                        <li key={j} className="muted">
                          {lec.title} {lec.duration ? `• ${lec.duration}` : ""}
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {related.length > 0 && (
            <section style={{ marginTop: 24 }}>
              <h3>Related Deals</h3>
              <RelatedList
                items={related.map((r) => {
                  const key = String(r.slug || r.id);
                  const price = typeof (r as any).price === "number" && isFinite((r as any).price) ? (r as any).price : 9.99;
                  const originalPrice = typeof (r as any).originalPrice === "number" && isFinite((r as any).originalPrice) ? (r as any).originalPrice : 119.99;
                  const rating = typeof (r as any).rating === "number" && isFinite((r as any).rating) ? (r as any).rating : genRating(key);
                  const students = typeof (r as any).students === "number" && isFinite((r as any).students) ? (r as any).students : genStudents(key);
                  return {
                    id: r.id,
                    title: normalizeTitle(r.title),
                    slug: r.slug,
                    image: r.image,
                    provider: r.provider,
                    category: r.category,
                    rating,
                    students,
                    price,
                    originalPrice,
                    updatedAt: (r as any).updatedAt as any,
                  };
                })}
                initial={4}
                step={4}
              />
            </section>
          )}

          <section style={{ marginTop: 32 }}>
            <h3>Udemy Coupon & Course Review</h3>
            <p className="muted" style={{ marginBottom: 24 }}>Here&apos;s what you can expect from this course with your Udemy discount:</p>
            
            <div style={{ display: 'grid', gap: 24 }}>
              {reviewParagraphs.map((paragraph, idx) => (
                <p key={idx} style={{ margin: 0, lineHeight: 1.7 }}>{paragraph}</p>
              ))}
            </div>
          </section>

          {d.faqs?.length ? (
            <section style={{ marginTop: 24 }}>
              <h3>FAQs</h3>
              <div style={{ display: "grid", gap: 8 }}>
                {d.faqs.map((f, idx) => (
                  <details key={idx} style={{ background: "var(--card)", border: "1px solid #1f2330", borderRadius: 8, padding: 12 }}>
                    <summary style={{ cursor: "pointer", fontWeight: 600 }}>{f.q}</summary>
                    <div style={{ color: "#a9b0c0", marginTop: 8 }}>{f.a}</div>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {/* RIGHT: course image with enroll button below (Udemy-like) */}
        <aside className="sticky" style={{ display: "grid", gap: 12 }}>
          {d.image && (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.image} alt={d.title} style={{ width: "100%", borderRadius: 12, border: "1px solid #1f2330" }} />
            </div>
          )}
          <div className="card">
            <div className="card-body" style={{ gap: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {displayPrice === 0 ? "Free" : `$${displayPrice.toFixed(2)}`}
                {displayOriginal ? (
                  <span className="muted" style={{ marginLeft: 8, textDecoration: "line-through", fontSize: 14 }}>
                    ${displayOriginal.toFixed(2)}
                  </span>
                ) : null}
              </div>
              {d.coupon && <div className="pill">Coupon: {d.coupon}</div>}
              <a className="btn" href={buildDealLink(d as any)} target="_blank" rel="noreferrer">Enroll now</a>
              <ActionsPanel deal={{ id: d.id, title: d.title, url: d.url }} />
              <div className="muted" style={{ fontSize: 12 }}>
                ⭐ {displayRating.toFixed(1)} • 👥 {displayStudents.toLocaleString()}
              </div>
              {d.expiresAt && (
                <div className="muted" style={{ fontSize: 12 }}>
                  Expires: {new Date(d.expiresAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const d = await getDeal(params.id);
    const normalizedTitle = normalizeTitle(d.title);
    const priceLabel =
      typeof d.price === "number" && isFinite(d.price)
        ? d.price === 0
          ? "Free"
          : `$${d.price.toFixed(2)}`
        : undefined;
    const fallbackDescription = [d.provider, d.category, priceLabel]
      .filter((part): part is string => Boolean(part))
      .join(" • ");
    const baseDescription = (d.description ?? "").trim() || fallbackDescription;
    const categoryLabel = (d.category ?? "Udemy").trim() || "Udemy";
    const description = `${baseDescription}${baseDescription ? " " : ""}This is applicable to ${categoryLabel} Udemy discount offers.`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const ogPrimary = d.image ? String(d.image) : `${siteUrl}/api/og/${d.id}`;
    const ogFallback = `${siteUrl}/api/og/${d.id}`;
    const openGraphImages = [
      ogPrimary ? { url: ogPrimary } : null,
      ogFallback ? { url: ogFallback, width: 1200, height: 630 } : null,
    ].filter(Boolean) as { url: string; width?: number; height?: number }[];

    const socialImages = [ogPrimary, ogFallback].filter(Boolean) as string[];

    const hasValidPrices =
      typeof d.originalPrice === "number" &&
      typeof d.price === "number" &&
      isFinite(d.originalPrice) &&
      isFinite(d.price) &&
      d.originalPrice > 0 &&
      d.originalPrice > d.price;
    let discountPct: number | null = null;
    if (hasValidPrices) {
      const original = d.originalPrice as number;
      const price = d.price as number;
      discountPct = Math.round(((original - price) / original) * 100);
    }
    const titleSuffix = discountPct !== null && discountPct > 0 ? `${discountPct}% Off Udemy Coupon` : "Udemy Coupon";
    const pageTitle = `${normalizedTitle} | ${titleSuffix}`;

    const ogMeta: Record<string, string> = d.image
      ? { "og:image": ogPrimary }
      : { "og:image": ogPrimary, "og:image:width": "1200", "og:image:height": "630" };
    return {
      title: pageTitle,
      description,
      alternates: { canonical: `/deal/${d.id}` },
      other: ogMeta,
      openGraph: {
        title: pageTitle,
        description,
        url: `/deal/${d.id}`,
        siteName: "Courseswyn",
        type: "article",
        images: openGraphImages,
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description,
        images: socialImages,
      },
    };
  } catch {
    return { title: "Deal Not Found | Courseswyn" };
  }
}
