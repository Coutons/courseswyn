import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div style={{ display: "grid", gap: 24, textAlign: "center", padding: "60px 0" }}>
      <div>
        <h1 style={{ marginBottom: 12 }}>We couldn&apos;t find that page</h1>
        <p className="muted" style={{ maxWidth: 520, margin: "0 auto" }}>
          The coupon or article you&apos;re looking for might have expired or moved. Try searching for fresh Udemy coupons or jump to one of the sections below.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        <Link href="/" className="pill">Back to homepage</Link>
        <Link href="/udemy-coupons" className="pill">Browse Udemy coupons</Link>
        <Link href="/search" className="pill">Search coupons</Link>
        <Link href="/categories" className="pill">View categories</Link>
      </div>

      <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
        <div className="card-body" style={{ textAlign: "left", display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>Popular quick links</h2>
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
            <li><a href="/?provider=udemy&freeOnly=1" className="footer-link">Free Udemy courses</a></li>
            <li><a href="/?provider=udemy&category=development" className="footer-link">Web development deals</a></li>
            <li><a href="/?provider=udemy&category=it-and-software" className="footer-link">IT & software coupons</a></li>
            <li><a href="/post/udemy-coupons-guide" className="footer-link">Udemy coupon guide</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
